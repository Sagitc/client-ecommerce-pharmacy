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
            'category_slug' => 'medicamento',
        ]);

        Category::create([
            'name' => 'Perfumaria',
            'category_slug' => 'perfumaria',
        ]);

        Category::create([
            'name' => 'Genérico',
            'category_slug' => 'generico',
        ]);

        Category::create([
            'name' => 'Similar',
            'category_slug' => 'similar',
        ]);
    }
};
