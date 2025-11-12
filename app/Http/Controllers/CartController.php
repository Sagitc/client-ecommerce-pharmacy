<?php

namespace App\Http\Controllers;

use App\Models\Address;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class CartController extends Controller {
    
    public function mount(Request $request) {

        $validator = Validator::make(

            $request->all(),
            [
                'ids'   => ['required', 'array', 'min:1'],
                'ids.*' => ['numeric', 'min:1']
            ],
            [
                'ids.required' => 'O campo ids é obrigatório.',
                'ids.array'    => 'O campo ids deve ser um array.',
                'ids.min'      => 'O array ids deve conter pelo menos um item.',
                'ids.*.numeric'=> 'Cada id deve ser um valor numérico.',
                'ids.*.min'    => 'Cada id deve ser pelo menos 1.'
            ]
            
        );

        if ($validator->fails()) {

            return response()->json([

                'error' => $validator->errors()->first(),
                'cart'  => []

            ], 400);

        }

        $ids = $request->input('ids');

        $products = Product::with('images')->whereIn('id', $ids)->get();

        $formattedProducts = $products->map(function ($product) {

            return [

                'id'          => $product->id,
                'name'        => $product->label,
                'price'       => $product->price,
                'description' => $product->description,
                'images'      => asset($product->images->first()->image_path ?? 'storage/images/default.png'),

            ];

        });

        return response()->json([

            'error' => null,
            'cart'  => $formattedProducts

        ]);

    }

    public function getShipping(Request $request) {

        $validator = Validator::make(
            
            $request->all(),
            [  'zipcode'          => ['required', 'min:4']  ],
            [  'zipcode.required' => 'Zipcode é obrigatório.'  ]

        );

        if ($validator->fails()) {

            return response()->json([

                'error' => $validator->errors()->first(),
                'cart'  => []

            ], 400);

        }

        return response()->json([

            'error' => null,
            'shipping' => [

                'zipcode'  => $request->input('zipcode'),
                'price'    => 15.00,
                'days'     => 8

            ]

        ]);

    }

    public function finish(Request $request) {
        
        $validator = Validator::make(

            $request->all(),

            [
                "cart" => ["required", "array", "min:1"],
                "cart.*.product_id" => ["required", "numeric", "min:1"],
                "cart.*.quantity"   => ["required", "numeric", "min:1"],
                "address_id" => ["required", "numeric", "min:1"]
            ]

        );

        if ($validator->fails()) {

            return response()->json([

                'error' => $validator->errors()->first()

            ], 400);

        }

        $user = Auth::user();

        $address = Address::where('id', $request->input('address_id'))->first();

        if ($address->user_id != $user->id) {
            return response()->json([

                'error' => 'Endereço inválido para o usuário autenticado.',
                'products' => []

            ], 400);
        }

        $cart = $request->input('cart');
        $products = Product::whereIn('id', \array_column($cart, 'product_id'))->get();

        $total = 0;

        foreach ($cart as $item) {

            $product = $products->find( $item['product_id'] );

            $total += $product->price * $item['quantity'];

        }

        $order = Order::create([

            'user_id'    => $user->id,
            'shipping_cost' => 15.00,
            'shipping_days' => 8,
            'shipping_zipcode' => $address->zipcode,
            'shipping_number'  => $address->number,
            'shipping_complement' => $address->complement,
            'shipping_district'   => $address->district,
            'shipping_city'       => $address->city,
            'shipping_state'      => $address->state,
            'total'      => $total,
            'status'     => 'pending'

        ]);

        foreach ($cart as $item) {

            $product = $products->find( $item['product_id'] );

            $order->products()->create([

                'product_id' => $product->id,
                'quantity'   => $item['quantity'],
                'price'      => $product->price

            ]);

        }

        
    }

}
