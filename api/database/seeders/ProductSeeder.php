<?php
// api/database/seeders/ProductSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            [
                'label' => 'Vitamina C Efervescente 1g',
                'fabricator' => 'Cimed',
                'description' => 'Suplemento vitamínico auxiliar do sistema imunológico.',
                'price' => 15.90,
                'promotion_price' => 12.90,
                'image' => 'Imagem 1',
                'category' => 'suplement',
                'requires_prescription' => false,
                'in_stock' => true,
            ],
            [
                'label' => 'Protetor Solar Facial FPS 70',
                'fabricator' => 'La Roche-Posay',
                'description' => 'Protetor solar antioleosidade.',
                'price' => 89.90,
                'promotion_price' => null,
                'image' => 'Imagem 2',
                'category' => 'sunscreen',
                'requires_prescription' => false,
                'in_stock' => true,
            ],
            [
                'label' => 'Amoxicilina 500mg - 21 Cápsulas',
                'fabricator' => 'Eurofarma',
                'description' => 'Antibiótico de amplo espectro.',
                'price' => 35.00,
                'promotion_price' => null,
                'image' => 'Imagem 3',
                'category' => 'laboratory',
                'requires_prescription' => true,
                'in_stock' => true,
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}