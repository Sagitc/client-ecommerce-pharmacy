<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class PaymentMethodController extends Controller
{
    /**
     * Métodos de pagamento salvos no banco de dados estão inativos temporariamente,
     * pois os pagamentos são processados diretamente pelo gateway do Mercado Pago.
     */
    public function index(Request $request)
    {
        return response()->json([]);
    }

    public function store(Request $request)
    {
        return response()->json([
            'message' => 'O armazenamento de métodos de pagamento está desativado. Os pagamentos são processados diretamente pelo Mercado Pago.',
        ], 403);
    }

    public function setDefault(Request $request, string $id)
    {
        return response()->json([
            'message' => 'O armazenamento de métodos de pagamento está desativado. Os pagamentos são processados diretamente pelo Mercado Pago.',
        ], 403);
    }

    public function destroy(Request $request, string $id)
    {
        return response()->json([
            'message' => 'O armazenamento de métodos de pagamento está desativado. Os pagamentos são processados diretamente pelo Mercado Pago.',
        ], 403);
    }
}
