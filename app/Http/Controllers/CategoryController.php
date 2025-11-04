<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\CategoryMetadata;
use Illuminate\Http\Request;

class CategoryController extends Controller {

    public function getAllCategories(Request $request)  {

        $categories = Category::all(['id', 'name', 'slug']);

        return response()->json([

            'error'      => null,
            'categories' => $categories

        ]);

    }

    public function getCategoryMetadataBySlug(Request $request, $slug)  {

        if (empty($slug) || !is_string($slug)) {

            return response()->json([

                'error'    => 'Invalid category slug',
                'metadata' => []

            ], 400);

        }

        $category = Category::where('slug', $slug)->first();

        if (!$category) {

            return response()->json([

                'error'    => 'Category not found',
                'metadata' => []

            ], 404);

        }

        $rawMetadata = $category->metadata()->get();

        $formattedMetadata = $rawMetadata->map( function ($item) {

            return [

                'id'   => $item->id,
                'name' => $item->label,
                'values' => $item->metadataValues()->get()->map( function ($value) {

                    return [

                        'id'    => $value->id,
                        'value' => $value->label

                    ];

                })

            ];

        });

        return response()->json([

            'error' => null,
            'category' => [

                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug

            ],
            'metadata' => $formattedMetadata

        ]);
    }

}
