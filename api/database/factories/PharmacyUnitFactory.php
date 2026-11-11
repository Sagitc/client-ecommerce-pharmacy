<?php

namespace Database\Factories;

use App\Models\PharmacyUnit;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PharmacyUnit>
 */
class PharmacyUnitFactory extends Factory
{
    protected $model = PharmacyUnit::class;

    public function definition(): array
    {
        return [
            'slug' => fake()->unique()->slug(),
            'name' => 'Farmácia Camargo ' . fake()->streetName(),
            'is_ecommerce_hub' => fake()->boolean(40),
            'allows_pickup' => true,
            'pickup_ready_time' => 'Pronto em até 1 hora',
            'razao_social' => 'Drogarias Camargo Ltda',
            'cnpj' => fake()->numerify('##.###.###/0001-##'),
            'state_registration' => fake()->numerify('##.###.###-#'),
            'cep' => fake()->numerify('#####-###'),
            'address' => fake()->streetAddress(),
            'neighborhood' => fake()->cityPrefix() . ' Centro',
            'hours' => '07h às 22h',
            'phone' => '(21) 2345-6789',
            'whatsapp' => '(21) 98765-4321',
            'maps_url' => 'https://maps.google.com',
            'lat' => -22.8282963,
            'lng' => -43.4006912,
            'legal' => [
                'crf' => 'CRF-RJ 12345',
                'responsavel_tecnico' => 'Dr. Farmacêutico',
            ],
            'services' => ['Aplicação de Injetáveis', 'Aferição de Pressão'],
            'is_active' => true,
        ];
    }

    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }
}
