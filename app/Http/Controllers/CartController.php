<?php

namespace App\Http\Controllers;

use App\Models\Address;
use App\Models\Laboratory;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class CartController extends Controller {
    
    public function mount(Request $request) {

        $validator = Validator::make(

            request()->all(),
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

        $ids = request()->input('ids');

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

    public function add(Request $request) {

        $validator = Validator::make(

            request()->all(),
            [
                'id' => ['required', 'numeric'],
                'user_id' => ['required', 'numeric']
            ],
            [
                'id.required' => 'O campo id é obrigatório.',
                'id.numeric'  => 'O campo id deve ser um valor numérico.',
                'user_id.required' => 'O campo user_id é obrigatório.',
                'user_id.numeric' => 'O campo user_id deve ser um valor numérico.'
            ]
        );

        $id = request()->input('id');
        $user_id = \request()->input('user_id');

        $address = Address::where('user_id', $user_id)->first();

        $product = Product::with('images')->where('id', $id)->first();

        $order = Order::create([

            "user_id" => $user_id,
            "status"  => "Pending",
            "total"   => 0,
            "shipping_zipcode"    => ($address->value('zipcode')) ?? null,
            "shipping_street"     => ($address->value('street')) ?? null,
            "shipping_number"     => ($address->value('number')) ?? null,
            "shipping_complement" => ($address->value('complement')) ?? null,

        ]);

        $order->products()->create([
            
        ]);

        $formattedProduct = $product->map( function () use ($product) {

            return [

                "id" => $product->id,
                "label" => $product->label,
                "price" => $product->price,
                "laboratory" => Laboratory::where('id', $product->laboratory_id)->value('label')

            ];

        });
        
        return response()->json([

            'error' => null,
            'cart'  => $formattedProduct

        ]);

    }

    public function getShipping(Request $request) {

        $validator = Validator::make(
            
            request()->all(),
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

                'zipcode'  => request()->input('zipcode'),
                'price'    => 15.00,
                'days'     => 8

            ]

        ]);

    }

    public function finish(Request $request) {
        
        $validator = Validator::make(

            request()->all(),

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

        $address = Address::where('id', request()->input('address_id'))->first();

        if ($address->user_id != $user->id) {
            return response()->json([

                'error' => 'Endereço inválido para o usuário autenticado.',
                'products' => []

            ], 400);
        }

        $cart = request()->input('cart');
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
