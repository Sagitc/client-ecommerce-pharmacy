<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
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

}
