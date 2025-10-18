<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Product::create([
            'label' => 'ADDERA 2.000UI 30CPR IMUNIDADE',
            'description' => 'Vitamina D3 2.000UI, 30 comprimidos para suporte ao sistema imunológico.',
            'cost' => 73.37,
            'price' => 106.51,
            'manufacturer_id' => 1,
            'stock' => 10,
            'EAN' => '7896094919310',
            'category_id' => 1,
        ]);

        Product::create([
            'label' => 'BECAN GTS 20ML',
            'description' => 'Colírio para alívio de olhos secos e irritados.',
            'cost' => 68.66,
            'price' => 87.43,
            'manufacturer_id' => 2,
            'stock' => 4,
            'EAN' => '7899824400782',
            'category_id' => 1,
        ]);

        Product::create([
            'label' => 'CALDE MDK 1.000UI 30CPR',
            'description' => 'Suplemento de Vitamina D3 1.000UI, 30 comprimidos para saúde óssea.',
            'cost' => 66.80,
            'price' => 94.99,
            'manufacturer_id' => 3,
            'stock' => 7,
            'EAN' => 7896226109541,
            'category_id' => 2,
        ]);
    }
};
