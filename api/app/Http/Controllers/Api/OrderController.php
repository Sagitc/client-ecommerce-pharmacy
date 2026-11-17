<?php
// api/app/Http/Controllers/Api/OrderController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use App\Models\Order;
use App\Models\Product;
use App\Services\SecuritySanitizer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
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
            ->where(function ($query) use ($id) {
                if (is_numeric($id)) {
                    $query->where('id', $id);
                } else {
                    $query->where('order_number', $id);
                }
            })
            ->firstOrFail();

        return response()->json($order);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'shipping_method' => 'required|in:delivery,pickup',
            'address_id' => [
                'required_if:shipping_method,delivery',
                'nullable',
                Rule::exists('addresses', 'id')->where('user_id', $request->user()->id),
            ],
            'pharmacy_unit_id' => [
                'required_if:shipping_method,pickup',
                'nullable',
                Rule::exists('pharmacy_units', 'id')->where('is_active', true),
            ],
            'shipping_cost' => 'required|numeric|min:0|max:500',
            'payment_method' => 'required|in:pix,credit_card,debit_card,cash_on_delivery',
            'coupon_code' => 'nullable|string|max:64',
            'notes' => 'nullable|string|max:500',
            'items' => 'required|array|min:1|max:50',
            'items.*.id' => 'required|integer|distinct|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1|max:100',
            'prescriptions' => 'nullable|array|max:10',
            'prescriptions.*' => 'file|mimes:jpg,jpeg,png,webp,pdf|max:5120', // Máx 5MB
        ]);

        return DB::transaction(function () use ($request, $validated) {
            $subtotal = 0;
            $requiresPrescription = false;
            $orderItemsData = [];

            // 1. Calcula o preço real pelo banco, valida estoque e verifica exigência de receita
            foreach ($validated['items'] as $item) {
                $product = Product::lockForUpdate()->findOrFail($item['id']);

                // Proteção contra compra de produtos sem estoque suficiente
                if (! $product->in_stock || $product->stock_quantity < $item['quantity']) {
                    throw ValidationException::withMessages([
                        'items' => ["O produto '{$product->label}' não possui estoque suficiente disponível."],
                    ]);
                }

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

                // Incrementa vendas e abate estoque garantido
                $product->increment('sales_count', $item['quantity']);
                $product->decrement('stock_quantity', $item['quantity']);
            }

            // 2. Trava de segurança ANVISA no Backend
            if ($requiresPrescription && !$request->hasFile('prescriptions')) {
                throw ValidationException::withMessages([
                    'prescriptions' => ['Este pedido contém medicamentos que exigem o envio da receita médica.'],
                ]);
            }

            $shippingCost = $validated['shipping_method'] === 'pickup' ? 0 : $validated['shipping_cost'];
            $discount = 0.0;
            $couponId = null;
            $couponCode = null;

            if (! empty($validated['coupon_code'])) {
                $normalizedCode = Coupon::normalizeCode(SecuritySanitizer::clean($validated['coupon_code']));

                if ($normalizedCode === '') {
                    throw ValidationException::withMessages([
                        'coupon_code' => ['Cupom inexistente'],
                    ]);
                }

                if (! Coupon::ensureSchemaReady()) {
                    throw ValidationException::withMessages([
                        'coupon_code' => ['Não foi possível validar o cupom no momento.'],
                    ]);
                }

                $coupon = Coupon::where('code', $normalizedCode)->lockForUpdate()->first();

                if (! $coupon) {
                    throw ValidationException::withMessages([
                        'coupon_code' => ['Cupom inexistente'],
                    ]);
                }

                $user = $request->user();
                $couponError = $coupon->getValidationError($subtotal, $user);
                if ($couponError !== null) {
                    throw ValidationException::withMessages([
                        'coupon_code' => [$couponError],
                    ]);
                }

                $userCoupon = $user->userCoupons()
                    ->where('coupon_id', $coupon->id)
                    ->lockForUpdate()
                    ->first();

                if (! $userCoupon || $userCoupon->uses_remaining <= 0) {
                    throw ValidationException::withMessages([
                        'coupon_code' => ['Você precisa resgatar este cupom no seu inventário antes de utilizá-lo.'],
                    ]);
                }

                $discount = $coupon->calculateDiscount($subtotal);
                $couponId = $coupon->id;
                $couponCode = $coupon->code;
                $coupon->increment('used_count');

                $remaining = (int) $userCoupon->uses_remaining - 1;
                if ($remaining <= 0) {
                    $userCoupon->delete();
                } else {
                    $userCoupon->update([
                        'uses_remaining' => $remaining,
                        'used_count' => (int) $userCoupon->used_count + 1,
                    ]);
                }
            }

            $total = max(0.0, round($subtotal + $shippingCost - $discount, 2));

            // 3. Cria o Pedido com sanitização de campos de texto
            $orderPayload = [
                'order_number' => 'CAM-' . date('Y') . '-' . strtoupper(Str::random(6)),
                'user_id' => $request->user()->id,
                'shipping_method' => $validated['shipping_method'],
                'address_id' => $validated['address_id'] ?? null,
                'pharmacy_unit_id' => $validated['pharmacy_unit_id'] ?? null,
                'subtotal' => $subtotal,
                'shipping_cost' => $shippingCost,
                'discount' => $discount,
                'total' => $total,
                'payment_method' => $validated['payment_method'],
                'payment_status' => 'pending',
                'status' => $requiresPrescription ? 'awaiting_prescription_review' : 'pending',
                'notes' => !empty($validated['notes']) ? SecuritySanitizer::clean($validated['notes']) : null,
            ];

            if (Schema::hasColumn('orders', 'coupon_id')) {
                $orderPayload['coupon_id'] = $couponId;
            }
            if (Schema::hasColumn('orders', 'coupon_code')) {
                $orderPayload['coupon_code'] = $couponCode;
            }

            $order = Order::create($orderPayload);

            // 4. Salva os Itens do Pedido
            $order->items()->createMany($orderItemsData);

            // Limpa o carrinho da conta do usuário após concluir o pedido
            if (Schema::hasTable('cart_items')) {
                $request->user()->cartItems()->delete();
            }

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