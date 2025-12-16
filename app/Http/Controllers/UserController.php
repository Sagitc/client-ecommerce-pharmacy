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

    public function createAddress(Request $request)
    {

        $validator = Validator::make(
            $request->all(),
            [
                'street'       => 'required|string|max:255',
                'number'       => 'required|string|max:20',
                'complement'   => 'nullable|string|max:255',
                'country'      => 'required|string|max:100',
                'city'         => 'required|string|max:255',
                'state'        => 'required|string|size:2',
                'zipcode'     => 'required|string|max:20'
            ],
            [
                'street.required'       => 'Street is required',
                'street.string'         => 'Street must be a string',
                'street.max'            => 'Street must not exceed 255 characters',
                'number.required'       => 'Number is required',
                'number.string'         => 'Number must be a string',
                'number.max'            => 'Number must not exceed 20 characters',
                'complement.string'     => 'Complement must be a string',
                'complement.max'        => 'Complement must not exceed 255 characters',
                'city.required'         => 'City is required',
                'city.string'           => 'City must be a string',
                'city.max'              => 'City must not exceed 255 characters',
                'state.required'        => 'State is required',
                'state.string'          => 'State must be a string',
                'state.size'            => 'State must be exactly 2 characters',
                'zipcode.required'     => 'Zip code is required',
                'zipcode.string'       => 'Zip code must be a string',
                'zipcode.size'         => 'Zip code must be exactly 20 characters'
            ]
        );

        if ($validator->fails()) {

            return response()->json([

                'error' => $validator->errors()->first(),
                'addresses' => null

            ], 400);
        }

        $user = Auth::user();

        $address = Address::create([

            'user_id'    => $user->id,
            'street'     => $request->input('street'),
            'number'     => $request->input('number'),
            'complement' => $request->input('complement'),
            'country'    => $request->input('country'),
            'city'       => $request->input('city'),
            'state'      => $request->input('state'),
            'zipcode'    => $request->input('zipcode'),

        ]);

        return response()->json([

            'error'     => null,
            'addresses' => [
                'id'         => $address->id,
                'street'     => $address->street,
                'number'     => $address->number,
                'complement' => $address->complement,
                'country'    => $address->country,
                'city'       => $address->city,
                'state'      => $address->state,
                'zipcode'    => $address->zipcode,
            ]

        ]);
    }

    public function getUserAddresses(Request $request)
    {

        $user = Auth::user();

        $user = User::find($user->id);

        $addresses = $user->addresses()->get()->map(function ($address) {
            return [
                'id'         => $address->id,
                'street'     => $address->street,
                'number'     => $address->number,
                'complement' => $address->complement,
                'country'    => $address->country,
                'city'       => $address->city,
                'state'      => $address->state,
                'zipcode'    => $address->zipcode,
            ];
        });

        return response()->json([
            'error'     => null,
            'addresses' => $addresses
        ]);
    }

    public function getUserFavorites(Request $request)
    {
        $user = Auth::user();

        $user = User::find($user->id);

        $favorites = $user->favorites()->pluck('product_id')->toArray();

        return response()->json([
            'error' => null,
            'favorites' => $favorites
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

        $user = Auth::user();

        $user->favorites()->create([
            'product_id' => $request->input('product_id'),
        ]);

        return response()->json([
            'message' => 'Product added to favorites successfully.'
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
