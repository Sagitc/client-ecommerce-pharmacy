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

        ];

        foreach ($images as $image) {

            ProductImage::create($image);
            
        }
        
    }
};
