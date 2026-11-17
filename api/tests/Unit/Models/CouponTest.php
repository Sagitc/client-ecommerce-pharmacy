<?php

namespace Tests\Unit\Models;

use App\Models\Coupon;
use App\Models\Order;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CouponTest extends TestCase
{
    use RefreshDatabase;

    public function test_coupon_code_is_normalized_to_uppercase_and_trimmed(): void
    {
        $coupon = Coupon::factory()->create(['code' => '  camargo10  ']);

        $this->assertSame('CAMARGO10', $coupon->code);
    }

    public function test_coupon_validity_checks_active_dates_and_usage_limits(): void
    {
        $valid = Coupon::factory()->create();
        $inactive = Coupon::factory()->inactive()->create();
        $expired = Coupon::factory()->expired()->create();
        $notStarted = Coupon::factory()->notStarted()->create();
        $exhausted = Coupon::factory()->exhausted(3)->create();

        $this->assertTrue($valid->isValid());
        $this->assertFalse($inactive->isValid());
        $this->assertFalse($expired->isValid());
        $this->assertFalse($notStarted->isValid());
        $this->assertFalse($exhausted->isValid());
    }

    public function test_coupon_calculates_percentage_and_fixed_discounts_with_caps(): void
    {
        $percentage = Coupon::factory()->percentage(15, 20.00)->create();
        $this->assertSame(15.00, $percentage->calculateDiscount(100.00));
        $this->assertSame(20.00, $percentage->calculateDiscount(200.00)); // limitado a max_discount

        $fixed = Coupon::factory()->fixed(25.00)->create();
        $this->assertSame(25.00, $fixed->calculateDiscount(100.00));
        $this->assertSame(10.00, $fixed->calculateDiscount(10.00)); // não excede subtotal
        $this->assertSame(0.0, $fixed->calculateDiscount(0.00));
    }

    public function test_coupon_has_many_orders(): void
    {
        $coupon = Coupon::factory()->create();
        $order = Order::factory()->create([
            'coupon_id' => $coupon->id,
            'coupon_code' => $coupon->code,
        ]);

        $this->assertTrue($coupon->orders->contains($order));
        $this->assertEquals($coupon->id, $order->coupon->id);
    }
}
