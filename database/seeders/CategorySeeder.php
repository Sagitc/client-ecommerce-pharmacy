<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Category::create([
            'name' => 'Medicamento',
            'slug' => 'medicamento'
        ]);

        Category::create([
            'name' => 'Higiene e Cuidados Pessoais',
            'slug' => 'higiene-e-cuidados-pessoais'
        ]);

        Category::create([
            'name' => 'Mamãe e Bebê',
            'slug' => 'mamae-e-bebe'
        ]);

        Category::create([
            'name' => 'Dermocosméticos e Beleza',
            'slug' => 'dermocosmeticos-e-beleza'
        ]);

        Category::create([
            'name' => 'Saúde e Bem-estar',
            'slug' => 'saude-e-bem-estar'
        ]);
    }
};
