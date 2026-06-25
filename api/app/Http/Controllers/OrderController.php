<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Validator;

class OrderController extends Controller
{

    public function store(Request $request)
    {

        $validator = Validator::make(

            $request->all(),
            [
                'products' => 'required|array|min:1',
                'products.*.id' => 'required|integer|exists:products,id',
                // 'shipping_address_id' => 'required|integer|exists:addresses,id',
                'payment_method' => 'required|string|in:credit_card,debit_card,pix,cash',
            ],
            [
                'products.required' => 'O campo produtos é obrigatório.',
                'products.array' => 'O campo produtos deve ser um array.',
                'products.min' => 'É necessário pelo menos um produto no pedido.',
                'products.*.id.required' => 'O ID do produto é obrigatório.',
                'products.*.id.integer' => 'O ID do produto deve ser um número inteiro.',
                'products.*.id.exists' => 'O produto selecionado não existe.',
                'products.*.quantity.required' => 'A quantidade do produto é obrigatória.',
                'products.*.quantity.integer' => 'A quantidade do produto deve ser um número inteiro.',
                'products.*.quantity.min' => 'A quantidade do produto deve ser pelo menos 1.',
                'shipping_address_id.required' => 'O campo endereço de entrega é obrigatório.',
                'shipping_address_id.integer' => 'O campo endereço de entrega deve ser um número inteiro.',
                'shipping_address_id.exists' => 'O endereço de entrega selecionado não existe.',
                'payment_method.required' => 'O campo método de pagamento é obrigatório.',
                'payment_method.string' => 'O campo método de pagamento deve ser uma string.',
                'payment_method.in' => 'O método de pagamento selecionado é inválido.',
            ]
        );

        if ($validator->fails()) {
            return response()->json([
                'error'   => $validator->errors(),
                'message' => 'Validação falhou.'
            ], 422);
        }

        $user    =  User::find(Auth::id());
        $product = Product::find($request->input('products.*.id'));

        foreach ($request->input('products') as $productData) {

            if (!Product::where('id', $productData['id'])->exists()) {
                return response()->json([
                    'error'   => 'Produto não encontrado',
                    'message' => 'Produto não encontrado: ' . $productData['id']
                ], 404);
            }

            $product = Product::find($productData['id']);

            if ($product->stock < $productData['quantity']) {
                return response()->json([
                    'error'   => 'Estoque insuficiente',
                    'message' => 'Estoque insuficiente para o produto: ' . $product->label
                ], 400);
            }
        }

        if ($user->orders()->where('status', 'pending')->exists()) {

            return response()->json([
                'error'   => 'Pedido pendente existente',
                'message' => 'Você já possui um pedido pendente. Por favor, aguarde a conclusão antes de criar um novo pedido.'
            ], 400);

        } else {
            
            try {
                $orderCreated = $user->orders()->create(
                    [
                        'total_amount' => 0, // Será atualizado depois
                        // 'shipping_address_id' => $request->input('shipping_address_id'),
                        'payment_method' => $request->input('payment_method'),
                    ]
                );

                foreach ($request->input('products') as $productData) {
                    $product = Product::find($productData['id']);
                    $quantity = $productData['quantity'];
                    $unitPrice = $product->price;
                    $subtotal = $unitPrice * $quantity;

                    $orderCreated->orderProducts()->create(
                        [
                            'product_id' => $product->id,
                            'quantity' => $quantity,
                            'unit_price' => $unitPrice,
                            'subtotal' => $subtotal,
                        ]
                    );

                    $product->stock -= $quantity;
                    $product->save();
                }

                // Atualiza o valor total do pedido
                $totalAmount = $orderCreated->orderProducts()->sum('subtotal');
                $orderCreated->total_amount = $totalAmount;
                $orderCreated->save();

                return response()->json([
                    'error'     => null,
                    'message'   => 'Pedido criado com sucesso.',
                    'order_id'  => 'Número do pedido: ' . $orderCreated->id
                ], 201);

            } catch (\Exception $e) {
                return response()->json([
                    'error' => $e->getMessage(),
                    'message' => 'Erro ao criar o pedido.',
                ], 500);
            }
        }
    }

