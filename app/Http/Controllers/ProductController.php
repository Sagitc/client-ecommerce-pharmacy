<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;

class ProductController extends Controller  {

    public function getAllProducts(Request $request) {

        $validator =  Validator::make($request->query(), [

            'limit'      => ['sometimes', 'numeric'               ],
            'orderBy'    => ['sometimes', 'in:views,selling,price'],
            'laboratory' => ['sometimes', 'string'                ],
            'metadata'   => ['sometimes', 'string'                ]

        ]);

        if ($validator->fails()) {

            return \response()->json([

                'error'    => $validator->errors()->first(),
                'products' => []

            ], 400);

        }

        if ($request->filled('metadata')) {

            $rawMetadata = $request->query('metadata');
            $metadata = json_decode($rawMetadata, true);
            
            if (\json_last_error() !== JSON_ERROR_NONE) {

                return \response()->json([

                    'error'    => 'Invalid metadata format',
                    'products' => []

                ], 400);

            }

        }

        $metadataLabelsValidos = \App\Models\CategoryMetadata::pluck('label')->toArray();

        dd( $metadataLabelsValidos );

        foreach ($metadata as $key => $value) {
            
            if (!in_array($key, $metadataLabelsValidos)) {
                
                return \response()->json([

                    'error'    => "Metadata key '{$key}' does not exist.",
                    'products' => []
                ], 400);

            }

        }

        $limit   = $request->query('limit', 20);
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

                default:

                    $orderBy = 'id';
                    break;
            }
        }

        if ($request->query('laboratory')) {

            $laboratory = $request->query('laboratory');

            $laboratory_label = \strtoupper(substr($laboratory, 0, 1)) . strtolower(substr($laboratory, 1));

            $query->whereHas('laboratory', function ($q) use ($laboratory_label) {

                $q->where('label', $laboratory_label);

            });

        }

        $query->orderBy($orderBy, 'desc');
        $query->with('category', 'laboratory');
        $query->limit($limit);

        $products = $query->get();

        return \response()->json([

            'error' => null,

            'products' => $products->map(function ($product) {

                return [

                    'id' => $product->id,

                    'name' => $product->label,
                    'SKU'  => $product->SKU,

                    'stock'       => $product->stock,
                    'EAN'         => $product->EAN,
                    'views_count' => $product->views_count,
                    'sales_count' => $product->sales_count,

                    'cost'  => $product->cost,
                    'price' => $product->price,

                    'category'   => $product->category ? $product->category->name : null,
                    'laboratory' => $product->laboratory ? $product->laboratory->label : null,

                    'image' => asset($product->images->first()->image_path ?? null),

                    'liked' => $product->liked,

                ];

            }),

        ]);

    }

}
