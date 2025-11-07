<?php

namespace App\Http\Controllers;

use App\Models\Address;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth as FacadesAuth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller {
    
    public function register(Request $request) {
        
        $validator = Validator::make(
            $request->all(),
            [
                'name'         => 'required|string|max:255',
                'cpf'          => 'required|string|size:11|unique:users',
                'email'        => 'required|string|email|max:255|unique:users',
                'password'     => 'required|string|min:8',
                'phone_number' => 'required|string|max:15'
            ],
            [
                'name.required'     => 'Name is required',
                'name.string'       => 'Name must be a string',
                'name.max'          => 'Name must not exceed 255 characters',
                'email.required'    => 'Email is required',
                'email.string'      => 'Email must be a string',
                'email.email'       => 'Email must be a valid email address',
                'email.max'         => 'Email must not exceed 255 characters',
                'email.unique'      => 'Email is already registered',
                'password.required' => 'Password is required',
                'password.string'   => 'Password must be a string',
                'password.min'      => 'Password must be at least 8 characters'
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

        return \response()->json([
            "error" => null,
            "user"  => $user->where('id', $user->id)->get()->map(function ($item) {
                return [
                    'id'    => $item->id,
                    'name'  => $item->full_name,
                    'email' => $item->email
                ];
            })
        ]);
    }

    public function login(Request $request) {
        
        $validator = Validator::make(
            $request->all(),
            [
                'email'    => 'required|string|email',
                'password' => 'required|string'
            ]
        );

        if ($validator->fails()) {

            return response()->json([

                'error' => 'Usuário ou senha inválidos',
                'token' => null

            ], 400);
        }

        $user = User::where('email', $request->input('email'))->first();

        if (!$user) {
            
            return response()->json([

                'error' => 'Usuário ou senha inválidos',
                'token' => null

            ], 400);

        }

        if (!Hash::check($request->input('password'), $user->password)) {
            
            return response()->json([

                'error' => 'Usuário ou senha inválidos',
                'token' => null

            ], 400);

        }

        $user->tokens()->delete();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'error' => null,
            'token' => $token
        ]);
    }

    public function createAddress(Request $request) {
        
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

        $user = FacadesAuth::user();

        $address = Address::create([

            'user_id'    => $user->id,
            'street'     => $request->input('street'),
            'number'     => $request->input('number'),
            'complement' => $request->input('complement'),
            'country'    => $request->input('country'),
            'city'       => $request->input('city'),
            'state'      => $request->input('state'),
            'zipcode'   => $request->input('zipcode'),

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
                'zipcode'   => $address->zipcode,
            ]

        ]);
    }

    public function getAddresses(Request $request) {

        $user = FacadesAuth::user();

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
                'zipcode'   => $address->zipcode,
            ];
        });

        return response()->json([
            'error'     => null,
            'addresses' => $addresses
        ]);
    }

}
