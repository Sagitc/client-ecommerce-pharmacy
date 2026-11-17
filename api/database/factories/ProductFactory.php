<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    protected $model = Product::class;

    public function definition(): array
    {
        return [
            'sku' => fake()->unique()->bothify('PROD-####'),
            'ean' => fake()->unique()->numerify('78900000#####'),
            'label' => fake()->words(3, true),
            'fabricator' => fake()->company(),
            'dosage' => '500mg',
            'active_ingredient' => fake()->word(),
            'description' => fake()->paragraph(),
            'price' => fake()->randomFloat(2, 5, 200),
            'promotion_price' => null,
            'image' => 'https://via.placeholder.com/300',
            'category' => fake()->randomElement(['medicamentos', 'higiene', 'dermocosmeticos', 'mamae-e-bebe', 'suplementos']),
            'subgroup' => fake()->randomElement(['Analgésicos e Antitérmicos', 'Antibióticos', 'Limpeza Facial', 'Imunidade e Energia']),
            'metadata' => [
                'Forma Farmacêutica' => 'Comprimido',
                'Dosagem' => '500mg',
            ],
            'stripe_type' => 'free',
            'requires_prescription' => false,
            'in_stock' => true,
            'stock_quantity' => fake()->numberBetween(10, 100),
            'sales_count' => fake()->numberBetween(0, 50),
        ];
    }

    public function prescriptionRequired(string $stripeType = 'red_retained'): static
    {
        return $this->state(fn (array $attributes) => [
            'requires_prescription' => true,
            'stripe_type' => $stripeType,
        ]);
    }

    public function outOfStock(): static
    {
        return $this->state(fn (array $attributes) => [
            'in_stock' => false,
            'stock_quantity' => 0,
        ]);
    }

    public function withPromotion(float $discountPercent = 0.2): static
    {
        return $this->state(function (array $attributes) use ($discountPercent) {
            $price = $attributes['price'] ?? 50.00;
            return [
                'promotion_price' => round($price * (1 - $discountPercent), 2),
            ];
        });
    }
}
