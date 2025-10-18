<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function getAllProducts() {
        // Logic to retrieve all products

        $products = Product::with('category')->get();

        //  foreach ($products as $product) {
        //     $imagePaths = [];
        //     foreach ($product->images as $image) {
        //         $imagePaths[] = asset('images/' . $image->file_path);
        //     }
        //     $product->image_paths = $imagePaths;
        //     unset($product->images);
        // }
        
        return \response()->json([
            'error' => null,
            'products' => $products->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->label,
                    'ean' => $product->EAN,
                    'price' => $product->price,
                    'category' => $product->category ? $product->category->name : null,
                    'manufacturer' => $product->manufacturer ? $product->manufacturer->label : null,
                    'image' => asset($product->images->first()->image_path ?? null),
                    'liked' => $product->liked,
                ];
            }),
        ]);
    }
}
