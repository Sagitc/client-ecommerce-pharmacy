<?php

namespace Tests\Feature;

use App\Models\Address;
use App\Models\Order;
use App\Models\PharmacyUnit;
use App\Models\Prescription;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class SecurityTest extends TestCase
{
    use RefreshDatabase;

    public function test_security_headers_are_present_on_api_responses(): void
    {
        $response = $this->getJson('/api/products');

        $response->assertOk()
                 ->assertHeader('X-Content-Type-Options', 'nosniff')
                 ->assertHeader('X-Frame-Options', 'SAMEORIGIN')
                 ->assertHeader('X-XSS-Protection', '1; mode=block')
                 ->assertHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
                 ->assertHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    }

    public function test_user_cannot_place_order_with_address_belonging_to_another_user_idor(): void
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();

        // Endereço pertence estritamente ao User 2
        $addressOfUser2 = Address::factory()->create(['user_id' => $user2->id]);
        $product = Product::factory()->create(['price' => 20.00, 'stock_quantity' => 10]);

        // User 1 tenta fazer pedido usando o address_id do User 2
        Sanctum::actingAs($user1);

        $response = $this->postJson('/api/orders', [
            'shipping_method' => 'delivery',
            'address_id' => $addressOfUser2->id,
            'shipping_cost' => 10.00,
            'payment_method' => 'pix',
            'items' => [
                ['id' => $product->id, 'quantity' => 1],
            ],
        ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['address_id']);
    }

    public function test_user_cannot_place_pickup_order_with_inactive_pharmacy_unit(): void
    {
        $user = User::factory()->create();
        $inactiveUnit = PharmacyUnit::factory()->inactive()->create();
        $product = Product::factory()->create(['stock_quantity' => 10]);

        Sanctum::actingAs($user);

        $response = $this->postJson('/api/orders', [
            'shipping_method' => 'pickup',
            'pharmacy_unit_id' => $inactiveUnit->id,
            'shipping_cost' => 0,
            'payment_method' => 'pix',
            'items' => [
                ['id' => $product->id, 'quantity' => 1],
            ],
        ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['pharmacy_unit_id']);
    }

    public function test_user_cannot_order_out_of_stock_products(): void
    {
        $user = User::factory()->create();
        $unit = PharmacyUnit::factory()->create();

        // Produto com estoque zero
        $outOfStockProduct = Product::factory()->create([
            'label' => 'Dipirona 500mg',
            'in_stock' => false,
            'stock_quantity' => 0,
        ]);

        Sanctum::actingAs($user);

        $response = $this->postJson('/api/orders', [
            'shipping_method' => 'pickup',
            'pharmacy_unit_id' => $unit->id,
            'shipping_cost' => 0,
            'payment_method' => 'pix',
            'items' => [
                ['id' => $outOfStockProduct->id, 'quantity' => 1],
            ],
        ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['items'])
                 ->assertJsonFragment([
                     'items' => ["O produto 'Dipirona 500mg' não possui estoque suficiente disponível."],
                 ]);
    }

    public function test_user_cannot_order_more_quantity_than_available_in_stock(): void
    {
        $user = User::factory()->create();
        $unit = PharmacyUnit::factory()->create();

        // Produto com apenas 2 unidades disponíveis
        $limitedProduct = Product::factory()->create([
            'label' => 'Vitamina C',
            'in_stock' => true,
            'stock_quantity' => 2,
        ]);

        Sanctum::actingAs($user);

        $response = $this->postJson('/api/orders', [
            'shipping_method' => 'pickup',
            'pharmacy_unit_id' => $unit->id,
            'shipping_cost' => 0,
            'payment_method' => 'pix',
            'items' => [
                ['id' => $limitedProduct->id, 'quantity' => 5], // Pede 5 mas só tem 2
            ],
        ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['items']);
    }

    public function test_user_cannot_send_duplicate_product_ids_in_same_order(): void
    {
        $user = User::factory()->create();
        $unit = PharmacyUnit::factory()->create();
        $product = Product::factory()->create(['stock_quantity' => 20]);

        Sanctum::actingAs($user);

        $response = $this->postJson('/api/orders', [
            'shipping_method' => 'pickup',
            'pharmacy_unit_id' => $unit->id,
            'shipping_cost' => 0,
            'payment_method' => 'pix',
            'items' => [
                ['id' => $product->id, 'quantity' => 1],
                ['id' => $product->id, 'quantity' => 2], // ID duplicado no mesmo pedido
            ],
        ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['items.0.id', 'items.1.id']);
    }

    public function test_address_text_fields_are_sanitized_against_stored_xss(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->postJson('/api/addresses', [
            'label' => '<script>alert("xss")</script>Casa Nova',
            'cep' => '21625-001',
            'street' => '<img src=x onerror=alert(1)>Rua Segura',
            'number' => '100<b>',
            'neighborhood' => '<b>Centro</b>',
            'city' => '<i>Rio de Janeiro</i>',
            'state' => 'rj',
        ]);

        $response->assertCreated();

        $this->assertDatabaseHas('addresses', [
            'user_id' => $user->id,
            'label' => 'Casa Nova',
            'street' => 'Rua Segura',
            'number' => '100',
            'neighborhood' => 'Centro',
            'city' => 'Rio de Janeiro',
            'state' => 'RJ',
        ]);
    }

    public function test_address_creation_fails_when_exceeding_max_limit_dos_prevention(): void
    {
        $user = User::factory()->create();
        Address::factory()->count(20)->create(['user_id' => $user->id]);

        Sanctum::actingAs($user);

        $response = $this->postJson('/api/addresses', [
            'cep' => '21625-001',
            'street' => 'Rua Limite',
            'number' => '1',
            'neighborhood' => 'Centro',
            'city' => 'Rio de Janeiro',
        ]);

        $response->assertStatus(422);
    }

    public function test_product_query_escapes_like_wildcards_and_caps_limits(): void
    {
        Product::factory()->create(['label' => 'Mel Puro de Abelha']);
        Product::factory()->create(['label' => 'Shampoo Neutro']);

        // Requisição com limit abusivo é bloqueada por validação
        $this->getJson('/api/products?limit=9999')->assertStatus(422);

        // Busca com tags maliciosas tem as tags removidas e busca o termo limpo
        $response = $this->getJson('/api/products?q=<script>evil()</script>Puro&limit=50');

        $response->assertOk();
        $this->assertCount(1, $response->json());
        $this->assertEquals('Mel Puro de Abelha', $response->json('0.label'));
    }

    public function test_registration_sanitizes_name_and_prevents_role_tampering(): void
    {
        $response = $this->postJson('/api/auth/register', [
            'name' => '<script>evil()</script>Carlos Teste',
            'email' => 'CARLOS@CAMARGO.COM.BR',
            'password' => 'secret123',
            'password_confirmation' => 'secret123',
            'role' => 'admin', // Tentativa maliciosa de se registrar como admin
        ]);

        $response->assertCreated();

        $this->assertDatabaseHas('users', [
            'name' => 'Carlos Teste',
            'email' => 'carlos@camargo.com.br',
            'role' => 'customer', // Papel forçado a customer
        ]);
    }

    public function test_profile_update_prevents_role_elevation(): void
    {
        $user = User::factory()->create(['role' => 'customer']);
        Sanctum::actingAs($user);

        $response = $this->putJson('/api/auth/profile', [
            'name' => 'Novo Nome',
            'role' => 'admin', // Tentativa de auto-promoção a admin
        ]);

        $response->assertOk();
        $this->assertEquals('customer', $user->fresh()->role);
    }

    public function test_order_notes_are_sanitized_against_xss(): void
    {
        $user = User::factory()->create();
        $unit = PharmacyUnit::factory()->create();
        $product = Product::factory()->create(['stock_quantity' => 10]);

        Sanctum::actingAs($user);

        $response = $this->postJson('/api/orders', [
            'shipping_method' => 'pickup',
            'pharmacy_unit_id' => $unit->id,
            'shipping_cost' => 0,
            'payment_method' => 'pix',
            'notes' => '<script>alert("XSS")</script>Deixar na portaria',
            'items' => [
                ['id' => $product->id, 'quantity' => 1],
            ],
        ]);

        $response->assertCreated();
        $this->assertEquals('Deixar na portaria', $response->json('notes'));
    }

    public function test_prescription_download_prevents_directory_traversal(): void
    {
        $pharmacist = User::factory()->create(['role' => 'pharmacist']);
        Sanctum::actingAs($pharmacist);

        // Prescrição simulando injeção de caminho relativo para fora do diretório seguro
        $maliciousPrescription = Prescription::factory()->create([
            'file_path' => 'prescriptions/../../etc/passwd',
        ]);

        $response = $this->getJson("/api/admin/prescriptions/{$maliciousPrescription->id}/file");

        $response->assertForbidden();
    }
}
