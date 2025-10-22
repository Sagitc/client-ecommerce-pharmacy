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

        $metadata_medication = Category::where('slug', 'medicamento')->first()->metadata()->createMany([
            [
                'id' => 'formula',
                'label' => 'Princípio Ativo',
            ],
            [
                'id' => 'laboratory',
                'label' => 'Laboratório',
            ],
            [
                'id' => 'administration-method',
                'label' => 'Método de Administração',
            ],
            [
                'id' => 'recipe-required',
                'label' => 'Receita Obrigatória',
            ],
            [
                'id' => 'indication',
                'label' => 'Indicação',
            ],
            [
                'id' => 'usage-type',
                'label' => 'Uso (Adulto/Criança)',
            ],
        ]);

        foreach ($metadata_medication as $metadata) {
            switch ($metadata->id) {
                case 'administration-method':
                    $metadata->metadataValues()->createMany([
                        [
                            'id' => 'oral',
                            'label' => 'Oral',
                        ],
                        [
                            'id' => 'topical',
                            'label' => 'Tópico',
                        ],
                        [
                            'id' => 'inhalatory',
                            'label' => 'Inalatória',
                        ],
                        [
                            'id' => 'injectable',
                            'label' => 'Injetável',
                        ],
                        [
                            'id' => 'rectal',
                            'label' => 'Retal',
                        ],
                    ]);
                    break;
                case 'recipe-required':
                    $metadata->metadataValues()->createMany([
                        [
                            'id' => 'yes',
                            'label' => 'Sim',
                        ],
                        [
                            'id' => 'no',
                            'label' => 'Não',
                        ],
                    ]);
                    break;
                case 'usage-type':
                    $metadata->metadataValues()->createMany([
                        [
                            'id' => 'adult',
                            'label' => 'Adulto',
                        ],
                        [
                            'id' => 'child',
                            'label' => 'Criança',
                        ],
                    ]);
                    break;
                case 'indication':
                    $metadata->metadataValues()->createMany([
                        [
                            'id' => 'pain-relief',
                            'label' => 'Alívio da Dor',
                        ],
                        [
                            'id' => 'anti-inflammatory',
                            'label' => 'Anti-inflamatório',
                        ],
                        [
                            'id' => 'antibiotic',
                            'label' => 'Antibiótico',
                        ],
                        [
                            'id' => 'antipyretic',
                            'label' => 'Antipirético',
                        ],
                        [
                            'id' => 'digestive-health',
                            'label' => 'Saúde Digestiva',
                        ],
                    ]);
                    break;
                case 'laboratory':
                    $metadata->metadataValues()->createMany([
                        [
                            'id' => 'pfizer',
                            'label' => 'Pfizer',
                        ],
                        [
                            'id' => 'novartis',
                            'label' => 'Novartis',
                        ],
                        [
                            'id' => 'roche',
                            'label' => 'Roche',
                        ],
                        [
                            'id' => 'johnson-and-johnson',
                            'label' => 'Johnson & Johnson',
                        ],
                        [
                            'id' => 'sanofi',
                            'label' => 'Sanofi',
                        ],
                    ]);
                    break;
                case 'formula':
                    $metadata->metadataValues()->createMany([
                        [
                            'id' => 'paracetamol',
                            'label' => 'Paracetamol',
                        ],
                        [
                            'id' => 'ibuprofen',
                            'label' => 'Ibuprofeno',
                        ],
                        [
                            'id' => 'amoxicillin',
                            'label' => 'Amoxicilina',
                        ],
                        [
                            'id' => 'cetirizine',
                            'label' => 'Cetirizina',
                        ],
                        [
                            'id' => 'omeprazole',
                            'label' => 'Omeprazol',
                        ],
                    ]);
                    break;
                default:
                    break;
            }
        }

        $metadata_personal_care = Category::where('slug', 'higiene-e-cuidados-pessoais')->first()->metadata()->createMany([
            [
                'id' => 'brand',
                'label' => 'Marca',
            ],
            [
                'id' => 'skin-type',
                'label' => 'Tipo de Pele',
            ],
            [
                'id' => 'hair-type',
                'label' => 'Tipo de Cabelo',
            ],
            [
                'id' => 'scent',
                'label' => 'Fragrância',
            ],
            [
                'id' => 'principal-function',
                'label' => 'Função Principal',
            ]
        ]);

        foreach ($metadata_personal_care as $metadata) {
            switch ($metadata->id) {
                case 'skin-type':
                    $metadata->metadataValues()->createMany([
                        [
                            'id' => 'normal',
                            'label' => 'Normal',
                        ],
                        [
                            'id' => 'dry',
                            'label' => 'Seca',
                        ],
                        [
                            'id' => 'oily',
                            'label' => 'Oleosa',
                        ],
                        [
                            'id' => 'combination',
                            'label' => 'Mista',
                        ],
                        [
                            'id' => 'sensitive',
                            'label' => 'Sensível',
                        ],
                    ]);
                    break;
                case 'hair-type':
                    $metadata->metadataValues()->createMany([
                        [
                            'id' => 'straight',
                            'label' => 'Liso',
                        ],
                        [
                            'id' => 'wavy',
                            'label' => 'Ondulado',
                        ],
                        [
                            'id' => 'curly',
                            'label' => 'Cacheado',
                        ],
                        [
                            'id' => 'coily',
                            'label' => 'Crespo',
                        ],
                    ]);
                    break;
                case 'principal-function':
                    $metadata->metadataValues()->createMany([
                        [
                            'id' => 'hydration',
                            'label' => 'Hidratação',
                        ],
                        [
                            'id' => 'cleansing',
                            'label' => 'Limpeza',
                        ],
                        [
                            'id' => 'exfoliation',
                            'label' => 'Esfoliação',
                        ],
                        [
                            'id' => 'protection',
                            'label' => 'Proteção',
                        ],
                    ]);
                    break;
                case 'brand':
                    $metadata->metadataValues()->createMany([
                        [
                            'id' => 'nivea',
                            'label' => 'Nivea',
                        ],
                        [
                            'id' => 'dove',
                            'label' => 'Dove',
                        ],
                        [
                            'id' => 'loreal',
                            'label' => 'L\'Oréal',
                        ],
                        [
                            'id' => 'garnier',
                            'label' => 'Garnier',
                        ],
                        [
                            'id' => 'neutrogena',
                            'label' => 'Neutrogena',
                        ],
                    ]);
                    break;
                case 'scent':
                    $metadata->metadataValues()->createMany([
                        [
                            'id' => 'floral',
                            'label' => 'Floral',
                        ],
                        [
                            'id' => 'citrus',
                            'label' => 'Cítrico',
                        ],
                        [
                            'id' => 'fruity',
                            'label' => 'Frutado',
                        ],
                        [
                            'id' => 'woody',
                            'label' => 'Amadeirado',
                        ],
                        [
                            'id' => 'fresh',
                            'label' => 'Fresco',
                        ],
                    ]);
                    break;
                default:
                    break;
            }
        }

        $metadata_baby_care = Category::where('slug', 'mamae-e-bebe')->first()->metadata()->createMany([
            [
                'id' => 'brand',
                'label' => 'Marca',
            ],
            [
                'id' => 'size',
                'label' => 'Tamanho de fralda',
            ],
            [
                'id' => 'material',
                'label' => 'Material',
            ],
            [
                'id' => 'scent',
                'label' => 'Fragrância',
            ],
            [
                'id' => 'quantity',
                'label' => 'Quantidade por pacote',
            ]
        ]);

        foreach ($metadata_baby_care as $metadata) {
            switch ($metadata->id) {
                case 'size':
                    $metadata->metadataValues()->createMany([
                        [
                            'id' => 'newborn',
                            'label' => 'Recém-nascido',
                        ],
                        [
                            'id' => 'small',
                            'label' => 'Pequeno',
                        ],
                        [
                            'id' => 'medium',
                            'label' => 'Médio',
                        ],
                        [
                            'id' => 'large',
                            'label' => 'Grande',
                        ],
                        [
                            'id' => 'extra-large',
                            'label' => 'Extra Grande',
                        ],
                    ]);
                    break;
                case 'material':
                    $metadata->metadataValues()->createMany([
                        [
                            'id' => 'cotton',
                            'label' => 'Algodão',
                        ],
                        [
                            'id' => 'bamboo',
                            'label' => 'Bambu',
                        ],              
                        [
                            'id' => 'synthetic',
                            'label' => 'Sintético',
                        ],
                    ]);
                    break;
                case 'quantity':
                    $metadata->metadataValues()->createMany([
                        [
                            'id' => '20',
                            'label' => '20 unidades',
                        ],
                        [
                            'id' => '40',
                            'label' => '40 unidades',
                        ],
                        [
                            'id' => '60',
                            'label' => '60 unidades',
                        ],
                        [
                            'id' => '80',
                            'label' => '80 unidades',
                        ],
                        [
                            'id' => '100',
                            'label' => '100 unidades',
                        ],
                    ]);
                    break;
                case 'brand':
                    $metadata->metadataValues()->createMany([
                        [
                            'id' => 'pampers',
                            'label' => 'Pampers',
                        ],
                        [
                            'id' => 'huggies',
                            'label' => 'Huggies',
                        ],
                        [   
                            'id' => 'lupilu',
                            'label' => 'Lupilu',
                        ],
                        [
                            'id' => 'babysec',
                            'label' => 'Babysec',
                        ],
                        [
                            'id' => 'mamypoko',
                            'label' => 'MamyPoko',
                        ],
                    ]);
                    break;
                case 'scent':
                    $metadata->metadataValues()->createMany([
                        [
                            'id' => 'unscented',
                            'label' => 'Sem Fragrância',
                        ],
                        [
                            'id' => 'lavender',
                            'label' => 'Lavanda',
                        ],
                        [
                            'id' => 'chamomile',
                            'label' => 'Camomila',
                        ],
                        [
                            'id' => 'aloe-vera',
                            'label' => 'Aloe Vera',
                        ],  
                        [
                            'id' => 'baby-powder',
                            'label' => 'Talco de Bebê',
                        ],
                    ]);
                    break;
                default:
                    break;
            }
        }

        $metadata_dermocosmetics = Category::where('slug', 'dermocosmeticos-e-beleza')->first()->metadata()->createMany([
            [
                'id' => 'skin-type',
                'label' => 'Tipo de Pele',
            ],
            [
                'id' => 'brand',
                'label' => 'Marca',
            ],
            [
                'id' => 'principal-function',
                'label' => 'Função Principal',
            ],
            [
                'id' => 'texture',
                'label' => 'Textura',
            ],
            [
                'id' => 'fps',
                'label' => 'FPS',
            ],
            [
                'id' => 'formula',
                'label' => 'Ativo principal',
            ]
        ]);

        foreach ($metadata_dermocosmetics as $metadata) {
            switch ($metadata->id) {
                case 'skin-type':
                    $metadata->metadataValues()->createMany([
                        [
                            'id' => 'normal',
                            'label' => 'Normal',
                        ],
                        [
                            'id' => 'dry',
                            'label' => 'Seca',
                        ],
                        [
                            'id' => 'oily',
                            'label' => 'Oleosa',
                        ],
                        [
                            'id' => 'combination',
                            'label' => 'Mista',
                        ],
                        [
                            'id' => 'sensitive',
                            'label' => 'Sensível',
                        ],
                    ]);
                    break;
                case 'principal-function':
                    $metadata->metadataValues()->createMany([
                        [
                            'id' => 'anti-aging',
                            'label' => 'Anti-idade',
                        ],
                        [
                            'id' => 'hydration',
                            'label' => 'Hidratação',
                        ],
                        [
                            'id' => 'sun-protection',
                            'label' => 'Proteção Solar',
                        ],
                        [
                            'id' => 'acne-treatment',
                            'label' => 'Tratamento de Acne',
                        ],
                        [   
                            'id' => 'spot-treatment',
                            'label' => 'Tratamento de Manchas',
                        ],
                    ]);
                    break;
                case 'texture':
                    $metadata->metadataValues()->createMany([
                        [
                            'id' => 'cream',
                            'label' => 'Creme',
                        ],
                        [
                            'id' => 'gel',
                            'label' => 'Gel',
                        ],
                        [
                            'id' => 'lotion',
                            'label' => 'Loção',
                        ],
                        [
                            'id' => 'serum',
                            'label' => 'Sérum',
                        ],
                        [
                            'id' => 'foam',
                            'label' => 'Espuma',
                        ],
                    ]);
                    break;
                case 'fps':
                    $metadata->metadataValues()->createMany([
                        [
                            'id' => '15',
                            'label' => '15',
                        ],
                        [
                            'id' => '30',
                            'label' => '30',
                        ],
                        [
                            'id' => '50',
                            'label' => '50',
                        ],
                        [
                            'id' => '70',
                            'label' => '70',
                        ],
                        [   
                            'id' => '100',
                            'label' => '100',
                        ],
                    ]);
                    break;
                case 'brand':
                    $metadata->metadataValues()->createMany([
                        [
                            'id' => 'vichy',
                            'label' => 'Vichy',
                        ],
                        [       
                            'id' => 'la-roche-posay',
                            'label' => 'La Roche-Posay',
                        ],
                        [
                            'id' => 'neutrogena',
                            'label' => 'Neutrogena',
                        ],
                        [
                            'id' => 'avene',
                            'label' => 'Avène',
                        ],
                        [
                            'id' => 'bioderma',
                            'label' => 'Bioderma',
                        ],
                    ]);
                    break;
                case 'formula':
                    $metadata->metadataValues()->createMany([
                        [           
                            'id' => 'hyaluronic-acid',
                            'label' => 'Ácido Hialurônico',
                        ],
                        [
                            'id' => 'retinol',
                            'label' => 'Retinol',
                        ],
                        [
                            'id' => 'vitamin-c',
                            'label' => 'Vitamina C',
                        ],
                        [
                            'id' => 'niacinamide',
                            'label' => 'Niacinamida',
                        ],
                        [   
                            'id' => 'salicylic-acid',
                            'label' => 'Ácido Salicílico',
                        ],
                    ]);
                    break;
                default:
                    break;
            }
        }

        $metadata_healthy_wellness = Category::where('slug', 'saude-e-bem-estar')->first()->metadata()->createMany([
            [
                'id' => 'brand',
                'label' => 'Marca',
            ],
            [
                'id' => 'function',
                'label' => 'Função',
            ],
            [
                'id' => 'type-of-device',
                'label' => 'Tipo de Dispositivo',
            ],
            [
                'id' => 'flavor',
                'label' => 'Sabor',
            ]
        ]);

        foreach ($metadata_healthy_wellness as $metadata) {
            switch ($metadata->id) {
                case 'function':
                    $metadata->metadataValues()->createMany([
                        [
                            'id' => 'pain-relief',
                            'label' => 'Alívio da Dor',
                        ],
                        [
                            'id' => 'stress-relief',
                            'label' => 'Alívio do Estresse',
                        ],
                        [
                            'id' => 'sleep-aid',
                            'label' => 'Auxílio para o Sono',
                        ],
                        [
                            'id' => 'immune-support',
                            'label' => 'Suporte Imunológico',
                        ],
                    ]);
                    break;
                case 'type-of-device':
                    $metadata->metadataValues()->createMany([
                        [
                            'id' => 'fitness-tracker',
                            'label' => 'Rastreador de Atividade',
                        ],
                        [
                            'id' => 'blood-pressure-monitor',
                            'label' => 'Monitor de Pressão Arterial',
                        ],
                        [
                            'id' => 'glucose-meter',
                            'label' => 'Medidor de Glicose',
                        ],
                    ]);
                    break;
                case 'flavor':
                    $metadata->metadataValues()->createMany([
                        [       
                            'id' => 'orange',
                            'label' => 'Laranja',
                        ],
                        [
                            'id' => 'lemon',
                            'label' => 'Limão',
                        ],
                        [
                            'id' => 'berry',
                            'label' => 'Frutas Vermelhas',
                        ],
                        [
                            'id' => 'mint',
                            'label' => 'Hortelã',
                        ],
                    ]);
                    break;
                case 'brand':
                    $metadata->metadataValues()->createMany([   
                        [
                            'id' => 'fitbit',
                            'label' => 'Fitbit',
                        ],
                        [
                            'id' => 'garmin',
                            'label' => 'Garmin',
                        ],
                        [
                            'id' => 'omron',
                            'label' => 'Omron',
                        ],
                        [
                            'id' => 'dexcom',
                            'label' => 'Dexcom',
                        ],
                    ]);
                    break;
                default:
                    break;
            }
        }




        // $metadataMethod = Category::first()->metadata()->create([
        //     'id' => 'administration_method',
        //     'label' => 'Método de Administração',
        // ]);

        // $metadataGroup = Category::first()->metadata()->create([
        //     'id' => 'pharmaceutical_group',
        //     'label' => 'Grupo Farmacêutico',
        // ]);

        // $metadataMethod->metadataValues()->create([
        //     'id' => 'gotas',
        //     'label' => 'Gotas',
        // ]);

        // $metadataGroup->metadataValues()->create([
        //     'id' => 'analgesico',
        //     'label' => 'Analgésico',
        // ]);

        // Product::first()->metadata()->create([
        //     'category_metadata_id' => 'administration_method',
        //     'metadata_value_id' => 'comprimido',
        // ]);

        // Product::first()->metadata()->create([
        //     'category_metadata_id' => 'pharmaceutical_group',
        //     'metadata_value_id' => 'etico',
        // ]);

        // Product::first()->metadata()->create([
        //     'category_metadata_id' => 'anticoncepcional',
        //     'metadata_value_id' => 'Anticoncepcional',
        // ]);
    }
}
