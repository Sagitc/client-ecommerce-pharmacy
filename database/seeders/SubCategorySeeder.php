<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SubCategorySeeder extends Seeder  {
    
    public function run(): void {

        Category::where('slug', 'medicamento')->first()->subcategory()->createMany([

            [ 'name' => 'Dor e Febre',                'slug' => 'dor-e-febre'                ],
            [ 'name' => 'Gripe e Resfriado',          'slug' => 'gripe-e-resfriado'          ],
            [ 'name' => 'Digestivos e Intestinais',   'slug' => 'digestivos-e-intestinais'   ],
            [ 'name' => 'Vitaminas e Suplementos',    'slug' => 'vitaminas-e-suplementos'    ],
            [ 'name' => 'Alergias e Respiratórios',   'slug' => 'alergias-e-respiratorios'   ],
            [ 'name' => 'Primeiros Socorros',         'slug' => 'primeiros-socorros'         ],
            [ 'name' => 'Uso Contínuo e Controlados', 'slug' => 'uso-continuo-e-controlados' ]

        ]);

        Category::where('slug', 'higiene-e-cuidados-pessoais')->first()->subcategory()->createMany([

            [ 'name' => 'Higiene Bucal',                    'slug' => 'higiene-bucal'                    ],
            [ 'name' => 'Cuidados com o Cabelo',            'slug' => 'cuidados-com-o-cabelo'            ],
            [ 'name' => 'Cuidados com a Pele',              'slug' => 'cuidados-com-a-pele'              ],
            [ 'name' => 'Desodorantes e Antitranspirantes', 'slug' => 'desodorantes-e-antitranspirantes' ],
            [ 'name' => 'Higiene Íntima',                   'slug' => 'higiene-intima'                   ]

        ]);

        Category::where('slug', 'mamae-e-bebe')->first()->subcategory()->createMany([

            [ 'name' => 'Fraldas e Trocadores', 'slug' => 'fraldas-e-trocadores' ],
            [ 'name' => 'Lenços Umedecidos',    'slug' => 'lencos-umedecidos'    ],
            [ 'name' => 'Alimentação Infantil', 'slug' => 'alimentacao-infantil' ],
            [ 'name' => 'Higiene do Bebê',      'slug' => 'higiene-do-bebe'      ],
            [ 'name' => 'Acessórios',           'slug' => 'acessorios'           ]

        ]);

        Category::where('slug', 'dermocosmeticos-e-beleza')->first()->subcategory()->createMany([

            [ 'name' => 'Cuidados com o Rosto',   'slug' => 'cuidados-com-o-rosto'   ],
            [ 'name' => 'Cuidados com o Corpo',   'slug' => 'cuidados-com-o-corpo'   ],
            [ 'name' => 'Maquiagem e Acessórios', 'slug' => 'maquiagem-e-acessorios' ]

        ]);

        Category::where('slug', 'saude-e-bem-estar')->first()->subcategory()->createMany([

            [ 'name' => 'Aparalhos de Saúde',       'slug' => 'aparalhos-de-saude'             ],
            [ 'name' => 'Nutrição Esportiva',       'slug' => 'nutricao-esportiva'             ],
            [ 'name' => 'Produtos Ortopédicos',     'slug' => 'produtos-ortopedicos'           ],
            [ 'name' => 'Produtos Naturais e Chás', 'slug' => 'produtos-naturais-e-chas'       ]

        ]);
        
    }

}
