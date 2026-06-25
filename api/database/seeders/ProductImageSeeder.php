<?php

namespace Database\Seeders;

use App\Models\ProductImage;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductImageSeeder extends Seeder {
    
    public function run(): void {

        $images = [

            ['product_id' => 1, 'image_path' => 'images/products/7896094919310.jpg'],
            ['product_id' => 2, 'image_path' => 'images/products/7899824400782.jpg'],
            ['product_id' => 3, 'image_path' => 'images/products/7896226109541.jpg'],
            ['product_id' => 4, 'image_path' => 'images/products/product_example.png'],
            ['product_id' => 5, 'image_path' => 'images/products/product_example.png'],
            ['product_id' => 6, 'image_path' => 'images/products/product_example.png'],
            ['product_id' => 7, 'image_path' => 'images/products/product_example.png'],
            ['product_id' => 8, 'image_path' => 'images/products/product_example.png'],
            ['product_id' => 9, 'image_path' => 'images/products/product_example.png'],
            ['product_id' => 10, 'image_path' => 'images/products/product_example.png'],

        ];

        foreach ($images as $image) {

            ProductImage::create($image);
            
        }
        
    }
};
