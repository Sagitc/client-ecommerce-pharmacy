<?php
// api/app/Http/Controllers/Api/ProductController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with('images');

        // 1. Filtro de vitrine / categoria vindo do useProducts(filter)
        if ($request->filled('filter')) {
            $filter = $request->input('filter');

            if ($filter === 'most-sell') {
                $query->orderByDesc('sales_count');
            } elseif ($filter === 'news' || $filter === 'release') {
                $query->latest();
            } else {
                $query->where('category', $filter);
            }
        }

        // 2. Busca textual (Search Page) por nome, princípio ativo ou laboratório
        if ($request->filled('q')) {
            $search = $request->input('q');
            $query->where(function ($subQuery) use ($search) {
                $subQuery->where('label', 'like', "%{$search}%")
                         ->orWhere('active_ingredient', 'like', "%{$search}%")
                         ->orWhere('fabricator', 'like', "%{$search}%");
            });
        }

        $limit = $request->input('limit', 24);

        return response()->json($query->limit($limit)->get());
    }

    public function show(string $id)
    {
        $product = Product::with('images')->findOrFail($id);
        return response()->json($product);
    }
}