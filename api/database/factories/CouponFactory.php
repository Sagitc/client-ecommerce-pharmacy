<?php

namespace Database\Factories;

use App\Models\Coupon;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Coupon>
 */
class CouponFactory extends Factory
{
    protected $model = Coupon::class;

    public function definition(): array
    {
        return [
            'code' => 'CAM-' . strtoupper(Str::random(6)),
            'type' => 'percentage',
            'value' => 10.00,
            'min_order_value' => null,
            'max_discount' => null,
            'max_uses' => null,
            'used_count' => 0,
            'max_uses_per_user' => 1,
            'max_redemptions' => null,
            'redeemed_count' => 0,
            'is_active' => true,
            'starts_at' => null,
            'expires_at' => now()->addMonths(3),
        ];
    }

    public function fixed(float $value = 15.00): static
    {
        return $this->state(fn () => [
            'type' => 'fixed',
            'value' => $value,
        ]);
    }

    public function percentage(float $value = 10.00, ?float $maxDiscount = null): static
    {
        return $this->state(fn () => [
            'type' => 'percentage',
            'value' => $value,
            'max_discount' => $maxDiscount,
        ]);
    }

    public function inactive(): static
    {
        return $this->state(fn () => [
            'is_active' => false,
        ]);
    }

    public function expired(): static
    {
        return $this->state(fn () => [
            'expires_at' => now()->subDay(),
        ]);
    }

    public function notStarted(): static
    {
        return $this->state(fn () => [
            'starts_at' => now()->addDay(),
        ]);
    }

    public function exhausted(int $maxUses = 5): static
    {
        return $this->state(fn () => [
            'max_uses' => $maxUses,
            'used_count' => $maxUses,
        ]);
    }

    public function limitedRedemptions(int $maxRedemptions = 5, int $redeemedCount = 0): static
    {
        return $this->state(fn () => [
            'max_redemptions' => $maxRedemptions,
            'redeemed_count' => $redeemedCount,
        ]);
    }

    public function usesPerUser(int $uses = 1): static
    {
        return $this->state(fn () => [
            'max_uses_per_user' => $uses,
        ]);
    }
}
