<?php

namespace Database\Factories;

use App\Models\Address;
use App\Models\Order;
use App\Models\PharmacyUnit;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Order>
 */
class OrderFactory extends Factory
{
    protected $model = Order::class;

    public function definition(): array
    {
        return [
            'order_number' => 'CAM-' . date('Y') . '-' . strtoupper(Str::random(6)),
            'user_id' => User::factory(),
            'shipping_method' => 'delivery',
            'address_id' => Address::factory(),
            'pharmacy_unit_id' => null,
            'subtotal' => 100.00,
            'shipping_cost' => 10.00,
            'discount' => 0.00,
            'total' => 110.00,
            'payment_method' => 'pix',
            'payment_status' => 'pending',
            'status' => 'pending',
            'notes' => null,
        ];
    }

    public function pickup(): static
    {
        return $this->state(fn (array $attributes) => [
            'shipping_method' => 'pickup',
            'address_id' => null,
            'pharmacy_unit_id' => PharmacyUnit::factory(),
            'shipping_cost' => 0.00,
            'total' => $attributes['subtotal'] ?? 100.00,
        ]);
    }

    public function awaitingPrescription(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'awaiting_prescription_review',
        ]);
    }

    public function processing(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'processing',
            'payment_status' => 'paid',
        ]);
    }
}
