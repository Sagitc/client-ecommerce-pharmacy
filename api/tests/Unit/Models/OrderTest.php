<?php

namespace Tests\Unit\Models;

use App\Models\Address;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\PharmacyUnit;
use App\Models\Prescription;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrderTest extends TestCase
{
    use RefreshDatabase;

    public function test_order_relations(): void
    {
        $user = User::factory()->create();
        $address = Address::factory()->create(['user_id' => $user->id]);
        $unit = PharmacyUnit::factory()->create();

        $order = Order::factory()->create([
            'user_id' => $user->id,
            'address_id' => $address->id,
            'pharmacy_unit_id' => $unit->id,
        ]);

        $item = OrderItem::factory()->create(['order_id' => $order->id]);
        $prescription = Prescription::factory()->create(['order_id' => $order->id]);

        $this->assertInstanceOf(User::class, $order->user);
        $this->assertEquals($user->id, $order->user->id);

        $this->assertInstanceOf(Address::class, $order->address);
        $this->assertEquals($address->id, $order->address->id);

        $this->assertInstanceOf(PharmacyUnit::class, $order->pharmacyUnit);
        $this->assertEquals($unit->id, $order->pharmacyUnit->id);

        $this->assertTrue($order->items->contains($item));
        $this->assertTrue($order->prescriptions->contains($prescription));
    }

    public function test_order_attribute_casts(): void
    {
        $order = Order::factory()->create([
            'subtotal' => '89.50',
            'shipping_cost' => '12.00',
            'discount' => '5.00',
            'total' => '96.50',
        ]);

        $this->assertIsFloat($order->subtotal);
        $this->assertSame(89.50, $order->subtotal);

        $this->assertIsFloat($order->shipping_cost);
        $this->assertSame(12.00, $order->shipping_cost);

        $this->assertIsFloat($order->discount);
        $this->assertSame(5.00, $order->discount);

        $this->assertIsFloat($order->total);
        $this->assertSame(96.50, $order->total);
    }
}
