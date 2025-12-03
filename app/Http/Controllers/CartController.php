<?php

namespace App\Http\Controllers;

use App\Models\Address;
use App\Models\Cart;
use App\Models\Laboratory;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class CartController extends Controller
{

    public function mount(Request $request)
    {

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
                'ids.*.numeric' => 'Cada id deve ser um valor numérico.',
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

    public function add(Request $request)
    {

        $validator = Validator::make(

            request()->all(),
            [
                'product_id'               => ['required', 'numeric'],
                'user_id'          => ['required', 'numeric'],
                'product_quantity' => ['required', 'numeric']
            ],
            [
                'product_id.required' => 'O campo product_id é obrigatório.',
                'product_id.numeric'  => 'O campo product_id deve ser um valor numérico.',
                'user_id.required' => 'O campo user_id é obrigatório.',
                'user_id.numeric' => 'O campo user_id deve ser um valor numérico.',
                'product_quantity.numeric' => 'O campo product_quantity deve ser um valor numérico.',
                'product_quantity.required' => 'O campo product_quantity é obrigatório.'
            ]

        );

        if ($validator->fails()) {

            return response()->json([

                'error' => $validator->errors()->first(),
                'cart'  => []

            ], 400);
        }

        $product_id = \request()->input('product_id');
        $user_id    = \request()->input('user_id');
        $quantity   = \request()->input('product_quantity');

        $product = Product::with('images')->where('id', $product_id)->first();

        $cart      = Cart::where('user_id', $user_id)->first();
        $cartItem  = $cart ? $cart->products()->where('product_id', $product_id)->first() : null;

        if ($cartItem) {

            $cartItem->quantity = $cartItem->quantity + 1;
            $cartItem->price = $product->price * $cartItem->quantity;
            $cartItem->save();

            $formattedProduct = [

                "id"         => $product->id,
                "label"      => $product->label,
                "price"      => $product->price,
                "quantity"   => $cartItem->quantity,
                "laboratory" => Laboratory::where('id', $product->laboratory_id)->value('label'),
                "main_image" => asset($product->images->first()->image_path ?? 'storage/images/default.png')

            ];

            return response()->json([

                'error' => null,
                'cart'  => $formattedProduct

            ]);
            
        } 

        if (Cart::where('user_id', $user_id)->exists()) {

            $order = Cart::where('user_id', $user_id)->first();

        } else {

            $order = Cart::create([

                "user_id" => $user_id,
                "total"   => 0

            ]);

        }

        $order->products()->create([

            "product_id" => $product->id,
            "quantity"   => $quantity,
            "price"      => ($product->price * $quantity)

        ]);

        $formattedProduct = [

            "id" => $product->id,
            "label" => $product->label,
            "price" => $product->price,
            "quantity" => $quantity,
            "laboratory" => Laboratory::where('id', $product->laboratory_id)->value('label'),
            "main_image" => asset($product->images->first()->image_path ?? 'storage/images/default.png')

        ];

        return response()->json([

            'error' => null,
            'cart'  => $formattedProduct

        ]);
    }

    public function updateItem(Request $request)
    {
        $validator = Validator::make(

            request()->all(),
            [
                'product_id'       => ['required', 'numeric'],
                'user_id'          => ['required', 'numeric'],
                'product_quantity' => ['required', 'numeric']
            ],
            [
                'product_id.required' => 'O campo product_id é obrigatório.',
                'product_id.numeric'  => 'O campo product_id deve ser um valor numérico.',
                'user_id.required' => 'O campo user_id é obrigatório.',
                'user_id.numeric' => 'O campo user_id deve ser um valor numérico.',
                'product_quantity.numeric' => 'O campo product_quantity deve ser um valor numérico.',
                'product_quantity.required' => 'O campo product_quantity é obrigatório.'
            ]

        );

        if ($validator->fails()) {

            return response()->json([

                'error' => $validator->errors()->first(),
                'cart'  => []

            ], 400);
        }

        $product_id = \request()->input('product_id');
        $user_id    = \request()->input('user_id');
        $quantity   = \request()->input('product_quantity');

        $cart      = Cart::where('user_id', $user_id)->first();
        $cartItem  = $cart ? $cart->products()->where('product_id', $product_id)->first() : null;

        if (!$cartItem) {

            return response()->json([

                'error' => 'Item do pedido não encontrado.',
                'cart'  => []

            ], 404);
        }

        $cartItem->quantity = $quantity;
        $cartItem->price    = $cartItem->price * $quantity;
        $cartItem->save();

        return response()->json([

            'error' => null

        ]);

    }

    public function removeItem(Request $request)
    {
        $validator = Validator::make(

            request()->all(),
            [
                'product_id' => ['required', 'numeric'],
                'user_id'    => ['required', 'numeric']
            ],
            [
                'product_id.required' => 'O campo product_id é obrigatório.',
                'product_id.numeric'  => 'O campo product_id deve ser um valor numérico.',
                'user_id.required'    => 'O campo user_id é obrigatório.',
                'user_id.numeric'     => 'O campo user_id deve ser um valor numérico.'
            ]
        );

        if ($validator->fails()) {

            return response()->json([

                'error' => $validator->errors()->first()

            ], 400);
        }
        
        $product_id = \request()->input('product_id');
        $user_id    = \request()->input('user_id');

        $cart = Cart::where('user_id', $user_id)->first();
        

        if (!$cart || !$cart->products()->where('product_id', $product_id)->exists()) {

            return response()->json([

                'error' => 'Item do pedido não encontrado.'

            ], 404);
        }

        $cart->products()->where('product_id', $product_id)->delete();

        return response()->json([
            'error' => null
        ]);
    }

    public function removeCart(Request $request)
    {
        $validator = Validator::make(

            request()->all(),
            [
                'user_id'    => ['required', 'numeric']
            ],
            [
                'user_id.required'    => 'O campo user_id é obrigatório.',
                'user_id.numeric'     => 'O campo user_id deve ser um valor numérico.'
            ]
        );

        if ($validator->fails()) {

            return response()->json([

                'error' => $validator->errors()->first()

            ], 400);
        }
        
        $user_id = \request()->input('user_id');
        $cart    = Cart::where('user_id', $user_id)->first();
        

        if ($cart) {
            $cart->products()->delete();
            $cart->delete();
        }

        return response()->json([
            'error' => null
        ]);
    }

    public function getCart(Request $request)
    {

        $validator = Validator::make(

            request()->all(),
            [
                'user_id' => ['required', 'numeric']
            ],
            [
                'user_id.required' => 'O campo user_id é obrigatório.',
                'user_id.numeric'  => 'O campo user_id deve ser um valor numérico.'
            ]
        );

        if ($validator->fails()) {

            return response()->json([

                'error' => $validator->errors()->first(),
                'cart'  => []

            ], 400);
        }

        $user = \request()->input('user_id');

        $order = Cart::where('user_id', $user)->first();

        if (!$order) {

            return response()->json([

                'error' => null,
                'cart'  => []

            ]);
        }

        $cartItems = $order->products()->get();

        $formattedCart = $cartItems->map(function ($item) {

            $products = Product::with('images')->where('id', $item->product_id)->first();

            return [

                'id'          => $products->id,
                'label'       => $products->label,
                'price'       => $products->price,
                'quantity'    => $item->quantity,
                'laboratory'  => $products->laboratory->label,
                'main_image'  => $products->main_image,
            ];
        });

        return response()->json([

            'error' => null,
            'cart'  => $formattedCart

        ]);
    }

    public function finish(Request $request)
    {

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

            $product = $products->find($item['product_id']);

            $total += $product->price * $item['quantity'];
        }

        $order = Cart::create([

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

            $product = $products->find($item['product_id']);

            $order->products()->create([

                'product_id' => $product->id,
                'quantity'   => $item['quantity'],
                'price'      => $product->price

            ]);
        }
    }
}
