<?php
// api/database/seeders/DatabaseSeeder.php

namespace Database\Seeders;

use App\Models\PharmacyUnit;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        
        User::updateOrCreate(
            ['email' => 'cliente@camargo.com.br'],
            [
                'name' => 'Cliente Teste Camargo',
                'cpf' => '123.456.789-00',
                'phone' => '(21) 99999-9999',
                'password' => Hash::make('123456'),
                'role' => 'customer',
            ]
        );

        User::updateOrCreate(
            ['email' => 'farmaceutico@camargo.com.br'],
            [
                'name' => 'Dr. Regis Silva Gonçalves (CRF 16666)',
                'cpf' => '999.888.777-66',
                'phone' => '(21) 2455-4000',
                'password' => Hash::make('123456'),
                'role' => 'pharmacist',
            ]
        );

        // 2. UNIDADES DROGARIAS CAMARGO (Espelhadas de web/lib/company.ts)
        $defaultServices = [
            "Aferição de pressão",
            "Injetáveis",
            "Teste de glicemia",
            "Farmácia Popular",
            "Furo de lóbulo",
        ];

        $units = [
            [
                'slug' => 'couto-1',
                'name' => 'Couto 1',
                'is_ecommerce_hub' => true,
                'allows_pickup' => true,
                'pickup_ready_time' => 'Pronto em até 1 hora',
                'razao_social' => 'Drogaria Couto 1 Ltda',
                'cnpj' => '18.908.721/0001-60',
                'state_registration' => '86.659.32-8',
                'cep' => '21625-001',
                'address' => 'Estrada Marechal Alencastro, 3695, Anchieta, Rio de Janeiro - RJ, CEP: 21625-001',
                'neighborhood' => 'Anchieta',
                'hours' => 'Segunda a Sábado: 07h às 22h | Domingos e Feriados: 08h às 20h',
                'phone' => '2455-4000',
                'whatsapp' => '+55 (21) 96479-2929',
                'maps_url' => 'https://www.google.com/maps/place/Estr.+Mal.+Alencastro,+3695+-+Anchieta,+Rio+de+Janeiro+-+RJ,+21625-001',
                'lat' => -22.8282963,
                'lng' => -43.4006912,
                'legal' => [
                    'farmaceutico' => 'Regis Silva Gonçalves',
                    'crf' => 'CRF: 16666',
                    'afe' => '7.37944-6',
                    'alvara' => '04/821.268/2024',
                ],
                'services' => $defaultServices,
            ],
            [
                'slug' => 'couto-2',
                'name' => 'Couto 2',
                'is_ecommerce_hub' => false,
                'allows_pickup' => true,
                'pickup_ready_time' => 'Pronto em até 1 hora',
                'razao_social' => 'Drogaria Couto 2 Ltda',
                'cnpj' => '30.353.450/0001-29',
                'state_registration' => '11.140.41-6',
                'cep' => '21645-522',
                'address' => 'Av. Chrisóstomo Pimentel de Oliveira, 894, Anchieta, Rio de Janeiro - RJ, CEP: 21645-522',
                'neighborhood' => 'Anchieta',
                'hours' => 'Segunda a Sábado: 07h às 22h | Domingos e Feriados: 08h às 20h',
                'phone' => '3019-3000',
                'whatsapp' => '+55 (21) 96702-8706',
                'maps_url' => 'https://www.google.com/maps/place/Av.+Chris%C3%B3stomo+Pimentel+de+Oliveira,+894+-+Anchieta,+Rio+de+Janeiro+-+RJ,+21645-522',
                'lat' => -22.8184667,
                'lng' => -43.3907535,
                'legal' => [
                    'farmaceutico' => 'Tássio Trindade Mazala',
                    'crf' => 'CRF/RJ: 21510/RJ',
                    'afe' => '7.64798-5',
                    'alvara' => '09/97/143741/2026',
                ],
                'services' => $defaultServices,
            ],
            [
                'slug' => 'fabris',
                'name' => 'Fabris',
                'is_ecommerce_hub' => false,
                'allows_pickup' => true,
                'pickup_ready_time' => 'Pronto em até 1 hora',
                'razao_social' => 'Drogaria Fabris Ltda',
                'cnpj' => '14.234.051/0001-92',
                'state_registration' => '79.483.90-7',
                'cep' => '21620-390',
                'address' => 'Rua Japoara, 174, Ricardo de Albuquerque, Rio de Janeiro - RJ, CEP: 21620-390',
                'neighborhood' => 'Ricardo de Albuquerque',
                'hours' => 'Segunda a Sábado: 07h às 22h | Domingos e Feriados: 08h às 20h',
                'phone' => '2455-2000',
                'whatsapp' => '+55 (21) 96429-6699',
                'maps_url' => 'https://www.google.com/maps/place/R.+Japoara,+174+-+Ricardo+de+Albuquerque,+Rio+de+Janeiro+-+RJ,+21620-390',
                'lat' => -22.8394138,
                'lng' => -43.4008047,
                'legal' => [
                    'farmaceutico' => 'Claudia Felix Santana',
                    'crf' => 'CRF/RJ: 16787/RJ',
                    'afe' => '0.82573-1',
                    'alvara' => '04/820.778/2024',
                ],
                'services' => $defaultServices,
            ],
            [
                'slug' => 'jaime',
                'name' => 'Jaime (Suruí - Magé)',
                'is_ecommerce_hub' => false,
                'allows_pickup' => true,
                'pickup_ready_time' => 'Pronto em até 2 horas',
                'razao_social' => 'Drogaria Jaime Almeida Ltda',
                'cnpj' => '38.714.558/0001-01',
                'state_registration' => '11.832.997',
                'cep' => '25922-440',
                'address' => 'Rua Capitao Jose de Paula, 366 - Centro (Suruí), CEP: 25922-440',
                'neighborhood' => 'Suruí (Magé)',
                'hours' => 'Segunda a Sábado: 07h às 22h | Domingos e Feriados: 08h às 20h',
                'phone' => '2147-1000',
                'whatsapp' => '+55 (21) 99966-2000',
                'maps_url' => 'https://www.google.com/maps/place/R.+Cap.+Jos%C3%A9+de+Paula+-+Centro+(Suru%C3%AD),+Mag%C3%A9+-+RJ,+25922-440',
                'lat' => -22.6622381,
                'lng' => -43.1288145,
                'legal' => [
                    'farmaceutico' => 'Alexsandro da Silva Santos',
                    'crf' => 'CRF/RJ: 24112',
                    'afe' => '7.79766-3',
                    'alvara' => '0020201915030',
                ],
                'services' => $defaultServices,
            ],
            [
                'slug' => 'elza',
                'name' => 'Elza',
                'is_ecommerce_hub' => false,
                'allows_pickup' => true,
                'pickup_ready_time' => 'Pronto em até 1 hora',
                'razao_social' => 'Drogaria Elza Giagio Ltda',
                'cnpj' => '47.522.288/0001-28',
                'state_registration' => '12.574.452',
                'cep' => '25922-492',
                'address' => 'Avenida Izabel de Paula, 248, Loja 2, Quadra F, Lote 4, Magé - RJ, CEP: 25922-492',
                'neighborhood' => 'Suruí (Magé)',
                'hours' => 'Segunda a Sábado: 07h às 22h | Domingos e Feriados: 08h às 20h',
                'phone' => '+55 (21) 97260-3300',
                'whatsapp' => '+55 (21) 98260-2200',
                'maps_url' => 'https://www.google.com/maps/place/Av.+Isabel+de+Paula+-+Centro+(Suru%C3%AD),+Mag%C3%A9+-+RJ,+25922-492',
                'lat' => -22.6595909,
                'lng' => -43.1283008,
                'legal' => [
                    'farmaceutico' => 'Elaine de Araujo Batista',
                    'crf' => 'CRF/RJ: 26573',
                    'afe' => '7.93859-1',
                    'alvara' => '0020226367878',
                ],
                'services' => $defaultServices,
            ],
        ];

        foreach ($units as $unit) {
            PharmacyUnit::updateOrCreate(['slug' => $unit['slug']], $unit);
        }

        // 3. CATÁLOGO DE PRODUTOS (Cobrindo os filtros da Home e casos ANVISA)
        $products = [
            [
                'sku' => 'CAM-0001',
                'ean' => '7896523206127',
                'label' => 'Vitamina C Cimed Redoxitos 1g - 10 Comprimidos Efervescentes',
                'fabricator' => 'Cimed',
                'active_ingredient' => 'Ácido Ascórbico',
                'dosage' => '1g',
                'description' => 'Suplemento vitamínico antioxidante auxiliar do sistema imunológico.',
                'price' => 16.90,
                'promotion_price' => 11.90,
                'image' => '/images/products/vitamina-c.png',
                'category' => 'suplement',
                'stripe_type' => 'free',
                'requires_prescription' => false,
                'stock_quantity' => 120,
                'sales_count' => 340,
            ],
            [
                'sku' => 'CAM-0002',
                'ean' => '3337875709330',
                'label' => 'Protetor Solar Facial La Roche-Posay Anthelios Airlicium FPS 70 40g',
                'fabricator' => 'La Roche-Posay',
                'active_ingredient' => 'XL-Protect + Airlicium',
                'dosage' => '40g',
                'description' => 'Alta proteção solar com controle inteligente da oleosidade e umidade por 12h.',
                'price' => 99.90,
                'promotion_price' => 79.90,
                'image' => '/images/products/anthelios.png',
                'category' => 'sunscreen',
                'stripe_type' => 'free',
                'requires_prescription' => false,
                'stock_quantity' => 45,
                'sales_count' => 280,
            ],
            [
                'sku' => 'CAM-0003',
                'ean' => '7891317464219',
                'label' => 'Amoxicilina 500mg Genérico Eurofarma - 21 Cápsulas',
                'fabricator' => 'Eurofarma',
                'active_ingredient' => 'Amoxicilina Tri-hidratada',
                'dosage' => '500mg',
                'description' => 'Antibiótico penicilânico indicado para infecções bacterianas. Venda sob retenção de receita médica (RDC 20/2011).',
                'price' => 38.50,
                'promotion_price' => 26.90,
                'image' => '/images/products/amoxicilina.png',
                'category' => 'laboratory',
                'stripe_type' => 'red_retained',
                'requires_prescription' => true, // Aciona o componente PrescriptionUpload!
                'stock_quantity' => 60,
                'sales_count' => 195,
            ],
            [
                'sku' => 'CAM-0004',
                'ean' => '7896004714158',
                'label' => 'Azitromicina Di-hidratada 500mg EMS - 5 Comprimidos',
                'fabricator' => 'EMS',
                'active_ingredient' => 'Azitromicina',
                'dosage' => '500mg',
                'description' => 'Antibiótico indicado em infecções do trato respiratório. Exige retenção de receita médica.',
                'price' => 29.90,
                'promotion_price' => 18.50,
                'image' => '/images/products/azitromicina.png',
                'category' => 'laboratory',
                'stripe_type' => 'red_retained',
                'requires_prescription' => true, // Aciona o componente PrescriptionUpload!
                'stock_quantity' => 85,
                'sales_count' => 210,
            ],
            [
                'sku' => 'CAM-0005',
                'ean' => '7891058003421',
                'label' => 'Anticoncepcional Yasmin 3mg + 0,03mg Bayer - 21 Comprimidos',
                'fabricator' => 'Bayer',
                'active_ingredient' => 'Drospirenona + Etinilestradiol',
                'dosage' => '3mg + 0,03mg',
                'description' => 'Contraceptivo oral combinado de baixa dosagem.',
                'price' => 84.90,
                'promotion_price' => 69.90,
                'image' => '/images/products/yasmin.png',
                'category' => 'contraceptive',
                'stripe_type' => 'red',
                'requires_prescription' => false,
                'stock_quantity' => 40,
                'sales_count' => 150,
            ],
            [
                'sku' => 'CAM-0006',
                'ean' => '7891010567890',
                'label' => 'Fralda Pampers Confort Sec Tamanho G - 70 Unidades',
                'fabricator' => 'P&G',
                'active_ingredient' => null,
                'dosage' => 'Tam G (9-12,5kg)',
                'description' => 'Canais de ar para uma pele arejada e sequinha por até 12 horas.',
                'price' => 119.90,
                'promotion_price' => 94.90,
                'image' => '/images/products/pampers.png',
                'category' => 'infantile',
                'stripe_type' => 'free',
                'requires_prescription' => false,
                'stock_quantity' => 30,
                'sales_count' => 310,
            ],
            [
                'sku' => 'CAM-0007',
                'ean' => '3337875597388',
                'label' => 'Gel de Limpeza Facial CeraVe Pele Normal a Oleosa 354ml',
                'fabricator' => 'CeraVe',
                'active_ingredient' => '3 Ceramidas Essenciais + Ácido Hialurônico',
                'dosage' => '354ml',
                'description' => 'Limpa profundamente e remove a oleosidade sem alterar a barreira protetora da pele.',
                'price' => 89.90,
                'promotion_price' => 74.90,
                'image' => '/images/products/cerave.png',
                'category' => 'dermocosmetics',
                'stripe_type' => 'free',
                'requires_prescription' => false,
                'stock_quantity' => 55,
                'sales_count' => 265,
            ],
            [
                'sku' => 'CAM-0008',
                'ean' => '7891106912341',
                'label' => 'Tiras Reagentes Accu-Chek Active - 50 Unidades',
                'fabricator' => 'Roche',
                'active_ingredient' => null,
                'dosage' => '50 tiras',
                'description' => 'Tiras para determinação quantitativa de glicemia capilar.',
                'price' => 109.00,
                'promotion_price' => 88.90,
                'image' => '/images/products/accu-chek.png',
                'category' => 'diabetes',
                'stripe_type' => 'free',
                'requires_prescription' => false,
                'stock_quantity' => 40,
                'sales_count' => 175,
            ],
        ];

        foreach ($products as $product) {
            Product::updateOrCreate(['sku' => $product['sku']], $product);
        }
    }
}