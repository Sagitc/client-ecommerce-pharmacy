<?php
// api/app/Http/Controllers/Api/OrderController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $orders = $request->user()
            ->orders()
            ->with(['items.product', 'prescriptions', 'address', 'pharmacyUnit'])
            ->latest()
            ->get();

        return response()->json($orders);
    }

    public function show(Request $request, string $id)
    {
        $order = $request->user()
            ->orders()
            ->with(['items.product', 'prescriptions', 'address', 'pharmacyUnit'])
            ->findOrFail($id);

        return response()->json($order);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'shipping_method' => 'required|in:delivery,pickup',
            'address_id' => 'required_if:shipping_method,delivery|nullable|exists:addresses,id',
            'pharmacy_unit_id' => 'required_if:shipping_method,pickup|nullable|exists:pharmacy_units,id',
            'shipping_cost' => 'required|numeric|min:0',
            'payment_method' => 'required|in:pix,credit_card,debit_card,cash_on_delivery',
            'notes' => 'nullable|string|max:500',
            'items' => 'required|array|min:1',
            'items.*.id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'prescriptions' => 'nullable|array',
            'prescriptions.*' => 'file|mimes:jpg,jpeg,png,webp,pdf|max:5120', // Máx 5MB
        ]);

        return DB::transaction(function () use ($request, $validated) {
            $subtotal = 0;
            $requiresPrescription = false;
            $orderItemsData = [];

            // 1. Calcula o preço real pelo banco e verifica exigência de receita
            foreach ($validated['items'] as $item) {
                $product = Product::lockForUpdate()->findOrFail($item['id']);

                if ($product->requires_prescription) {
                    $requiresPrescription = true;
                }

                $unitPrice = $product->promotion_price ?? $product->price;
                $subtotal += $unitPrice * $item['quantity'];

                $orderItemsData[] = [
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'unit_price' => $unitPrice,
                ];

                // Incrementa vendas e abate estoque
                $product->increment('sales_count', $item['quantity']);
                if ($product->stock_quantity >= $item['quantity']) {
                    $product->decrement('stock_quantity', $item['quantity']);
                }
            }

            // 2. Trava de segurança ANVISA no Backend
            if ($requiresPrescription && !$request->hasFile('prescriptions')) {
                throw ValidationException::withMessages([
                    'prescriptions' => ['Este pedido contém medicamentos que exigem o envio da receita médica.'],
                ]);
            }

            $shippingCost = $validated['shipping_method'] === 'pickup' ? 0 : $validated['shipping_cost'];
            $total = $subtotal + $shippingCost;

            // 3. Cria o Pedido
            $order = Order::create([
                'order_number' => 'CAM-' . date('Y') . '-' . strtoupper(Str::random(6)),
                'user_id' => $request->user()->id,
                'shipping_method' => $validated['shipping_method'],
                'address_id' => $validated['address_id'] ?? null,
                'pharmacy_unit_id' => $validated['pharmacy_unit_id'] ?? null,
                'subtotal' => $subtotal,
                'shipping_cost' => $shippingCost,
                'discount' => 0,
                'total' => $total,
                'payment_method' => $validated['payment_method'],
                'payment_status' => 'pending',
                'status' => $requiresPrescription ? 'awaiting_prescription_review' : 'pending',
                'notes' => $validated['notes'] ?? null,
            ]);

            // 4. Salva os Itens do Pedido
            $order->items()->createMany($orderItemsData);

            // 5. Salva os arquivos de Receita Médica (se enviados)
            if ($request->hasFile('prescriptions')) {
                foreach ($request->file('prescriptions') as $file) {
                    $path = $file->store("prescriptions/{$order->id}", 'local');

                    $order->prescriptions()->create([
                        'file_path' => $path,
                        'original_name' => $file->getClientOriginalName(),
                        'mime_type' => $file->getClientMimeType(),
                        'status' => 'pending',
                    ]);
                }
            }

            return response()->json(
                $order->load(['items.product', 'prescriptions', 'address', 'pharmacyUnit']),
                201
            );
        });
    }
}