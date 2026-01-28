<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\CategoryMetadata;
use App\Models\Product;
use Illuminate\Http\Request;

class MetadataController extends Controller
{
    public function index(Request $request)
    {
        $metadatas = [];

        try {

            $metadatas = CategoryMetadata::with('metadataValues')->get();

            return response()->json([
                'error' => null,
                'metadatas' => $metadatas
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error fetching metadata',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getMetadataByCategory(Request $request, $categorySlug)
    {
        if (!$categorySlug) {
            return response()->json([
                'message' => 'Category slug is required',
                'metadatas' => []
            ], 400);
        }

        try {

            $category = Category::where('slug', $categorySlug)->first();
            $metadatas = CategoryMetadata::where('category_id', $category->id)
                ->with('metadataValues')
                ->get();

            if (!$metadatas) {
                return response()->json([
                    'message' => 'No metadata found for this category',
                    'metadatas' => []
                ], 404);
            }

            $result = $metadatas->map(function ($metadata) {
                return [
                    'id' => $metadata->id,
                    'label' => $metadata->label,
                    'category_id' => $metadata->category_id,
                    'metadata_values' => $metadata->metadataValues->map(function ($value) {
                        return [
                            'id' => $value->id,
                            'category_metadata_id' => $value->category_metadata_id,
                            'label' => $value->label,
                        ];
                    }),
                ];
            });

            return response()->json([
                'error' => null,
                'metadatas' => $result
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error fetching metadata for category',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getMetadataValues(Request $request, $metadataId)
    {
        if (!$metadataId) {
            return response()->json([
                'message' => 'Metadata ID is required',
                'metadata_values' => []
            ], 400);
        }

        try {

            $metadataValues = CategoryMetadata::where('id', $metadataId)
                ->with('metadataValues')
                ->first()
                ->metadataValues;

            return response()->json([
                'error' => null,
                'metadata_values' => $metadataValues
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error fetching metadata values',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getMetadataByProduct(Request $request, $productId)
    {
        if (!$productId) {
            return response()->json([
                'message' => 'Product ID is required',
                'metadatas' => []
            ], 400);
        }

        try {

            $product = Product::find($productId);

            if (!$product) {
                return response()->json([
                    'message' => 'Product not found',
                    'metadatas' => []
                ], 404);
            }

            $metadatas = CategoryMetadata::whereHas('products', function ($query) use ($productId) {
                $query->where('product_id', $productId);
            })->with(['metadataValues' => function ($query) use ($productId) {
                // IMPORTANTE: Filtrar para trazer apenas o valor que o produto tem
                $query->whereHas('productMetadata', function ($q) use ($productId) {
                    $q->where('product_id', $productId);
                });
            }])->get();

            return response()->json(['metadatas' => $metadatas]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error fetching metadatas for product',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
