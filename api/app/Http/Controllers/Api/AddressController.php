<?php
// api/app/Http/Controllers/Api/AddressController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\SecuritySanitizer;
use Illuminate\Http\Request;

class AddressController extends Controller
{
    public function index(Request $request)
    {
        return response()->json(
            $request->user()->addresses()->orderByDesc('is_default')->get()
        );
    }

    public function store(Request $request)
    {
        $user = $request->user();

        // Prevenção de DoS / Injeção massiva de endereços por usuário
        if ($user->addresses()->count() >= 10) {
            abort(422, 'Limite máximo de 10 endereços cadastrados atingido.');
        }

        $validated = $request->validate([
            'label' => 'nullable|string|max:50',
            'cep' => ['required', 'string', 'max:9', 'regex:/^\d{5}-?\d{3}$/'],
            'street' => 'required|string|max:255',
            'number' => 'required|string|max:20',
            'complement' => 'nullable|string|max:255',
            'neighborhood' => 'required|string|max:100',
            'city' => 'required|string|max:100',
            'state' => ['nullable', 'string', 'size:2', 'regex:/^[A-Za-z]{2}$/'],
            'is_default' => 'boolean',
        ]);

        $hasExistingAddresses = $user->addresses()->exists();
        $hasDefaultAddress = $user->addresses()->where('is_default', true)->exists();
        $shouldBeDefault = !empty($validated['is_default']) || !$hasExistingAddresses || !$hasDefaultAddress;

        // Sanitização contra XSS em todos os campos de texto
        $cleanData = [
            'label' => !empty($validated['label']) ? SecuritySanitizer::clean($validated['label']) : 'Casa',
            'cep' => trim($validated['cep']),
            'street' => SecuritySanitizer::clean($validated['street']),
            'number' => SecuritySanitizer::clean($validated['number']),
            'complement' => !empty($validated['complement']) ? SecuritySanitizer::clean($validated['complement']) : null,
            'neighborhood' => SecuritySanitizer::clean($validated['neighborhood']),
            'city' => SecuritySanitizer::clean($validated['city']),
            'state' => strtoupper(trim($validated['state'] ?? 'RJ')),
            'is_default' => $shouldBeDefault,
        ];

        if ($cleanData['is_default']) {
            $user->addresses()->update(['is_default' => false]);
        }

        $address = $user->addresses()->create($cleanData);

        return response()->json($address, 201);
    }

    public function update(Request $request, string $id)
    {
        $user = $request->user();
        $address = $user->addresses()->findOrFail($id);

        $validated = $request->validate([
            'label' => 'nullable|string|max:50',
            'cep' => ['sometimes', 'string', 'max:9', 'regex:/^\d{5}-?\d{3}$/'],
            'street' => 'sometimes|string|max:255',
            'number' => 'sometimes|string|max:20',
            'complement' => 'nullable|string|max:255',
            'neighborhood' => 'sometimes|string|max:100',
            'city' => 'sometimes|string|max:100',
            'state' => ['nullable', 'string', 'size:2', 'regex:/^[A-Za-z]{2}$/'],
            'is_default' => 'boolean',
        ]);

        $cleanData = [];
        if (isset($validated['label'])) {
            $cleanData['label'] = SecuritySanitizer::clean($validated['label']);
        }
        if (isset($validated['cep'])) {
            $cleanData['cep'] = trim($validated['cep']);
        }
        if (isset($validated['street'])) {
            $cleanData['street'] = SecuritySanitizer::clean($validated['street']);
        }
        if (isset($validated['number'])) {
            $cleanData['number'] = SecuritySanitizer::clean($validated['number']);
        }
        if (array_key_exists('complement', $validated)) {
            $cleanData['complement'] = !empty($validated['complement']) ? SecuritySanitizer::clean($validated['complement']) : null;
        }
        if (isset($validated['neighborhood'])) {
            $cleanData['neighborhood'] = SecuritySanitizer::clean($validated['neighborhood']);
        }
        if (isset($validated['city'])) {
            $cleanData['city'] = SecuritySanitizer::clean($validated['city']);
        }
        if (isset($validated['state'])) {
            $cleanData['state'] = strtoupper(trim($validated['state']));
        }
        if (array_key_exists('is_default', $validated)) {
            $cleanData['is_default'] = (bool) $validated['is_default'];
            if ($cleanData['is_default']) {
                $user->addresses()->where('id', '!=', $address->id)->update(['is_default' => false]);
            }
        }

        $address->update($cleanData);

        return response()->json($address->fresh());
    }

    public function setDefault(Request $request, string $id)
    {
        $user = $request->user();
        $address = $user->addresses()->findOrFail($id);

        $user->addresses()->update(['is_default' => false]);
        $address->update(['is_default' => true]);

        return response()->json($address->fresh());
    }

    public function destroy(Request $request, string $id)
    {
        $user = $request->user();
        $address = $user->addresses()->findOrFail($id);
        $wasDefault = (bool) $address->is_default;

        $address->delete();

        if ($wasDefault || ! $user->addresses()->where('is_default', true)->exists()) {
            $nextAddress = $user->addresses()->first();
            if ($nextAddress) {
                $nextAddress->update(['is_default' => true]);
            }
        }

        return response()->json(['message' => 'Endereço removido.']);
    }
}