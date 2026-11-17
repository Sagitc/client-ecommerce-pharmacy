<?php

namespace Tests\Feature;

use App\Models\Coupon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CouponTest extends TestCase
{
    use RefreshDatabase;

    public function test_nonexistent_coupon_returns_404_with_expected_message(): void
    {
        $response = $this->postJson('/api/coupons/validate', [
            'code' => 'NAOEXISTE',
            'subtotal' => 100.00,
        ]);

        $response->assertStatus(404)
                 ->assertJson([
                     'valid' => false,
                     'message' => 'Cupom inexistente',
                 ]);
    }

    public function test_expired_coupon_returns_422_with_invalid_message(): void
    {
        Coupon::factory()->expired()->create(['code' => 'EXPIRADO10']);

        $response = $this->postJson('/api/coupons/validate', [
            'code' => 'expirado10',
            'subtotal' => 100.00,
        ]);

        $response->assertStatus(422)
                 ->assertJson([
                     'valid' => false,
                     'message' => 'O cupom não é mais válido',
                 ]);
    }

    public function test_inactive_coupon_returns_422_with_invalid_message(): void
    {
        Coupon::factory()->inactive()->create(['code' => 'INATIVO20']);

        $response = $this->postJson('/api/coupons/validate', [
            'code' => 'INATIVO20',
            'subtotal' => 100.00,
        ]);

        $response->assertStatus(422)
                 ->assertJson([
                     'valid' => false,
                     'message' => 'O cupom não é mais válido',
                 ]);
    }

    public function test_exhausted_coupon_returns_422_with_invalid_message(): void
    {
        Coupon::factory()->exhausted(2)->create(['code' => 'ESGOTADO']);

        $response = $this->postJson('/api/coupons/validate', [
            'code' => 'ESGOTADO',
            'subtotal' => 100.00,
        ]);

        $response->assertStatus(422)
                 ->assertJson([
                     'valid' => false,
                     'message' => 'O cupom não é mais válido',
                 ]);
    }

    public function test_not_started_coupon_returns_422_with_invalid_message(): void
    {
        Coupon::factory()->notStarted()->create(['code' => 'FUTURO10']);

        $response = $this->postJson('/api/coupons/validate', [
            'code' => 'FUTURO10',
            'subtotal' => 100.00,
        ]);

        $response->assertStatus(422)
                 ->assertJson([
                     'valid' => false,
                     'message' => 'O cupom não é mais válido',
                 ]);
    }

    public function test_valid_percentage_coupon_returns_discount_amount(): void
    {
        Coupon::factory()->percentage(10, 25.00)->create(['code' => 'CAMARGO10']);

        $response = $this->postJson('/api/coupons/validate', [
            'code' => '  camargo10 ',
            'subtotal' => 150.00,
        ]);

        $response->assertOk()
                 ->assertJson([
                     'valid' => true,
                     'discount_amount' => 15.0,
                     'coupon' => [
                         'code' => 'CAMARGO10',
                         'type' => 'percentage',
                         'value' => 10.0,
                     ],
                 ]);
    }

    public function test_valid_fixed_coupon_respects_min_order_value(): void
    {
        Coupon::factory()->fixed(15.00)->create([
            'code' => 'BEMVINDO15',
            'min_order_value' => 50.00,
        ]);

        // Abaixo do mínimo
        $this->postJson('/api/coupons/validate', [
            'code' => 'BEMVINDO15',
            'subtotal' => 30.00,
        ])->assertStatus(422)->assertJson(['valid' => false]);

        // Acima do mínimo
        $this->postJson('/api/coupons/validate', [
            'code' => 'BEMVINDO15',
            'subtotal' => 80.00,
        ])->assertOk()->assertJson([
            'valid' => true,
            'discount_amount' => 15.0,
        ]);
    }

    public function test_coupons_table_is_auto_provisioned_and_seeded_when_missing(): void
    {
        \Illuminate\Support\Facades\Schema::dropIfExists('user_coupons');
        \Illuminate\Support\Facades\Schema::dropIfExists('coupons');

        $response = $this->postJson('/api/coupons/validate', [
            'code' => 'CAMARGO10',
            'subtotal' => 100.00,
        ]);

        $response->assertOk()
                 ->assertJson([
                     'valid' => true,
                     'discount_amount' => 10.0,
                     'coupon' => [
                         'code' => 'CAMARGO10',
                     ],
                 ]);
    }

    public function test_user_must_redeem_coupon_to_inventory_before_using_and_cannot_redeem_twice(): void
    {
        $user = \App\Models\User::factory()->create();
        Coupon::factory()->percentage(10.00)->usesPerUser(2)->create(['code' => 'INVENTARIO10']);

        \Laravel\Sanctum\Sanctum::actingAs($user);

        // Sem estar no inventário do usuário, falha na validação
        $this->postJson('/api/coupons/validate', [
            'code' => 'INVENTARIO10',
            'subtotal' => 100.00,
        ])->assertStatus(422)->assertJson([
            'valid' => false,
            'message' => 'Você precisa resgatar este cupom no seu inventário antes de utilizá-lo.',
        ]);

        // Resgata pela 1ª vez com sucesso
        $this->postJson('/api/coupons/redeem', ['code' => 'INVENTARIO10'])
            ->assertCreated()
            ->assertJsonPath('coupon.code', 'INVENTARIO10')
            ->assertJsonPath('coupon.uses_remaining', 2);

        // Não pode pegar o mesmo cupom mais de 1x
        $this->postJson('/api/coupons/redeem', ['code' => 'INVENTARIO10'])
            ->assertStatus(422)
            ->assertJsonPath('message', 'Você já resgatou este cupom anteriormente.');

        // Agora que está no inventário, valida com sucesso
        $this->postJson('/api/coupons/validate', [
            'code' => 'INVENTARIO10',
            'subtotal' => 100.00,
        ])->assertOk()->assertJsonPath('valid', true);
    }

    public function test_limited_coupon_respects_max_redemptions(): void
    {
        $user1 = \App\Models\User::factory()->create();
        $user2 = \App\Models\User::factory()->create();

        Coupon::factory()->limitedRedemptions(1, 0)->create(['code' => 'RARO50']);

        \Laravel\Sanctum\Sanctum::actingAs($user1);
        $this->postJson('/api/coupons/redeem', ['code' => 'RARO50'])->assertCreated();

        \Laravel\Sanctum\Sanctum::actingAs($user2);
        $this->postJson('/api/coupons/redeem', ['code' => 'RARO50'])
            ->assertStatus(422)
            ->assertJsonPath('message', 'Este cupom atingiu o limite máximo de resgates.');
    }

    public function test_expired_coupon_in_user_inventory_is_automatically_lost(): void
    {
        $user = \App\Models\User::factory()->create();
        $coupon = Coupon::factory()->create([
            'code' => 'VAIEXPIRAR',
            'expires_at' => now()->addDay(),
        ]);

        \Laravel\Sanctum\Sanctum::actingAs($user);
        $this->postJson('/api/coupons/redeem', ['code' => 'VAIEXPIRAR'])->assertCreated();
        $this->assertDatabaseHas('user_coupons', [
            'user_id' => $user->id,
            'coupon_id' => $coupon->id,
        ]);

        // Cupom expira
        $coupon->update(['expires_at' => now()->subMinute()]);

        // Ao consultar o inventário, o cupom expirado é perdido/removido
        $this->getJson('/api/coupons/my')
            ->assertOk()
            ->assertJsonCount(0);

        $this->assertDatabaseMissing('user_coupons', [
            'user_id' => $user->id,
            'coupon_id' => $coupon->id,
        ]);
    }
}
