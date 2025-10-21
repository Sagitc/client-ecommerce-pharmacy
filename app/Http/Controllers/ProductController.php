<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Manufacturer;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function getAllProducts(Request $request) {

        $validator =  Validator::make($request->query(), [
            'limit' => ['sometimes', 'numeric'],
            'orderBy' => ['sometimes', 'in:views,selling,price'],
            'manufacturer' => ['sometimes', 'string'],
            'metadata' => ['sometimes', 'string'],
        ]);

        if ($validator->fails()) {
            return \response()->json([
                'error' => $validator->errors()->first(),
                'products' => []
            ], 400);
        }

        $limit = $request->query('limit', 20);
        $orderBy = 'id';

        $query = Product::query();

        if ($request->query('orderBy')) {
            switch ($request->query('orderBy')) {
                case 'views':
                    $orderBy = 'views_count';
                    break;
                case 'selling':
                    $orderBy = 'sales_count';
                    break;
                case 'price':
                    $orderBy = 'price';
                    break;
            }
        }

        if ($request->query('manufacturer')) {
            $manufacturer = $request->query('manufacturer');

            $manufacturer_label = \strtoupper(substr($manufacturer, 0, 1)) . strtolower(substr($manufacturer, 1));

            $query->whereHas('manufacturer', function ($q) use ($manufacturer_label) {
                $q->where('label', $manufacturer_label);
            });
        }

        $query->orderBy($orderBy, 'desc');
        $query->with('category', 'manufacturer');
        $query->limit($limit);

        $products = $query->get();

        return \response()->json([
            'error' => null,
            'products' => $products->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->label,
                    'EAN' => $product->EAN,
                    'price' => $product->price,
                    'category' => $product->category ? $product->category->name : null,
                    'manufacturer' => $product->manufacturer ? $product->manufacturer->label : null,
                    'views_count' => $product->views_count,
                    'sales_count' => $product->sales_count,
                    'image' => asset($product->images->first()->image_path ?? null),
                    'liked' => $product->liked,
                ];
            }),
        ]);
    }
}
