<?php

namespace Tests\Feature;

use App\Models\Address;
use App\Models\Coupon;
use App\Models\Order;
use App\Models\PharmacyUnit;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class OrderTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_access_orders(): void
    {
        $this->getJson('/api/orders')->assertStatus(401);
        $this->getJson('/api/orders/1')->assertStatus(401);
        $this->postJson('/api/orders', [])->assertStatus(401);
    }

    public function test_user_can_create_pickup_order_without_prescription(): void
    {
        $user = User::factory()->create();
        $unit = PharmacyUnit::factory()->create();
        $product = Product::factory()->create([
            'price' => 50.00,
            'promotion_price' => 40.00,
            'requires_prescription' => false,
            'stock_quantity' => 20,
            'sales_count' => 5,
        ]);

        Sanctum::actingAs($user);

        $payload = [
            'shipping_method' => 'pickup',
            'pharmacy_unit_id' => $unit->id,
            'shipping_cost' => 15.00, // Mesmo se enviado, pickup zera o frete
            'payment_method' => 'pix',
            'notes' => 'Retiro na hora do almoço',
            'items' => [
                ['id' => $product->id, 'quantity' => 2],
            ],
        ];

        $response = $this->postJson('/api/orders', $payload);

        $response->assertCreated()
                 ->assertJsonPath('shipping_method', 'pickup')
                 ->assertJsonPath('pharmacy_unit_id', $unit->id)
                 ->assertJsonPath('subtotal', 80) // 2 * 40.00 (usa promotion_price)
                 ->assertJsonPath('shipping_cost', 0)
                 ->assertJsonPath('total', 80)
                 ->assertJsonPath('status', 'pending')
                 ->assertJsonPath('payment_status', 'pending')
                 ->assertJsonCount(1, 'items');

        // Verifica abate de estoque e incremento de vendas
        $this->assertEquals(18, $product->fresh()->stock_quantity);
        $this->assertEquals(7, $product->fresh()->sales_count);
    }

    public function test_user_can_create_delivery_order(): void
    {
        $user = User::factory()->create();
        $address = Address::factory()->create(['user_id' => $user->id]);
        $product = Product::factory()->create([
            'price' => 25.00,
            'promotion_price' => null,
            'requires_prescription' => false,
        ]);

        Sanctum::actingAs($user);

        $payload = [
            'shipping_method' => 'delivery',
            'address_id' => $address->id,
            'shipping_cost' => 8.50,
            'payment_method' => 'credit_card',
            'items' => [
                ['id' => $product->id, 'quantity' => 3],
            ],
        ];

        $response = $this->postJson('/api/orders', $payload);

        $response->assertCreated()
                 ->assertJsonPath('shipping_method', 'delivery')
                 ->assertJsonPath('address_id', $address->id)
                 ->assertJsonPath('subtotal', 75)
                 ->assertJsonPath('shipping_cost', 8.50)
                 ->assertJsonPath('total', 83.50);
    }

    public function test_create_order_validations(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        // 1. Campos obrigatórios gerais
        $response = $this->postJson('/api/orders', []);
        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['shipping_method', 'shipping_cost', 'payment_method', 'items']);

        // 2. Delivery exige address_id
        $responseDelivery = $this->postJson('/api/orders', [
            'shipping_method' => 'delivery',
            'shipping_cost' => 10,
            'payment_method' => 'pix',
            'items' => [['id' => 1, 'quantity' => 1]],
        ]);
        $responseDelivery->assertStatus(422)
                         ->assertJsonValidationErrors(['address_id']);

        // 3. Pickup exige pharmacy_unit_id
        $responsePickup = $this->postJson('/api/orders', [
            'shipping_method' => 'pickup',
            'shipping_cost' => 0,
            'payment_method' => 'pix',
            'items' => [['id' => 1, 'quantity' => 1]],
        ]);
        $responsePickup->assertStatus(422)
                       ->assertJsonValidationErrors(['pharmacy_unit_id']);

        // 4. Método de pagamento inválido
        $responsePayment = $this->postJson('/api/orders', [
            'shipping_method' => 'pickup',
            'pharmacy_unit_id' => 1,
            'shipping_cost' => 0,
            'payment_method' => 'cheque_invalido',
            'items' => [['id' => 1, 'quantity' => 1]],
        ]);
        $responsePayment->assertStatus(422)
                        ->assertJsonValidationErrors(['payment_method']);
    }

    public function test_order_with_prescription_required_product_fails_without_file(): void
    {
        $user = User::factory()->create();
        $unit = PharmacyUnit::factory()->create();
        $restrictedProduct = Product::factory()->prescriptionRequired()->create();

        Sanctum::actingAs($user);

        $response = $this->postJson('/api/orders', [
            'shipping_method' => 'pickup',
            'pharmacy_unit_id' => $unit->id,
            'shipping_cost' => 0,
            'payment_method' => 'pix',
            'items' => [
                ['id' => $restrictedProduct->id, 'quantity' => 1],
            ],
        ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['prescriptions']);
    }

    public function test_order_with_prescription_succeeds_with_file_and_sets_status_to_awaiting_review(): void
    {
        Storage::fake('local');

        $user = User::factory()->create();
        $unit = PharmacyUnit::factory()->create();
        $restrictedProduct = Product::factory()->prescriptionRequired()->create([
            'price' => 120.00,
        ]);

        Sanctum::actingAs($user);

        $file = UploadedFile::fake()->create('receita_controlada.pdf', 800, 'application/pdf');

        $response = $this->postJson('/api/orders', [
            'shipping_method' => 'pickup',
            'pharmacy_unit_id' => $unit->id,
            'shipping_cost' => 0,
            'payment_method' => 'pix',
            'items' => [
                ['id' => $restrictedProduct->id, 'quantity' => 1],
            ],
            'prescriptions' => [$file],
        ]);

        $response->assertCreated()
                 ->assertJsonPath('status', 'awaiting_prescription_review')
                 ->assertJsonCount(1, 'prescriptions');

        $orderId = $response->json('id');

        $this->assertDatabaseHas('orders', [
            'id' => $orderId,
            'status' => 'awaiting_prescription_review',
        ]);

        $this->assertDatabaseHas('prescriptions', [
            'order_id' => $orderId,
            'original_name' => 'receita_controlada.pdf',
            'status' => 'pending',
        ]);
    }

    public function test_user_can_list_only_their_own_orders_ordered_by_latest(): void
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();

        $order1 = Order::factory()->create([
            'user_id' => $user1->id,
            'created_at' => now()->subDay(),
        ]);
        $order2 = Order::factory()->create([
            'user_id' => $user1->id,
            'created_at' => now(),
        ]);

        // Pedido de outro usuário
        Order::factory()->create(['user_id' => $user2->id]);

        Sanctum::actingAs($user1);

        $response = $this->getJson('/api/orders');

        $response->assertOk()
                 ->assertJsonCount(2)
                 ->assertJsonPath('0.id', $order2->id) // latest
                 ->assertJsonPath('1.id', $order1->id);
    }

    public function test_user_can_show_their_own_order_detail(): void
    {
        $user = User::factory()->create();
        $order = Order::factory()->create(['user_id' => $user->id]);

        Sanctum::actingAs($user);

        $response = $this->getJson("/api/orders/{$order->id}");

        $response->assertOk()
                 ->assertJsonPath('id', $order->id)
                 ->assertJsonStructure([
                     'id',
                     'order_number',
                     'items',
                     'prescriptions',
                     'address',
                     'pharmacy_unit',
                 ]);
    }

    public function test_user_cannot_view_another_users_order(): void
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();

        $orderOfUser2 = Order::factory()->create(['user_id' => $user2->id]);

        Sanctum::actingAs($user1);

        $response = $this->getJson("/api/orders/{$orderOfUser2->id}");

        $response->assertStatus(404);
    }

    public function test_user_can_create_order_with_valid_coupon_and_increments_usage(): void
    {
        $user = User::factory()->create();
        $address = Address::factory()->create(['user_id' => $user->id]);
        $product = Product::factory()->create([
            'price' => 100.00,
            'promotion_price' => null,
            'requires_prescription' => false,
        ]);
        $coupon = Coupon::factory()->percentage(10.00)->create([
            'code' => 'CAMARGO10',
            'used_count' => 0,
            'max_uses_per_user' => 1,
        ]);

        Sanctum::actingAs($user);

        // Resgata o cupom para o inventário do usuário antes de usá-lo
        $this->postJson('/api/coupons/redeem', ['code' => 'CAMARGO10'])->assertCreated();

        $response = $this->postJson('/api/orders', [
            'shipping_method' => 'delivery',
            'address_id' => $address->id,
            'shipping_cost' => 10.00,
            'payment_method' => 'pix',
            'coupon_code' => 'camargo10',
            'items' => [
                ['id' => $product->id, 'quantity' => 1],
            ],
        ]);

        $response->assertCreated()
                 ->assertJsonPath('coupon_code', 'CAMARGO10')
                 ->assertJsonPath('subtotal', 100)
                 ->assertJsonPath('discount', 10)
                 ->assertJsonPath('total', 100); // 100 + 10 - 10

        $this->assertEquals(1, $coupon->fresh()->used_count);
        // Como max_uses_per_user = 1, após usar 1x o cupom sai do inventário
        $this->assertDatabaseMissing('user_coupons', [
            'user_id' => $user->id,
            'coupon_id' => $coupon->id,
        ]);
    }

    public function test_order_creation_fails_when_coupon_not_in_user_inventory(): void
    {
        $user = User::factory()->create();
        $unit = PharmacyUnit::factory()->create();
        $product = Product::factory()->create(['price' => 50.00, 'requires_prescription' => false]);
        Coupon::factory()->percentage(10.00)->create(['code' => 'NAORESGATADO']);

        Sanctum::actingAs($user);

        $this->postJson('/api/orders', [
            'shipping_method' => 'pickup',
            'pharmacy_unit_id' => $unit->id,
            'shipping_cost' => 0,
            'payment_method' => 'pix',
            'coupon_code' => 'NAORESGATADO',
            'items' => [['id' => $product->id, 'quantity' => 1]],
        ])->assertStatus(422)->assertJsonValidationErrors(['coupon_code']);
    }

    public function test_order_creation_fails_with_nonexistent_or_invalid_coupon(): void
    {
        $user = User::factory()->create();
        $unit = PharmacyUnit::factory()->create();
        $product = Product::factory()->create(['price' => 50.00, 'requires_prescription' => false]);
        Coupon::factory()->expired()->create(['code' => 'EXPIRADO10']);

        Sanctum::actingAs($user);

        $this->postJson('/api/orders', [
            'shipping_method' => 'pickup',
            'pharmacy_unit_id' => $unit->id,
            'shipping_cost' => 0,
            'payment_method' => 'pix',
            'coupon_code' => 'INEXISTENTE',
            'items' => [['id' => $product->id, 'quantity' => 1]],
        ])->assertStatus(422)->assertJsonValidationErrors(['coupon_code']);

        $this->postJson('/api/orders', [
            'shipping_method' => 'pickup',
            'pharmacy_unit_id' => $unit->id,
            'shipping_cost' => 0,
            'payment_method' => 'pix',
            'coupon_code' => 'EXPIRADO10',
            'items' => [['id' => $product->id, 'quantity' => 1]],
        ])->assertStatus(422)->assertJsonValidationErrors(['coupon_code']);
    }
}
