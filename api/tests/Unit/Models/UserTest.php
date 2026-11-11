<?php

namespace Tests\Unit\Models;

use App\Models\Address;
use App\Models\Order;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class UserTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_has_addresses_relation(): void
    {
        $user = User::factory()->create();
        $address = Address::factory()->create(['user_id' => $user->id]);

        $this->assertTrue($user->addresses->contains($address));
        $this->assertInstanceOf(Address::class, $user->addresses->first());
    }

    public function test_user_has_orders_relation(): void
    {
        $user = User::factory()->create();
        $order = Order::factory()->create(['user_id' => $user->id]);

        $this->assertTrue($user->orders->contains($order));
        $this->assertInstanceOf(Order::class, $user->orders->first());
    }

    public function test_user_password_is_automatically_hashed(): void
    {
        $user = User::factory()->create(['password' => 'secret123']);

        $this->assertTrue(Hash::check('secret123', $user->password));
    }

    public function test_user_hidden_attributes_are_not_in_array(): void
    {
        $user = User::factory()->create();
        $array = $user->toArray();

        $this->assertArrayNotHasKey('password', $array);
        $this->assertArrayNotHasKey('remember_token', $array);
    }

    public function test_user_roles_can_be_set(): void
    {
        $pharmacist = User::factory()->create(['role' => 'pharmacist']);
        $admin = User::factory()->create(['role' => 'admin']);

        $this->assertEquals('pharmacist', $pharmacist->role);
        $this->assertEquals('admin', $admin->role);
    }
}
