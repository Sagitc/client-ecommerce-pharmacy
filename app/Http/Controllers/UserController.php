<?php

namespace App\Http\Controllers;

use App\Models\Address;
use App\Models\User;
use App\Models\Favorite;
use App\Rules\CpfOrEmailRule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{

    public function getUser(Request $request)
    {
        if (Auth::check()) {
            return response()->json([

                'id' => Auth::id(),
                'full_name' => Auth::user()->full_name,
                'email' =>  Auth::user()->email,
                'cpf' =>  Auth::user()->cpf,
                'phone_number' =>  Auth::user()->phone_number,
                'role' =>  Auth::user()->role,

            ]);
        } 

        return response()->json([

            'Message' => 'Não autenticado',
            'Check' => Auth::check()

        ], 401);
    }

    public function register(Request $request)
    {

        $validator = Validator::make(
            $request->all(),
            [
                'full_name'             => 'required|string|max:255',
                'cpf'                   => ['required', 'unique:users', new CpfOrEmailRule],
                'email'                 => 'required|string|email|max:255|unique:users',
                'password'              => 'required|string|min:8',
                'password_confirmation' => 'required|string|same:password',
                'phone_number'          => 'required|string|max:15'
            ],
            [
                'name.required'                  => 'Name is required',
                'name.string'                    => 'Name must be a string',
                'name.max'                       => 'Name must not exceed 255 characters',
                'email.required'                 => 'Email is required',
                'email.string'                   => 'Email must be a string',
                'email.email'                    => 'Email must be a valid email address',
                'email.max'                      => 'Email must not exceed 255 characters',
                'email.unique'                   => 'Email is already registered',
                'password.required'              => 'Password is required',
                'password.string'                => 'Password must be a string',
                'password.min'                   => 'Password must be at least 8 characters',
                'password_confirmation.required' => 'Password confirmation is required',
                'password_confirmation.string'   => 'Password confirmation must be a string',
                'password_confirmation.same'     => 'Password confirmation must match the password',
                'phone_number.required'          => 'Phone number is required',
                'phone_number.string'            => 'Phone number must be a string',
                'phone_number.max'               => 'Phone number must not exceed 15 characters'
            ]
        );

        if ($validator->fails()) {
            return response()->json([
                'error' => $validator->errors()->first(),
            ], 400);
        }

        $user = User::create([

            'full_name'    => $request->input('name'),
            'cpf'          => $request->input('cpf'),
            'email'        => $request->input('email'),
            'password'     => Hash::make($request->input('password')),
            'phone_number' => $request->input('phone_number'),

        ]);

        Auth::login($user);

        return redirect()->intended(route('home'));
    }

    public function login(Request $request)
    {

        $request->validate([
            'identifier' => ['required', new CpfOrEmailRule],
            'password'   => 'required|string',
            'remember'   => 'nullable|boolean'
        ]);

        $identifier = $request->input('identifier');
        $field = filter_var($identifier, FILTER_VALIDATE_EMAIL) ? 'email' : 'cpf';

        $credentials = [
            $field    => $identifier,
            'password' => $request->input('password')
        ];

        if (Auth::attempt($credentials, $request->boolean('remember'))) {
            $request->session()->regenerate();
            return redirect()->intended(route('home'));
        }

        return back()->withErrors([
            'identifier' => 'Credenciais inválidas.'
        ])->onlyInput('identifier');
    }

    public function getUserFavorites(Request $request)
    {
        $user = Auth::user();

        $user = User::find($user->id);

        // $favorites = $user->favorites()->pluck('product_id')->toArray();

        $products = $user->favorites()->with('product')->get()->map(function ($favorite) {
            return [
                'id'           => $favorite->product->id,
                'label'        => $favorite->product->label,
                'description'  => $favorite->product->description,
                'price'        => $favorite->product->price,
                'image'        => $favorite->product->main_image,
            ];
        });

        return response()->json([
            'error' => null,
            'favorites' => $products
        ]);
    }

    public function addUserFavorite(Request $request)
    {

        $request->validate([
            'product_id' => 'required|integer|exists:products,id',
        ],
        [
            'product_id.required' => 'Product ID is required.',
            'product_id.integer'  => 'Product ID must be an integer.',
            'product_id.exists'   => 'Product does not exist.',
        ]);


        $userId = Auth::user()->id;
        $user = User::find($userId);

        $user->favorites()->create([
            'product_id' => $request->input('product_id'),
        ]);

        $favorites = $user->favorites()->pluck('product_id')->toArray();

        return response()->json([
            'message'   => 'Product added to favorites successfully.',
            'favorites' => $favorites
        ]);
    }

    public function removeUserFavorite(Request $request)
    {

        $request->validate([
            'product_id' => 'required|integer|exists:products,id',
        ],
        [
            'product_id.required' => 'Product ID is required.',
            'product_id.integer'  => 'Product ID must be an integer.',
            'product_id.exists'   => 'Product does not exist.',
        ]);

        $userId = Auth::user()->id;
        $user   = User::find($userId);

        $user->favorites()->where('product_id', $request->input('product_id'))->delete();
        
        $favorites = $user->favorites()->pluck('product_id')->toArray();

        return response()->json([
            'message'   => 'Product removed from favorites successfully.',
            'favorites' => $favorites
        ]);
    }

    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
