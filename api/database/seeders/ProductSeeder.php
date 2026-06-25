<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder  {
    
    public function run(): void {

        Product::create([

            'label' => 'ADDERA 2.000UI 30CPR IMUNIDADE',
            //  'MS' => ?
            //  'main_image' => ?
            'SKU'   => '002321',

            'description' => 'Vitamina D3 2.000UI, 30 comprimidos para suporte ao sistema imunológico.',

            'stock'       => 10,
            'EAN'         => '7896094919310',
            'sales_count' => 50,
            'views_count' => 10,

            'cost'  => 73.37,
            'price' => 106.51,

            'laboratory_id' => 1,
            'category_id'   => 1,
            
        ]);

        Product::create([

            'label' => 'Sabonete Líquido Facial NIVEA Aqua Rose',
            //  'MS' => ?
            //  'main_image' => ?
            'SKU'   => '002322',

            'description' => 'Limpeza suave para pele, com água de rosas e ácido hialurônico.',

            'stock'       => 15,
            'EAN'         => '4005900649792',
            'sales_count' => 30,
            'views_count' => 25,

            'cost'  => 25.00,
            'price' => 42.00,

            'laboratory_id' => 2,
            'category_id'   => 2,
            
        ]);

        Product::create([

            'label' => 'Dipirona 500mg Genérico EMS 10 Comprimidos',
            //  'MS' => ?
            //  'main_image' => ?
            'SKU'   => '002323',

            'description' => 'Alívio para dor e febre. Uso adulto e pediátrico.',

            'stock'       => 20,
            'EAN'         => '7896004717981',
            'sales_count' => 100,
            'views_count' => 80,

            'cost'  => 5.50,
            'price' => 9.90,

            'laboratory_id' => 3,
            'category_id'   => 1,
            
        ]);

        Product::create([

            'label' => 'Creme Facial Antissinais LOréal Revitalift Hialurônico',
            //  'MS' => ?
            //  'main_image' => ?
            'SKU'   => '002324',

            'description' => 'Reduz linhas de expressão com ácido hialurônico. Uso noturno.',

            'stock'       => 12,
            'EAN'         => '7899706186852',
            'sales_count' => 40,
            'views_count' => 35,

            'cost'  => 50.00,
            'price' => 85.00,

            'laboratory_id' => 4,
            'category_id'   => 2,
            
        ]);

        Product::create([

            'label' => 'Paracetamol 750mg Genérico Neo Química 20 Comprimidos',
            //  'MS' => ?
            //  'main_image' => ?
            'SKU'   => '002325',

            'description' => 'Alívio eficaz para febre e dores intensas.',

            'stock'       => 18,
            'EAN'         => '7896714224574',
            'sales_count' => 90,
            'views_count' => 70,

            'cost'  => 8.00,
            'price' => 14.50,

            'laboratory_id' => 1,
            'category_id'   => 1,
            
        ]);

        Product::create([

            'label' => 'Protetor Solar Facial ISDIN Fusion Water FPS 50',
            //  'MS' => ?
            //  'main_image' => ?
            'SKU'   => '002326',

            'description' => 'Proteção solar invisível, oil-free e com alta proteção FPS 50.',

            'stock'       => 22,
            'EAN'         => '8429420727962',
            'sales_count' => 60,
            'views_count' => 55,

            'cost'  => 65.00,
            'price' => 110.00,

            'laboratory_id' => 2,
            'category_id'   => 2,
            
        ]);

        Product::create([

            'label' => 'Amoxicilina 500mg Genérico Sandoz 21 Cápsulas',
            //  'MS' => ?
            //  'main_image' => ?
            'SKU'   => '002327',

            'description' => 'Antibiótico eficaz contra diversas infecções bacterianas.',

            'stock'       => 14,
            'EAN'         => '7896004813102',
            'sales_count' => 75,
            'views_count' => 65,

            'cost'  => 12.00,
            'price' => 21.50,

            'laboratory_id' => 3,
            'category_id'   => 1,
            
        ]);

        Product::create([

            'label' => 'Hidratante Labial Carmed Cereja FPS 30',
            //  'MS' => ?
            //  'main_image' => ?
            'SKU'   => '002328',

            'description' => 'Hidratação intensa com cor e proteção solar para os lábios.',

            'stock'       => 25,
            'EAN'         => '7897984600237',
            'sales_count' => 80,
            'views_count' => 75,

            'cost'  => 15.00,
            'price' => 27.00,

            'laboratory_id' => 4,
            'category_id'   => 2,
            
        ]);

        Product::create([

            'label' => 'Omeprazol 20mg Genérico Medley 28 Cápsulas',
            //  'MS' => ?
            //  'main_image' => ?
            'SKU'   => '002329',

            'description' => 'Reduz a produção de ácido no estômago, aliviando azia e refluxo.',

            'stock'       => 16,
            'EAN'         => '7896422547891',
            'sales_count' => 85,
            'views_count' => 80,

            'cost'  => 10.00,
            'price' => 18.00,

            'laboratory_id' => 1,
            'category_id'   => 1,
            
        ]);
        
        Product::create([

            'label' => 'Esmalte Risqué Diamond Gel Vermelho Glamour',
            //  'MS' => ?
            //  'main_image' => ?
            'SKU'   => '002330',

            'description' => 'Longa duração e brilho intenso para suas unhas.',

            'stock'       => 23,
            'EAN'         => '7899357932588',
            'sales_count' => 70,
            'views_count' => 68,

            'cost'  => 7.00,
            'price' => 12.50,

            'laboratory_id' => 2,
            'category_id'   => 2,
            
        ]);

    }

};
