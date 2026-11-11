<?php
// api/app/Http/Controllers/Api/ProductController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Services\SecuritySanitizer;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $request->validate([
            'filter' => 'nullable|string|max:50',
            'q' => 'nullable|string|max:100',
            'limit' => 'nullable|integer|min:1|max:100',
        ]);

        $query = Product::with('images');

        // 1. Filtro de vitrine / categoria vindo do useProducts(filter)
        if ($request->filled('filter')) {
            $filter = $request->input('filter');

            if ($filter === 'most-sell') {
                $query->orderByDesc('sales_count');
            } elseif ($filter === 'news' || $filter === 'release') {
                $query->latest();
            } else {
                $query->where('category', SecuritySanitizer::clean($filter));
            }
        }

        // 2. Busca textual segura com sanitização de tags e proteção por parameter binding do PDO
        if ($request->filled('q')) {
            $search = SecuritySanitizer::clean($request->input('q'));

            $query->where(function ($subQuery) use ($search) {
                $subQuery->where('label', 'like', "%{$search}%")
                         ->orWhere('active_ingredient', 'like', "%{$search}%")
                         ->orWhere('fabricator', 'like', "%{$search}%");
            });
        }

        // Proteção contra DoS de memória: limita no máximo a 100 registros por requisição
        $limit = min(max((int) $request->input('limit', 24), 1), 100);

        return response()->json($query->limit($limit)->get());
    }

    public function show(string $id)
    {
        $product = Product::with('images')->findOrFail($id);
        return response()->json($product);
    }
}