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
                'receiver_name' => $address->receiver_name,
                'receiver_phone' => $address->receiver_phone,
                'street' => $address->street,
                'zipcode' => $address->zipcode,
                'number' => $address->number,
                'district' => $address->district,
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
            'receiver_name' => 'nullable|string|max:255',
            'receiver_phone' => 'nullable|string|max:20',
            'zipcode' => 'required|string|max:20',
            'street' => 'required|string|max:255',
            'number' => 'required|string|max:50',
            'district' => 'required|string|max:100',
            'complement' => 'nullable|string|max:255',
            ],
            [
                'street.required' => 'Street is required',
                'number.required' => 'Number is required',
                'district.required' => 'District is required',
                'zipcode.required' => 'Zipcode is required',
            ]
        );

        if ($validator->fails()) {
            return response()->json([
                'error'     => $validator->errors()->first(),
                'addresses' => []
            ], 400);
        }

        $isDefault = $user->addresses()->count() < 1;

        $user->addresses()->create([
            'receiver_name' => $request->input('receiver_name', $user->full_name),
            'receiver_phone' => $request->input('receiver_phone', $user->phone_number),
            'street' => $request->input('street'),
            'zipcode' => $request->input('zipcode'),
            'number' => $request->input('number'),
            'district' => $request->input('district'),
            'complement' => $request->input('complement'),
            'is_default' => $isDefault,
        ]);

        $addresses = $user->addresses;

        $result = [];

        foreach ($addresses as $address) {
            $result[] = [
                'id' => $address->id,
                'receiver_name' => $address->receiver_name,
                'receiver_phone' => $address->receiver_phone,
                'street' => $address->street,
                'zipcode' => $address->zipcode,
                'number' => $address->number,
                'district' => $address->district,
                'complement' => $address->complement,
                'is_default' => $address->is_default,
            ];
        }

        return \redirect()->intended(route('profile'));

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

        if ($user->addresses()->where('id', $addressId)->where('is_default', true)->exists()) {
            
            if ($user->addresses()->count() > 1 ) {
                $newDefaultAddress = $user->addresses()->where('id', '!=', $addressId)->first();
                $newDefaultAddress->is_default = true;
                $newDefaultAddress->save();
            }

        }

        $user->addresses()->where('id', $addressId)->delete();

        $addresses = $user->addresses;

        $result = [];

        foreach ($addresses as $address) {
            $result[] = [
                'id' => $address->id,
                'receiver_name' => $address->receiver_name,
                'receiver_phone' => $address->receiver_phone,
                'street' => $address->street,
                'zipcode' => $address->zipcode,
                'number' => $address->number,
                'district' => $address->district,
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
                'receiver_name'  => 'nullable|string|max:255',
                'receiver_phone' => 'nullable|string|max:20',
                'zipcode'        => 'nullable|string|max:20',
                'street'         => 'nullable|string|max:255',
                'number'         => 'nullable|string|max:50',
                'district'       => 'nullable|string|max:100',
                'complement'     => 'nullable|string|max:255',
            ],
            [
                'address_id.required' => 'Address ID is required',
                'address_id.integer'  => 'Address ID must be an integer',
                'address_id.exists'   => 'Address not found',
            ]
        );

        $validator->after(function ($validator) use ($request) {
            $updateFields = ['receiver_name', 'receiver_phone', 'zipcode', 'street', 'number', 'district', 'complement'];
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
        foreach (['receiver_name', 'receiver_phone', 'zipcode', 'street', 'number', 'district', 'complement'] as $field) {
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
                'receiver_name'  => $addr->receiver_name,
                'receiver_phone' => $addr->receiver_phone,
                'street' => $addr->street,
                'zipcode' => $addr->zipcode,
                'number' => $addr->number,
                'district' => $addr->district,
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
                'receiver_name'  => $address->receiver_name,
                'receiver_phone' => $address->receiver_phone,
                'street'  => $address->street,
                'zipcode' => $address->zipcode,
                'number'  => $address->number,
                'district'    => $address->district,
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
