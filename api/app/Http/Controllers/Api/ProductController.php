<?php
// api/app/Http/Controllers/Api/ProductController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Services\SecuritySanitizer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        Product::ensureCatalogTaxonomyReady();

        $request->validate([
            'filter' => 'nullable|string|max:50',
            'q' => 'nullable|string|max:100',
            'category' => 'nullable|string|max:50',
            'subgroup' => 'nullable|string|max:100',
            'fabricator' => 'nullable|string|max:100',
            'metadata' => 'nullable|array|max:20',
            'metadata.*' => 'nullable|string|max:100',
            'min_price' => 'nullable|numeric|min:0',
            'max_price' => 'nullable|numeric|min:0',
            'order' => 'nullable|in:price_asc,price_desc,most_sold,newest',
            'limit' => 'nullable|integer|min:1|max:100',
        ]);

        $query = Product::with(['images', 'categoryRelation', 'subgroupRelation', 'metadataItems']);

        $hasCategoriesTable = Schema::hasTable('categories') && Schema::hasColumn('products', 'category_id');
        $hasSubgroupsTable = Schema::hasTable('subgroups') && Schema::hasColumn('products', 'subgroup_id');
        $hasMetadataTable = Schema::hasTable('subgroup_metadata') && Schema::hasTable('product_metadata');

        // 1. Filtro de vitrine / categoria vindo do useProducts(filter)
        if ($request->filled('filter')) {
            $filter = $request->input('filter');

            if ($filter === 'most-sell') {
                $query->orderByDesc('sales_count');
            } elseif ($filter === 'news' || $filter === 'release') {
                $query->latest();
            } else {
                $cleanFilter = SecuritySanitizer::clean($filter);
                $query->where(function ($q) use ($cleanFilter, $hasCategoriesTable) {
                    $q->where('category', $cleanFilter);
                    if ($hasCategoriesTable) {
                        $q->orWhereHas('categoryRelation', fn ($rel) => $rel->where('slug', $cleanFilter));
                    }
                });
            }
        }

        // 2. Busca textual segura com sanitização de tags e proteção por parameter binding do PDO
        if ($request->filled('q')) {
            $search = SecuritySanitizer::clean($request->input('q'));

            if ($search !== '') {
                $terms = preg_split('/\s+/', $search, -1, PREG_SPLIT_NO_EMPTY) ?: [$search];
                $hasSubgroupColumn = Schema::hasColumn('products', 'subgroup');

                foreach ($terms as $term) {
                    $escapedTerm = addcslashes($term, '%_\\');
                    $query->where(function ($subQuery) use (
                        $escapedTerm,
                        $hasSubgroupColumn,
                        $hasCategoriesTable,
                        $hasSubgroupsTable,
                        $hasMetadataTable
                    ) {
                        $subQuery->where('label', 'like', "%{$escapedTerm}%")
                                 ->orWhere('active_ingredient', 'like', "%{$escapedTerm}%")
                                 ->orWhere('fabricator', 'like', "%{$escapedTerm}%")
                                 ->orWhere('description', 'like', "%{$escapedTerm}%")
                                 ->orWhere('category', 'like', "%{$escapedTerm}%");

                        if ($hasSubgroupColumn) {
                            $subQuery->orWhere('subgroup', 'like', "%{$escapedTerm}%");
                        }
                        if ($hasCategoriesTable) {
                            $subQuery->orWhereHas('categoryRelation', function ($rel) use ($escapedTerm) {
                                $rel->where('slug', 'like', "%{$escapedTerm}%")
                                    ->orWhere('name', 'like', "%{$escapedTerm}%");
                            });
                        }
                        if ($hasSubgroupsTable) {
                            $subQuery->orWhereHas('subgroupRelation', function ($rel) use ($escapedTerm) {
                                $rel->where('name', 'like', "%{$escapedTerm}%");
                            });
                        }
                        if ($hasMetadataTable) {
                            $subQuery->orWhereHas('metadataItems', function ($rel) use ($escapedTerm) {
                                $rel->where('value', 'like', "%{$escapedTerm}%");
                            });
                        }
                    });
                }
            }
        }

        // 3. Filtros explícitos de categoria, subgrupo, metadados, fabricante e faixa de preço
        if ($request->filled('category')) {
            $cleanCategory = SecuritySanitizer::clean($request->input('category'));
            $query->where(function ($q) use ($cleanCategory, $hasCategoriesTable) {
                $q->where('category', $cleanCategory);
                if ($hasCategoriesTable) {
                    $q->orWhereHas('categoryRelation', function ($rel) use ($cleanCategory) {
                        $rel->where('slug', $cleanCategory)->orWhere('name', $cleanCategory);
                    });
                }
            });
        }

        if ($request->filled('subgroup')) {
            $cleanSubgroup = SecuritySanitizer::clean($request->input('subgroup'));
            $query->where(function ($q) use ($cleanSubgroup, $hasSubgroupsTable) {
                if (Schema::hasColumn('products', 'subgroup')) {
                    $q->where('subgroup', $cleanSubgroup);
                }
                if ($hasSubgroupsTable) {
                    $q->orWhereHas('subgroupRelation', function ($rel) use ($cleanSubgroup) {
                        $rel->where('name', $cleanSubgroup)->orWhere('slug', $cleanSubgroup);
                    });
                }
            });
        }

        if ($request->filled('metadata') && is_array($request->input('metadata')) && $hasMetadataTable) {
            foreach ($request->input('metadata') as $metaKey => $metaVal) {
                $cleanKey = SecuritySanitizer::clean((string) $metaKey);
                $cleanVal = SecuritySanitizer::clean((string) $metaVal);
                if ($cleanKey !== '' && $cleanVal !== '') {
                    $query->whereHas('metadataItems', function ($rel) use ($cleanKey, $cleanVal) {
                        $rel->where('name', $cleanKey)->where('value', $cleanVal);
                    });
                }
            }
        }

        if ($request->filled('fabricator')) {
            $query->where('fabricator', SecuritySanitizer::clean($request->input('fabricator')));
        }

        if ($request->filled('min_price')) {
            $minPrice = (float) $request->input('min_price');
            $query->whereRaw('COALESCE(promotion_price, price) >= ?', [$minPrice]);
        }

        if ($request->filled('max_price')) {
            $maxPrice = (float) $request->input('max_price');
            $query->whereRaw('COALESCE(promotion_price, price) <= ?', [$maxPrice]);
        }

        // 4. Ordenação
        if ($request->filled('order')) {
            $order = $request->input('order');
            if ($order === 'price_asc') {
                $query->orderByRaw('COALESCE(promotion_price, price) ASC');
            } elseif ($order === 'price_desc') {
                $query->orderByRaw('COALESCE(promotion_price, price) DESC');
            } elseif ($order === 'most_sold') {
                $query->orderByDesc('sales_count');
            } elseif ($order === 'newest') {
                $query->latest();
            }
        }

        // Proteção contra DoS de memória: limita no máximo a 100 registros por requisição
        $limit = min(max((int) $request->input('limit', 50), 1), 100);

        return response()->json($query->limit($limit)->get());
    }

    public function show(string $id)
    {
        Product::ensureCatalogTaxonomyReady();
        $product = Product::with(['images', 'categoryRelation', 'subgroupRelation', 'metadataItems'])->findOrFail($id);
        return response()->json($product);
    }

    public function categories()
    {
        Product::ensureCatalogTaxonomyReady();

        if (! Schema::hasTable('categories')) {
            return response()->json([]);
        }

        $categories = Category::with(['subgroups.metadataOptions'])
            ->orderBy('name')
            ->get();

        return response()->json($categories);
    }
}
