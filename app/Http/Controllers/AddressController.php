<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;

class AddressController extends Controller
{
    public function getAddresses(Request $request) {

        try {
            $user = $request->user();
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Unauthorized',
                'addresses' => []
            ], 401);
        }

        $addresses = $user->addresses;

        $result = [];

        foreach ($addresses as $address) {
            $result[] = [
                'id' => $address->id,
                'street' => $address->street,
                'number' => $address->number,
                'neighborhood' => $address->neighborhood,
                'city' => $address->city,
                'state' => $address->state,
                'country' => $address->country,
                'complement' => $address->complement,
                'is_default' => $address->is_default,
            ];
        }

        return response()->json([
            'errror' => null,
            'addresses' => $result
        ], 200);
    }

    public function addAddress(Request $request) {

        try {
            $user = $request->user();
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Unauthorized',
                'addresses' => []
            ], 401);
        }

        $validator = Validator::make(
            $request->all(),
            [
            'street' => 'required|string|max:255',
            'number' => 'required|string|max:50',
            'neighborhood' => 'required|string|max:100',
            'city' => 'required|string|max:100',
            'state' => 'required|string|max:100',
            'country' => 'required|string|max:100',
            'complement' => 'nullable|string|max:255',
            ],
            [
                'street.required' => 'Street is required',
                'number.required' => 'Number is required',
                'neighborhood.required' => 'Neighborhood is required',
                'city.required' => 'City is required',
                'state.required' => 'State is required',
                'country.required' => 'Country is required',
            ]
        );

        if ($validator->fails()) {
            return response()->json([
                'error'     => $validator->errors()->first(),
                'addresses' => []
            ], 400);
        }

        $user->addresses()->create([
            'street' => $request->input('street'),
            'number' => $request->input('number'),
            'neighborhood' => $request->input('neighborhood'),
            'city' => $request->input('city'),
            'state' => $request->input('state'),
            'country' => $request->input('country'),
            'complement' => $request->input('complement'),
        ]);

        $addresses = $user->addresses;

        $result = [];

        foreach ($addresses as $address) {
            $result[] = [
                'id' => $address->id,
                'street' => $address->street,
                'number' => $address->number,
                'neighborhood' => $address->neighborhood,
                'city' => $address->city,
                'state' => $address->state,
                'country' => $address->country,
                'complement' => $address->complement,
                'is_default' => $address->is_default,
            ];
        }

        return response()->json([
            'error' => null,
            'addresses' => $result
        ], 201);



    }

    public function removeAddress(Request $request) {

        try {
            $user = $request->user();
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Unauthorized',
                'addresses' => []
            ], 401);
        }
        
        $validator = Validator::make(
            $request->all(),
            [
                'address_id' => 'required|integer|exists:addresses,id'
            ],
            [
                'address_id.required' => 'Address ID is required',
                'address_id.integer'  => 'Address ID must be an integer',
                'address_id.exists'   => 'Address not found'
            ]
        );

        if ($validator->fails()) {
            return response()->json([
                'error' => $validator->errors()->first(),
                'addresses' => []
            ], 400);
        }

        $addressId = $request->input('address_id');

        $user->addresses()->where('id', $addressId)->delete();

        $addresses = $user->addresses;

        $result = [];

        foreach ($addresses as $address) {
            $result[] = [
                'id' => $address->id,
                'street' => $address->street,
                'number' => $address->number,
                'neighborhood' => $address->neighborhood,
                'city' => $address->city,
                'state' => $address->state,
                'country' => $address->country,
                'complement' => $address->complement,
                'is_default' => $address->is_default,
            ];
        }

        return response()->json([
            'error' => null,
            'addresses' => $result
        ], 200);

    }

    public function updateAddress(Request $request) {
        
        try {
            $user = $request->user();
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Unauthorized',
                'addresses' => []
            ], 401);
        }

        $validator = Validator::make(
            $request->all(),
            [
                'address_id'     => 'required|integer|exists:addresses,id',
                'zipcode'        => 'nullable|string|max:20',
                'street'         => 'nullable|string|max:255',
                'number'         => 'nullable|string|max:50',
                'neighborhood'   => 'nullable|string|max:100',
                'city'           => 'nullable|string|max:100',
                'state'          => 'nullable|string|max:100',
                'country'        => 'nullable|string|max:100',
                'complement'     => 'nullable|string|max:255',
            ],
            [
                'address_id.required' => 'Address ID is required',
                'address_id.integer'  => 'Address ID must be an integer',
                'address_id.exists'   => 'Address not found',
            ]
        );

        $validator->after(function ($validator) use ($request) {
            $updateFields = ['zipcode', 'street', 'number', 'neighborhood', 'city', 'state', 'country', 'complement'];
            $hasUpdateField = false;
            
            foreach ($updateFields as $field) {
                if ($request->has($field) && $request->input($field) !== null) {
                    $hasUpdateField = true;
                    break;
                }
            }
            
            if (!$hasUpdateField) {
                $validator->errors()->add('address', 'At least one field must be provided to update the address.');
            }
        });

        if ($validator->fails()) {
            return response()->json([
                'error' => $validator->errors()->first(),
                'addresses' => []
            ], 400);
        }

        $addressId = $request->input('address_id');
        $address = $user->addresses()->where('id', $addressId)->first();

        if (!$address) {
            return response()->json([
                'error' => 'Address not found',
                'addresses' => []
            ], 404);
        }

        $updateData = [];
        foreach (['zipcode', 'street', 'number', 'neighborhood', 'city', 'state', 'country', 'complement'] as $field) {
            if ($request->has($field) && $request->input($field) !== null) {
                $updateData[$field] = $request->input($field);
            }
        }

        if (!empty($updateData)) {
            $address->update($updateData);
        }

        $addresses = $user->addresses;

        $result = [];

        foreach ($addresses as $addr) {
            $result[] = [
                'id' => $addr->id,
                'street' => $addr->street,
                'number' => $addr->number,
                'neighborhood' => $addr->neighborhood,
                'city' => $addr->city,
                'state' => $addr->state,
                'country' => $addr->country,
                'complement' => $addr->complement,
                'is_default' => $addr->is_default,
            ];
        }

        return response()->json([
            'error' => null,
            'addresses' => $result
        ], 200);
    }

    public function setDefaultAddress(Request $request) {

        try 
        {
            $user = $request->user();
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Unauthorized',
                'addresses' => []
            ], 401);
        }

        $validator = Validator::make(
            $request->all(),
            [
                'address_id' => 'required|integer|exists:addresses,id'
            ],
            [
                'address_id.required' => 'Address ID is required',
                'address_id.integer'  => 'Address ID must be an integer',
                'address_id.exists'   => 'Address not found'
            ]
        );

        if ($validator->fails()) {
            return response()->json([
                'error' => $validator->errors()->first(),
                'addresses' => []
            ], 400);
        }

        $addressId = $request->input('address_id');

        try {
            $user->addresses()->where('is_default', true)->update(['is_default' => false]);

            if ($user->addresses()->where('is_default', true)->pluck('id')->contains($addressId)) {
                return response()->json([
                    'error' => 'Address is already the default address',
                    'addresses' => []
                ], 400);
            }
            
            $user->addresses()->where('id', $addressId)->update(['is_default' => true]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to set default address',
                'addresses' => []
            ], 500);
        }

        $addresses = $user->addresses;

        $result = [];

        foreach ($addresses as $address) {
            $result[] = [
                'id' => $address->id,
                'street' => $address->street,
                'number' => $address->number,
                'neighborhood' => $address->neighborhood,
                'city' => $address->city,
                'state' => $address->state,
                'country' => $address->country,
                'complement' => $address->complement,
                'is_default' => $address->is_default,
            ];
        }

        return response()->json([
            'error' => null,
            'addresses' => $result
        ], 200);

    }

}
