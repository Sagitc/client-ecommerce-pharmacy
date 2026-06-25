<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategoryMetadataSeeder extends Seeder {

    public function run(): void {

        $metadata_medication = Category::where('slug', 'medicamento')->first()->metadata()->createMany([

            [ 'id' => 'administration-method', 'label' => 'Método de Administração' ],
            [ 'id' => 'recipe-required',       'label' => 'Receita Obrigatória'     ],
            [ 'id' => 'medication-indication', 'label' => 'Indicação'               ],
            [ 'id' => 'usage-age-type',        'label' => 'Faixa etária de uso'     ]

        ]);

        foreach ($metadata_medication as $metadata) {
            
            switch ($metadata->id) {

                case 'administration-method':

                    $metadata->metadataValues()->createMany([

                        [ 'label' => 'Oral'       ],
                        [ 'label' => 'Tópico'     ],
                        [ 'label' => 'Inalatória' ],
                        [ 'label' => 'Injetável'  ],
                        [ 'label' => 'Retal'      ]

                    ]);
                    break;

                case 'recipe-required':

                    $metadata->metadataValues()->createMany([

                        [ 'label' => 'Sim' ],
                        [ 'label' => 'Não' ]

                    ]);
                    break;

                case 'usage-age-type':

                    $metadata->metadataValues()->createMany([

                        [ 'label' => 'Criança' ],
                        [ 'label' => 'Adulto'  ],
                        [ 'label' => 'Senior'  ]

                    ]);
                    break;

                case 'medication-indication':

                    $metadata->metadataValues()->createMany([

                        [ 'label' => 'Analgésico'                ],
                        [ 'label' => 'Antitérmico'               ],
                        [ 'label' => 'Antialérgico'              ],
                        [ 'label' => 'Anti-inflamatório'         ],
                        [ 'label' => 'Antibiótico'               ],
                        [ 'label' => 'Antipirético'              ],
                        [ 'label' => 'Vitaminas e Minerais'      ],
                        [ 'label' => 'Saúde Digestiva'           ]

                    ]);
                    break;

                default:
                    break;
            }
        }

        $metadata_personal_care = Category::where('slug', 'higiene-e-cuidados-pessoais')->first()->metadata()->createMany([

            [ 'id' => 'care-skin-type', 'label' => 'Tipo de Pele'     ],
            [ 'id' => 'hair-type',      'label' => 'Tipo de Cabelo'   ],
            [ 'id' => 'care-scent',     'label' => 'Fragrância'       ],
            [ 'id' => 'care-function',  'label' => 'Função Principal' ]

        ]);

        foreach ($metadata_personal_care as $metadata) {
            
            switch ($metadata->id) {

                case 'care-skin-type':

                    $metadata->metadataValues()->createMany([
                        
                        [ 'label' => 'Normal'   ],
                        [ 'label' => 'Seca'     ],
                        [ 'label' => 'Oleosa'   ],
                        [ 'label' => 'Mista'    ],
                        [ 'label' => 'Sensível' ]

                    ]);
                    break;

                case 'hair-type':

                    $metadata->metadataValues()->createMany([

                        [ 'label' => 'Liso'     ],
                        [ 'label' => 'Ondulado' ],
                        [ 'label' => 'Cacheado' ],
                        [ 'label' => 'Crespo'   ]

                    ]);
                    break;

                case 'care-scent':

                    $metadata->metadataValues()->createMany([

                        [ 'label' => 'Floral'     ],
                        [ 'label' => 'Cítrico'    ],
                        [ 'label' => 'Frutado'    ],
                        [ 'label' => 'Amadeirado' ],
                        [ 'label' => 'Fresco'     ]

                    ]);
                    break;

                case 'care-function':

                    $metadata->metadataValues()->createMany([

                        [ 'label' => 'Hidratação' ],
                        [ 'label' => 'Limpeza'    ],
                        [ 'label' => 'Esfoliação' ],
                        [ 'label' => 'Proteção'   ],
                        [ 'label' => 'Nutrição'   ]

                    ]);
                    break;

                default:
                    break;
            }
        }

        $metadata_baby_care = Category::where('slug', 'mamae-e-bebe')->first()->metadata()->createMany([

            [ 'id' => 'diaper-size',     'label' => 'Tamanho de fralda'    ],
            [ 'id' => 'baby-material',   'label' => 'Material'             ],
            [ 'id' => 'baby-scent',      'label' => 'Fragrância'           ],
            [ 'id' => 'diaper-quantity', 'label' => 'Quantidade de fralda' ]

        ]);

        foreach ($metadata_baby_care as $metadata) {

            switch ($metadata->id) {

                case 'diaper-size':

                    $metadata->metadataValues()->createMany([

                        [ 'label' => 'RN' ],
                        [ 'label' => 'P'  ],
                        [ 'label' => 'M'  ],
                        [ 'label' => 'G'  ],
                        [ 'label' => 'EG' ]

                    ]);
                    break;

                case 'baby-material':

                    $metadata->metadataValues()->createMany([

                        [ 'label' => 'Algodão'   ],
                        [ 'label' => 'Bambu'     ],
                        [ 'label' => 'Sintético' ]

                    ]);
                    break;

                case 'diaper-quantity':

                    $metadata->metadataValues()->createMany([

                        [ 'label' => '1-20 unidades'   ],
                        [ 'label' => '21-40 unidades'  ],
                        [ 'label' => '41-60 unidades'  ],
                        [ 'label' => '61-80 unidades'  ],
                        [ 'label' => '81-100 unidades' ]

                    ]);
                    break;

                case 'baby-scent':

                    $metadata->metadataValues()->createMany([

                        [ 'label' => 'Sem Fragrância' ],
                        [ 'label' => 'Lavanda'        ],
                        [ 'label' => 'Camomila'       ],
                        [ 'label' => 'Aloe Vera'      ],
                        [ 'label' => 'Talco de Bebê'  ]

                    ]);
                    break;

                default:
                    break;
            }
        }

        $metadata_dermocosmetics = Category::where('slug', 'dermocosmeticos-e-beleza')->first()->metadata()->createMany([

            [ 'id' => 'dermo-skin-type',    'label' => 'Tipo de Pele'     ],
            [ 'id' => 'dermo-function',     'label' => 'Função Principal' ],
            [ 'id' => 'dermo-texture',      'label' => 'Textura'          ],
            [ 'id' => 'fps',                'label' => 'FPS'              ]

        ]);

        foreach ($metadata_dermocosmetics as $metadata) {

            switch ($metadata->id) {

                case 'dermo-skin-type':

                    $metadata->metadataValues()->createMany([

                        [ 'label' => 'Normal'   ],
                        [ 'label' => 'Seca'     ],
                        [ 'label' => 'Oleosa'   ],
                        [ 'label' => 'Mista'    ],
                        [ 'label' => 'Sensível' ]

                    ]);
                    break;

                case 'dermo-function':

                    $metadata->metadataValues()->createMany([

                        [ 'label' => 'Anti-idade'            ],
                        [ 'label' => 'Hidratação'            ],
                        [ 'label' => 'Proteção Solar'        ],
                        [ 'label' => 'Clareamento'           ],
                        [ 'label' => 'Tratamento de Acne'    ],
                        [ 'label' => 'Tratamento de Manchas' ]

                    ]);
                    break;

                case 'dermo-texture':

                    $metadata->metadataValues()->createMany([

                        [ 'label' => 'Creme'  ],
                        [ 'label' => 'Gel'    ],
                        [ 'label' => 'Loção'  ],
                        [ 'label' => 'Sérum'  ],
                        [ 'label' => 'Espuma' ]

                    ]);
                    break;

                case 'fps':

                    $metadata->metadataValues()->createMany([

                        [ 'label' => '15'  ],
                        [ 'label' => '20'  ],
                        [ 'label' => '30'  ],
                        [ 'label' => '40'  ],
                        [ 'label' => '50'  ],
                        [ 'label' => '60'  ],
                        [ 'label' => '70'  ],
                        [ 'label' => '80'  ],
                        [ 'label' => '90'  ],
                        [ 'label' => '100' ]

                    ]);
                    break;

                default:
                    break;
            }
        }

        $metadata_healthy_wellness = Category::where('slug', 'saude-e-bem-estar')->first()->metadata()->createMany([

            [ 'id' => 'wellness-function',       'label' => 'Função'              ],
            [ 'id' => 'type-of-device',          'label' => 'Tipo de Dispositivo' ],
            [ 'id' => 'wellness-flavor',         'label' => 'Sabor'               ]

        ]);

        foreach ($metadata_healthy_wellness as $metadata) {

            switch ($metadata->id) {

                case 'wellness-function':

                    $metadata->metadataValues()->createMany([

                        [ 'label' => 'Alívio da Dor'       ],
                        [ 'label' => 'Alívio do Estresse'  ],
                        [ 'label' => 'Auxílio para o Sono' ],
                        [ 'label' => 'Aumento de Energia'  ],
                        [ 'label' => 'Suporte Imunológico' ]

                    ]);
                    break;

                case 'type-of-device':

                    $metadata->metadataValues()->createMany([

                        [ 'label' => 'Rastreador de Atividade'      ],
                        [ 'label' => 'Monitor de Pressão Arterial'  ],
                        [ 'label' => 'Tiras para Teste de Glicose'  ],
                        [ 'label' => 'Medidor de Glicose'           ],
                        [ 'label' => 'Oxímetro de Pulso'            ]

                    ]);
                    break;

                case 'wellness-flavor':

                    $metadata->metadataValues()->createMany([

                        [ 'label' => 'Laranja'          ],
                        [ 'label' => 'Baunilha'         ],
                        [ 'label' => 'Uva'              ],
                        [ 'label' => 'Morango'          ],
                        [ 'label' => 'Limão'            ],
                        [ 'label' => 'Frutas Vermelhas' ],
                        [ 'label' => 'Hortelã'          ]

                    ]);
                    break;

                default:
                    break;
            }
        }


        Product::all()->each(function ($product) {

            $category = $product->category;

            if ($category) {

                $metadata = $category->metadata()->inRandomOrder()->take(2)->get();

                foreach ($metadata as $meta) {

                    $metadataValue = $meta->metadataValues()->inRandomOrder()->first();

                    if ($metadataValue) {

                        $product->metadata()->create([

                            'category_metadata_id' => $meta->id,
                            'metadata_value_id'    => $metadataValue->id,

                        ]);

                    }

                }

            }

        });

    }
    
}
