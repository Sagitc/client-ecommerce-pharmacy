<?php

namespace Tests\Feature;

use App\Models\Address;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AddressTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_access_addresses(): void
    {
        $this->getJson('/api/addresses')->assertStatus(401);
        $this->postJson('/api/addresses', [])->assertStatus(401);
        $this->deleteJson('/api/addresses/1')->assertStatus(401);
    }

    public function test_user_can_list_only_their_own_addresses_ordered_by_default(): void
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();

        $addr1 = Address::factory()->create([
            'user_id' => $user1->id,
            'label' => 'Secundário',
            'is_default' => false,
        ]);
        $addr2 = Address::factory()->create([
            'user_id' => $user1->id,
            'label' => 'Principal',
            'is_default' => true,
        ]);

        // Endereço de outro usuário não deve aparecer
        Address::factory()->create([
            'user_id' => $user2->id,
            'label' => 'Outro Usuário',
        ]);

        Sanctum::actingAs($user1);

        $response = $this->getJson('/api/addresses');

        $response->assertOk()
                 ->assertJsonCount(2)
                 ->assertJsonPath('0.id', $addr2->id) // is_default = true vem primeiro
                 ->assertJsonPath('1.id', $addr1->id);
    }

    public function test_user_can_create_an_address(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $payload = [
            'label' => 'Casa de Praia',
            'cep' => '21625-001',
            'street' => 'Av. Atlântica',
            'number' => '1000',
            'complement' => 'Apt 201',
            'neighborhood' => 'Copacabana',
            'city' => 'Rio de Janeiro',
            'state' => 'RJ',
            'is_default' => false,
        ];

        $response = $this->postJson('/api/addresses', $payload);

        $response->assertCreated()
                 ->assertJsonFragment([
                     'label' => 'Casa de Praia',
                     'street' => 'Av. Atlântica',
                     'user_id' => $user->id,
                 ]);

        $this->assertDatabaseHas('addresses', [
            'user_id' => $user->id,
            'street' => 'Av. Atlântica',
            'number' => '1000',
        ]);
    }

    public function test_create_address_validation_errors(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->postJson('/api/addresses', []);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['cep', 'street', 'number', 'neighborhood', 'city']);
    }

    public function test_setting_address_as_default_unsets_previous_default(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $firstAddress = Address::factory()->default()->create(['user_id' => $user->id]);
        $this->assertTrue((bool)$firstAddress->is_default);

        $response = $this->postJson('/api/addresses', [
            'label' => 'Novo Padrão',
            'cep' => '21625-001',
            'street' => 'Rua Nova',
            'number' => '50',
            'neighborhood' => 'Centro',
            'city' => 'Rio de Janeiro',
            'is_default' => true,
        ]);

        $response->assertCreated()
                 ->assertJsonPath('is_default', true);

        $this->assertFalse((bool)$firstAddress->fresh()->is_default);
    }

    public function test_user_can_delete_their_own_address(): void
    {
        $user = User::factory()->create();
        $address = Address::factory()->create(['user_id' => $user->id]);

        Sanctum::actingAs($user);

        $response = $this->deleteJson("/api/addresses/{$address->id}");

        $response->assertOk()
                 ->assertJson(['message' => 'Endereço removido.']);

        $this->assertDatabaseMissing('addresses', ['id' => $address->id]);
    }

    public function test_user_cannot_delete_another_users_address(): void
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();

        $addressOfUser2 = Address::factory()->create(['user_id' => $user2->id]);

        Sanctum::actingAs($user1);

        $response = $this->deleteJson("/api/addresses/{$addressOfUser2->id}");

        $response->assertStatus(404);
        $this->assertDatabaseHas('addresses', ['id' => $addressOfUser2->id]);
    }
}
