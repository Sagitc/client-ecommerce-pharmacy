<?php

namespace Tests\Unit\Models;

use App\Models\Address;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AddressTest extends TestCase
{
    use RefreshDatabase;

    public function test_address_belongs_to_user(): void
    {
        $user = User::factory()->create();
        $address = Address::factory()->create(['user_id' => $user->id]);

        $this->assertInstanceOf(User::class, $address->user);
        $this->assertEquals($user->id, $address->user->id);
    }

    public function test_address_attributes(): void
    {
        $user = User::factory()->create();
        $address = Address::create([
            'user_id' => $user->id,
            'label' => 'Casa',
            'cep' => '21625-001',
            'street' => 'Estrada Marechal Alencastro',
            'number' => '3695',
            'neighborhood' => 'Anchieta',
            'city' => 'Rio de Janeiro',
            'state' => 'RJ',
            'is_default' => true,
        ]);

        $this->assertEquals('Casa', $address->label);
        $this->assertEquals('21625-001', $address->cep);
        $this->assertTrue((bool)$address->is_default);
    }
}
