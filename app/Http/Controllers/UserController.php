<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
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
            "user"  => $user->get()->map(function ($item) {
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

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'error' => null,
            'token' => $token
        ]);
    }

}
