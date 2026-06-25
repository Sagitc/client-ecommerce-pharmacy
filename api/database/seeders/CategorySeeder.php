<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder {
    
    public function run(): void {

        $categorias = [

            ['name' => 'Medicamento',                 'slug' => 'medicamento'                ],
            ['name' => 'Higiene e Cuidados Pessoais', 'slug' => 'higiene-e-cuidados-pessoais'],
            ['name' => 'Mamãe e Bebê',                'slug' => 'mamae-e-bebe'               ],
            ['name' => 'Dermocosméticos e Beleza',    'slug' => 'dermocosmeticos-e-beleza'   ],
            ['name' => 'Saúde e Bem-estar',           'slug' => 'saude-e-bem-estar'          ]

        ];

        foreach ($categorias as $categoria) {

            Category::create($categoria);
            
        }

    }

};
