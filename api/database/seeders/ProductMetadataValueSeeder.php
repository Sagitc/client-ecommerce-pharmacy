<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\ProductMetadata;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductMetadataValueSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // ADDERA 2.000UI 30CPR IMUNIDADE - Medicamento (category_id = 1)
        $product1 = Product::where('SKU', '002321')->first();
        if ($product1) {
            ProductMetadata::create([
                'product_id' => $product1->id,
                'category_metadata_id' => 'administration-method',
                'metadata_value_id' => 1, // Oral
            ]);
            ProductMetadata::create([
                'product_id' => $product1->id,
                'category_metadata_id' => 'recipe-required',
                'metadata_value_id' => 7, // Não
            ]);
            ProductMetadata::create([
                'product_id' => $product1->id,
                'category_metadata_id' => 'medication-indication',
                'metadata_value_id' => 14, // Vitaminas e Minerais
            ]);
            ProductMetadata::create([
                'product_id' => $product1->id,
                'category_metadata_id' => 'usage-age-type',
                'metadata_value_id' => 9, // Adulto
            ]);
        }

        // Sabonete Líquido Facial NIVEA Aqua Rose - Higiene e Cuidados Pessoais (category_id = 2)
        $product2 = Product::where('SKU', '002322')->first();
        if ($product2) {
            ProductMetadata::create([
                'product_id' => $product2->id,
                'category_metadata_id' => 'care-skin-type',
                'metadata_value_id' => 16, // Normal
            ]);
            ProductMetadata::create([
                'product_id' => $product2->id,
                'category_metadata_id' => 'care-function',
                'metadata_value_id' => 27, // Limpeza
            ]);
        }

        // Dipirona 500mg Genérico EMS - Medicamento (category_id = 1)
        $product3 = Product::where('SKU', '002323')->first();
        if ($product3) {
            ProductMetadata::create([
                'product_id' => $product3->id,
                'category_metadata_id' => 'administration-method',
                'metadata_value_id' => 1, // Oral
            ]);
            ProductMetadata::create([
                'product_id' => $product3->id,
                'category_metadata_id' => 'recipe-required',
                'metadata_value_id' => 7, // Não
            ]);
            ProductMetadata::create([
                'product_id' => $product3->id,
                'category_metadata_id' => 'medication-indication',
                'metadata_value_id' => 8, // Analgésico
            ]);
            ProductMetadata::create([
                'product_id' => $product3->id,
                'category_metadata_id' => 'medication-indication',
                'metadata_value_id' => 9, // Antitérmico
            ]);
        }

        // Creme Facial Antissinais L'Oréal - Higiene e Cuidados Pessoais (category_id = 2)
        $product4 = Product::where('SKU', '002324')->first();
        if ($product4) {
            ProductMetadata::create([
                'product_id' => $product4->id,
                'category_metadata_id' => 'care-skin-type',
                'metadata_value_id' => 17, // Seca
            ]);
            ProductMetadata::create([
                'product_id' => $product4->id,
                'category_metadata_id' => 'care-function',
                'metadata_value_id' => 25, // Hidratação
            ]);
        }

        // Paracetamol 750mg - Medicamento (category_id = 1)
        $product5 = Product::where('SKU', '002325')->first();
        if ($product5) {
            ProductMetadata::create([
                'product_id' => $product5->id,
                'category_metadata_id' => 'administration-method',
                'metadata_value_id' => 1, // Oral
            ]);
            ProductMetadata::create([
                'product_id' => $product5->id,
                'category_metadata_id' => 'recipe-required',
                'metadata_value_id' => 7, // Não
            ]);
            ProductMetadata::create([
                'product_id' => $product5->id,
                'category_metadata_id' => 'medication-indication',
                'metadata_value_id' => 8, // Analgésico
            ]);
            ProductMetadata::create([
                'product_id' => $product5->id,
                'category_metadata_id' => 'medication-indication',
                'metadata_value_id' => 9, // Antitérmico
            ]);
        }

        // Protetor Solar Facial ISDIN - Higiene e Cuidados Pessoais (category_id = 2)
        $product6 = Product::where('SKU', '002326')->first();
        if ($product6) {
            ProductMetadata::create([
                'product_id' => $product6->id,
                'category_metadata_id' => 'care-skin-type',
                'metadata_value_id' => 18, // Oleosa
            ]);
            ProductMetadata::create([
                'product_id' => $product6->id,
                'category_metadata_id' => 'care-function',
                'metadata_value_id' => 28, // Proteção
            ]);
        }

        // Amoxicilina 500mg - Medicamento (category_id = 1)
        $product7 = Product::where('SKU', '002327')->first();
        if ($product7) {
            ProductMetadata::create([
                'product_id' => $product7->id,
                'category_metadata_id' => 'administration-method',
                'metadata_value_id' => 1, // Oral
            ]);
            ProductMetadata::create([
                'product_id' => $product7->id,
                'category_metadata_id' => 'recipe-required',
                'metadata_value_id' => 6, // Sim
            ]);
            ProductMetadata::create([
                'product_id' => $product7->id,
                'category_metadata_id' => 'medication-indication',
                'metadata_value_id' => 12, // Antibiótico
            ]);
        }

        // Hidratante Labial Carmed - Higiene e Cuidados Pessoais (category_id = 2)
        $product8 = Product::where('SKU', '002328')->first();
        if ($product8) {
            ProductMetadata::create([
                'product_id' => $product8->id,
                'category_metadata_id' => 'care-scent',
                'metadata_value_id' => 23, // Frutado
            ]);
            ProductMetadata::create([
                'product_id' => $product8->id,
                'category_metadata_id' => 'care-function',
                'metadata_value_id' => 25, // Hidratação
            ]);
        }

        // Omeprazol 20mg - Medicamento (category_id = 1)
        $product9 = Product::where('SKU', '002329')->first();
        if ($product9) {
            ProductMetadata::create([
                'product_id' => $product9->id,
                'category_metadata_id' => 'administration-method',
                'metadata_value_id' => 1, // Oral
            ]);
            ProductMetadata::create([
                'product_id' => $product9->id,
                'category_metadata_id' => 'recipe-required',
                'metadata_value_id' => 7, // Não
            ]);
            ProductMetadata::create([
                'product_id' => $product9->id,
                'category_metadata_id' => 'medication-indication',
                'metadata_value_id' => 15, // Saúde Digestiva
            ]);
        }

        // Esmalte Risqué - Higiene e Cuidados Pessoais (category_id = 2)
        $product10 = Product::where('SKU', '002330')->first();
        if ($product10) {
            ProductMetadata::create([
                'product_id' => $product10->id,
                'category_metadata_id' => 'care-function',
                'metadata_value_id' => 28, // Proteção
            ]);
        }
    }
}
