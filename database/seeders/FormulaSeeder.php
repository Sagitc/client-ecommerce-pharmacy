<?php

namespace Database\Seeders;

use App\Models\Formula;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FormulaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $formulas = [
            ['name' => 'Dipirona 1g'],
            ['name' => 'Dipirona 500mg'],
            ['name' => 'Dipirona 1g/ml'],
            ['name' => 'Vitamina D 1.000UI'],
            ['name' => 'Vitamina D 2.000UI'],
            ['name' => 'Escitalopram 10mg'],
            ['name' => 'Escitalopram 20mg'],
            ['name' => 'Paracetamol 500mg'],
            ['name' => 'Paracetamol 750mg'],
            ['name' => 'Ibuprofeno 400mg'],
            ['name' => 'Ibuprofeno 600mg'],
            ['name' => 'Omeprazol 20mg'],
            ['name' => 'Omeprazol 40mg'],
            ['name' => 'Rosuvastatina 10mg'],
            ['name' => 'Rosuvastatina 20mg'],
            ['name' => 'Losartana 50mg'],
            ['name' => 'Losartana 100mg'],
            ['name' => 'Metformina 500mg'],
            ['name' => 'Metformina 850mg'],
            ['name' => 'Metformina 1.000mg'],
            
        ];

        foreach ($formulas as $formula) {
            Formula::create($formula);
        }
    }
}
