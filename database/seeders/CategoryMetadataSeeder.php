<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategoryMetadataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $metadataMethod = Category::first()->metadata()->create([
            'id' => 'administration_method',
            'label' => 'Método de Administração',
        ]);

        $metadataGroup = Category::first()->metadata()->create([
            'id' => 'pharmaceutical_group',
            'label' => 'Grupo Farmacêutico',
        ]);

        //  ----------------------

        $metadataMethod->metadataValues()->create([
            'id' => 'capsula',
            'label' => 'Capsula',
        ]);

        $metadataMethod->metadataValues()->create([
            'id' => 'comprimido',
            'label' => 'Comprimido',
        ]);

        $metadataMethod->metadataValues()->create([
            'id' => 'retal',
            'label' => 'Retal',
        ]);

        $metadataMethod->metadataValues()->create([
            'id' => 'xarope',
            'label' => 'Xarope',
        ]);

        $metadataMethod->metadataValues()->create([
            'id' => 'gotas',
            'label' => 'Gotas',
        ]);

        $metadataGroup->metadataValues()->create([
            'id' => 'analgesico',
            'label' => 'Analgésico',
        ]);

        $metadataGroup->metadataValues()->create([
            'id' => 'antibiotico',
            'label' => 'Antibiótico',
        ]);

        $metadataGroup->metadataValues()->create([
            'id' => 'etico',
            'label' => 'Ético',
        ]);

        $metadataGroup->metadataValues()->create([
            'id' => 'anticoncepcional',
            'label' => 'Anticoncepcional',
        ]);



        Product::first()->metadata()->create([
            'category_metadata_id' => 'administration_method',
            'metadata_value_id' => 'comprimido',
        ]);

        Product::first()->metadata()->create([
            'category_metadata_id' => 'pharmaceutical_group',
            'metadata_value_id' => 'etico',
        ]);

        Product::first()->metadata()->create([
            'category_metadata_id' => 'anticoncepcional',
            'metadata_value_id' => 'Anticoncepcional',
        ]);
    }
}
