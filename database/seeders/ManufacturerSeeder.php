<?php

namespace Database\Seeders;

use App\Models\Manufacturer;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ManufacturerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Manufacturer::create([
            'label' => 'Hypera',
            'company_name' => 'Hypera S.A.',
            'CNPJ' => '02.932.074/0006-04',
        ]);
        
        Manufacturer::create([
            'label' => 'Arese',
            'company_name' => 'Arese Pharma Ltda.',
            'CNPJ' => '07.670.111/0001-54',
        ]);

        Manufacturer::create([
            'label' => 'Marjan',
            'company_name' => 'Marjan Industria e Comercio LTDA',
            'CNPJ' => '60.726.692/0001-81',
        ]);
    }
};
