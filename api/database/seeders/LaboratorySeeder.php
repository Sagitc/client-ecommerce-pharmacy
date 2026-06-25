<?php

namespace Database\Seeders;

use App\Models\Laboratory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class LaboratorySeeder extends Seeder   {
    
    public function run(): void {

        $dados = [

            [
                'label' => 'Marjan',
                'company_name' => 'Marjan Industria e Comercio LTDA',
                'CNPJ' => '60.726.692/0001-81' 
            ],
            [
                'label' => 'Arese',
                'company_name' => 'Arese Pharma Ltda.',
                'CNPJ' => '07.670.111/0001-54',
            ],
            [
                'label' => 'Cellera',
                'company_name' => 'Cellera Farma Ltda',
                'CNPJ' => '33.173.097/0001-74',
            ],
            [
                'label' => 'Aché',
                'company_name' => 'Aché Laboratórios Farmacêuticos S.A.',
                'CNPJ' => '60.659.463/0001-91',
            ],
            [
                'label' => 'EMS',
                'company_name' => 'EMS S/A',
                'CNPJ' => '57.507.378/0003-65',
            ],
            [
                'label' => 'Eurofarma',
                'company_name' => 'Eurofarma Laboratórios S.A.',
                'CNPJ' => '61.190.096/0001-92',
            ],
            [
                'label' => 'Hypera',
                'company_name' => 'Hypera S.A.',
                'CNPJ' => '02.932.074/0002-36',
            ],
            [
                'label' => 'Sanofi',
                'company_name' => 'Sanofi Medley Farmacêutica Ltda.',
                'CNPJ' => '02.684.236/0001-47',
            ],
            [
                'label' => 'Takeda',
                'company_name' => 'Takeda Pharma Ltda.',
                'CNPJ' => '60.397.775/0001-74',
            ],
            [
                'label' => 'Abbott',
                'company_name' => 'Abbott Laboratórios do Brasil Ltda.',
                'CNPJ' => '56.998.701/0001-16',
            ],
            [
                'label' => 'Novartis',
                'company_name' => 'Novartis Biociências S.A.',
                'CNPJ' => '56.994.502/0001-30',
            ],
            [
                'label' => 'Pfizer',
                'company_name' => 'Pfizer Brasil Ltda.',
                'CNPJ' => '61.072.393/0001-69',
            ],
            [
                'label' => 'Bayer',
                'company_name' => 'Bayer S.A.',
                'CNPJ' => '18.459.628/0001-15',
            ],
            [
                'label' => 'Merck',
                'company_name' => 'Merck S.A.',
                'CNPJ' => '33.069.212/0001-44',
            ],
            [
                'label' => 'AstraZeneca',
                'company_name' => 'AstraZeneca do Brasil Ltda.',
                'CNPJ' => '60.318.797/0001-00',
            ],
            [
                'label' => 'Johnson & Johnson',
                'company_name' => 'Johnson & Johnson do Brasil Indústria e Comércio de Produtos para Saúde Ltda.',
                'CNPJ' => '59.748.988/0001-14',
            ],
            [
                'label' => 'Bristol-Myers Squibb',
                'company_name' => 'Bristol-Myers Squibb Farmacêutica Ltda.',
                'CNPJ' => '56.991.545/0001-54',
            ],
            [
                'label' => 'Roche',
                'company_name' => 'Produtos Roche Químicos e Farmacêuticos S.A.',
                'CNPJ' => '33.009.945/0001-23',
            ],
            [
                'label' => 'Boehringer Ingelheim',
                'company_name' => 'Boehringer Ingelheim do Brasil Química e Farmacêutica Ltda.',
                'CNPJ' => '33.023.071/0001-80',
            ],
            [
                'label' => 'Servier',
                'company_name' => 'Servier do Brasil Ltda.',
                'CNPJ' => '42.374.230/0001-12',
            ]
            
        ];

        foreach ($dados as $dado) {

            Laboratory::create($dado);

        }

    }

}
