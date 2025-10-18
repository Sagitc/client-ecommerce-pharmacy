<?php

namespace Database\Seeders;

use App\Models\ProductImage;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductImageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        ProductImage::create([
            'product_id' => 1,
            'image_path' => 'images/products/7896094919310.jpg',
        ]);

        ProductImage::create([
            'product_id' => 2,
            'image_path' => 'images/products/7899824400782.jpg',
        ]);

        ProductImage::create([
            'product_id' => 3,
            'image_path' => 'images/products/7896226109541.jpg',
        ]);
    }
};
