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
            'is_default' => !empty($validated['is_default']),
        ];

        if ($cleanData['is_default']) {
            $user->addresses()->update(['is_default' => false]);
        }

        $address = $user->addresses()->create($cleanData);

        return response()->json($address, 201);
    }

    public function destroy(Request $request, string $id)
    {
        $address = $request->user()->addresses()->findOrFail($id);
        $address->delete();

        return response()->json(['message' => 'Endereço removido.']);
    }
}