    public function index(Request $request)
    {
        $user = User::find(Auth::id());

        if (!$user) {
            return response()->json([
                'error' => 'Usuário não encontrado.'
            ], 404);
        }

        if (! $user->orders()->exists()) {
            return response()->json([
                'error'  => null,
                'orders' => []
            ]);
        }

        $orders = $user->orders()->with('orderProducts.product')->map(function ($order) {
            return [
                'id' => $order->id,
                'status' => $order->status,
                'total_amount' => $order->total_amount,
                'products' => $order->orderProducts->map(function ($orderProduct) {
                    return [
                        'label' => $orderProduct->product->label,
                        'quantity' => $orderProduct->quantity,
                    ];
                }),
            ];
        })->toArray();

        return response()->json([
            'error'  => null,
            'orders' => $orders
        ]);
    }

    public function show(Request $request, $id)
    {
        $user =  User::find(Auth::id());

        $order = $user->orders()->with('orderProducts.product')->find($id);

        if (!$order) {
            return response()->json([
                'error' => 'Pedido não encontrado.',
                'orders' => null
            ], 404);
        }

        $formattedOrder = [
            'id'             => $order->id,
            'status'         => $order->status,
            'total_amount'   => $order->total_amount,
            'payment_method' => $order->payment_method,
            'products'       => $order->orderProducts->map(function ($orderProduct) {
                return [
                    'label'    => $orderProduct->product->label,
                    'price'    => $orderProduct->product->unit_price,
                    'quantity' => $orderProduct->quantity,
                    'subtotal' => $orderProduct->subtotal,
                ];
            }),
        ];

        return response()->json([
            'error' => null,
            'order' => $formattedOrder
        ]);
    }

    public function cancel(Request $request, $id)
    {
        $user  = User::find(Auth::id());
        $order = $user->orders()->find($id);

        if (!$order) {
            return response()->json([
                'error'   => 'Pedido não encontrado.',
                'message' => 'O pedido solicitado não foi encontrado.'
            ], 404);
        }

        if ($order->status === "completed" || $order->status === "cancelled") {
            return response()->json([
                'error'   => 'Pedido já cancelado ou concluído.',
                'message' => 'Não é possível cancelar um pedido concluído ou já cancelado'
            ], 400);
        }

        $order->status = "cancelled";
        $order->save();

        return response()->json([
            'error'   => null,
            'message' => 'Pedido cancelado com sucesso.'
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        Gate::authorize('access-admin');

        $orders = Order::with('orderProducts.product')->find($id);

        if (!$orders) {
            return response()->json([
                'error' => 'Pedido não encontrado.'
            ], 404);
        }

        $request->validate(
            [
                'status' => 'required|in:pending,processing,completed,cancelled',
            ],
            [
                'status.required' => 'O campo status é obrigatório.',
                'status.in'       => 'O status fornecido é inválido.',
            ]
        );

        $orders->status = $request->input('status');
        $orders->save();

        return response()->json([
            'error'   => null,
            'message' => 'Status do pedido atualizado com sucesso.'
        ]);
    }

    public function adminIndex(Request $request)
    {
        Gate::authorize('access-admin');

        $orders = Order::with('orderProducts.product', 'user')->get()->map(function ($order) {
            return [
                'id'           => $order->id,
                'user'         => [
                    'id'        => $order->user->id,
                    'full_name' => $order->user->full_name,
                ],
                'status'       => $order->status,
                'total_amount' => $order->total_amount,
                'products'     => $order->orderProducts->map(function ($orderProduct) {
                    return [
                        'label'    => $orderProduct->product->label,
                        'quantity' => $orderProduct->quantity,
                    ];
                }),
            ];
        })->toArray();

        return response()->json([
            'error'  => null,
            'orders' => $orders
        ]);
    }
}
