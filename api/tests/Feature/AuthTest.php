<?php

namespace Tests\Feature;

use App\Models\Address;
use App\Models\User;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Password;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_register_with_valid_data(): void
    {
        $response = $this->postJson('/api/auth/register', [
            'name' => 'Maria Silva',
            'email' => 'maria@camargo.com.br',
            'cpf' => '123.456.789-00',
            'phone' => '(21) 99999-8888',
            'password' => 'senhaSegura123',
            'password_confirmation' => 'senhaSegura123',
        ]);

        $response->assertCreated()
                 ->assertJsonStructure([
                     'user' => ['id', 'name', 'email', 'cpf', 'phone', 'role'],
                     'token',
                 ]);

        $this->assertDatabaseHas('users', [
            'email' => 'maria@camargo.com.br',
            'role' => 'customer',
        ]);
    }

    public function test_registration_validation_errors(): void
    {
        $response = $this->postJson('/api/auth/register', []);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['name', 'email', 'password']);
    }

    public function test_registration_fails_with_mismatched_password_confirmation(): void
    {
        $response = $this->postJson('/api/auth/register', [
            'name' => 'João Silva',
            'email' => 'joao@camargo.com.br',
            'password' => '123456',
            'password_confirmation' => '654321',
        ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['password']);
    }

    public function test_registration_fails_with_short_password(): void
    {
        $response = $this->postJson('/api/auth/register', [
            'name' => 'João Silva',
            'email' => 'joao@camargo.com.br',
            'password' => '12345',
            'password_confirmation' => '12345',
        ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['password']);
    }

    public function test_registration_fails_with_duplicate_email(): void
    {
        User::factory()->create(['email' => 'duplicado@camargo.com.br']);

        $response = $this->postJson('/api/auth/register', [
            'name' => 'Outro Usuário',
            'email' => 'duplicado@camargo.com.br',
            'password' => 'senha123',
            'password_confirmation' => 'senha123',
        ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['email']);
    }

    public function test_registration_fails_with_duplicate_cpf(): void
    {
        User::factory()->create(['cpf' => '111.222.333-44']);

        $response = $this->postJson('/api/auth/register', [
            'name' => 'Novo Usuário',
            'email' => 'novo@camargo.com.br',
            'cpf' => '111.222.333-44',
            'password' => 'senha123',
            'password_confirmation' => 'senha123',
        ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['cpf']);
    }

    public function test_user_can_login_with_valid_credentials(): void
    {
        $user = User::factory()->create([
            'email' => 'cliente@camargo.com.br',
            'password' => Hash::make('senhaCorreta'),
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => 'cliente@camargo.com.br',
            'password' => 'senhaCorreta',
        ]);

        $response->assertOk()
                 ->assertJsonStructure(['user' => ['id', 'email', 'name'], 'token'])
                 ->assertJsonPath('user.email', 'cliente@camargo.com.br');
    }

    public function test_login_fails_with_wrong_password(): void
    {
        User::factory()->create([
            'email' => 'cliente@camargo.com.br',
            'password' => Hash::make('senhaCorreta'),
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => 'cliente@camargo.com.br',
            'password' => 'senhaErrada',
        ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['email']);
    }

    public function test_login_fails_with_nonexistent_email(): void
    {
        $response = $this->postJson('/api/auth/login', [
            'email' => 'naoexiste@camargo.com.br',
            'password' => 'senha123',
        ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['email']);
    }

    public function test_login_validation_errors(): void
    {
        $response = $this->postJson('/api/auth/login', []);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['email', 'password']);
    }

    public function test_forgot_password_sends_notification(): void
    {
        Notification::fake();

        $user = User::factory()->create(['email' => 'esqueci@camargo.com.br']);

        $response = $this->postJson('/api/auth/forgot-password', [
            'email' => 'esqueci@camargo.com.br',
        ]);

        $response->assertOk()
                 ->assertJson(['message' => 'Enviamos um link de recuperação para o seu e-mail.']);

        Notification::assertSentTo($user, ResetPassword::class);
    }

    public function test_forgot_password_fails_for_nonexistent_email(): void
    {
        $response = $this->postJson('/api/auth/forgot-password', [
            'email' => 'desconhecido@camargo.com.br',
        ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['email']);
    }

    public function test_reset_password_with_valid_token(): void
    {
        $user = User::factory()->create(['email' => 'reset@camargo.com.br']);
        $token = Password::createToken($user);

        $response = $this->postJson('/api/auth/reset-password', [
            'token' => $token,
            'email' => 'reset@camargo.com.br',
            'password' => 'novaSenha123',
            'password_confirmation' => 'novaSenha123',
        ]);

        $response->assertOk()
                 ->assertJson(['message' => 'Sua senha foi redefinida com sucesso.']);

        $this->assertTrue(Hash::check('novaSenha123', $user->fresh()->password));
    }

    public function test_reset_password_fails_with_invalid_token(): void
    {
        $user = User::factory()->create(['email' => 'reset2@camargo.com.br']);

        $response = $this->postJson('/api/auth/reset-password', [
            'token' => 'token-invalido',
            'email' => 'reset2@camargo.com.br',
            'password' => 'novaSenha123',
            'password_confirmation' => 'novaSenha123',
        ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['email']);
    }

    public function test_me_returns_authenticated_user_with_addresses(): void
    {
        $user = User::factory()->create();
        Address::factory()->count(2)->create(['user_id' => $user->id]);

        Sanctum::actingAs($user);

        $response = $this->getJson('/api/auth/me');

        $response->assertOk()
                 ->assertJsonPath('id', $user->id)
                 ->assertJsonCount(2, 'addresses');
    }

    public function test_me_fails_unauthenticated(): void
    {
        $response = $this->getJson('/api/auth/me');

        $response->assertStatus(401);
    }

    public function test_update_profile_successfully(): void
    {
        $user = User::factory()->create([
            'name' => 'Nome Antigo',
            'phone' => '(21) 1111-1111',
            'cpf' => '111.111.111-11',
        ]);

        Sanctum::actingAs($user);

        $response = $this->putJson('/api/auth/profile', [
            'name' => 'Nome Atualizado',
            'phone' => '(21) 9999-9999',
            'cpf' => '222.222.222-22',
        ]);

        $response->assertOk()
                 ->assertJsonPath('name', 'Nome Atualizado')
                 ->assertJsonPath('phone', '(21) 9999-9999')
                 ->assertJsonPath('cpf', '222.222.222-22');

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'name' => 'Nome Atualizado',
            'phone' => '(21) 9999-9999',
            'cpf' => '222.222.222-22',
        ]);
    }

    public function test_update_profile_rejects_duplicate_cpf_from_another_user(): void
    {
        $user1 = User::factory()->create(['cpf' => '333.333.333-33']);
        $user2 = User::factory()->create(['cpf' => '444.444.444-44']);

        Sanctum::actingAs($user2);

        $response = $this->putJson('/api/auth/profile', [
            'cpf' => '333.333.333-33',
        ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['cpf']);
    }

    public function test_logout_revokes_token(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('test_token');

        $response = $this->withHeader('Authorization', 'Bearer ' . $token->plainTextToken)
                         ->postJson('/api/auth/logout');

        $response->assertOk()
                 ->assertJson(['message' => 'Sessão encerrada com sucesso.']);

        $this->assertDatabaseCount('personal_access_tokens', 0);
    }

    public function test_user_can_change_password_with_correct_current_password(): void
    {
        $user = User::factory()->create([
            'password' => Hash::make('senhaAntiga123'),
        ]);

        Sanctum::actingAs($user);

        $response = $this->putJson('/api/auth/password', [
            'current_password' => 'senhaAntiga123',
            'password' => 'senhaNova456',
            'password_confirmation' => 'senhaNova456',
        ]);

        $response->assertOk()
                 ->assertJson(['message' => 'Senha alterada com sucesso.']);

        $this->assertTrue(Hash::check('senhaNova456', $user->fresh()->password));
    }

    public function test_change_password_fails_with_incorrect_current_password(): void
    {
        $user = User::factory()->create([
            'password' => Hash::make('senhaAntiga123'),
        ]);

        Sanctum::actingAs($user);

        $response = $this->putJson('/api/auth/password', [
            'current_password' => 'senhaErrada',
            'password' => 'senhaNova456',
            'password_confirmation' => 'senhaNova456',
        ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['current_password']);
    }

    public function test_user_can_toggle_and_list_favorites(): void
    {
        $user = User::factory()->create();
        $product = \App\Models\Product::factory()->create();

        Sanctum::actingAs($user);

        // Adiciona aos favoritos
        $toggleAdd = $this->postJson("/api/favorites/{$product->id}/toggle");
        $toggleAdd->assertOk()
                  ->assertJsonPath('is_favorited', true)
                  ->assertJsonPath('ids', [$product->id]);

        // Lista favoritos
        $list = $this->getJson('/api/favorites');
        $list->assertOk()
             ->assertJsonPath('ids', [$product->id])
             ->assertJsonCount(1, 'products');

        // Remove dos favoritos
        $toggleRemove = $this->postJson("/api/favorites/{$product->id}/toggle");
        $toggleRemove->assertOk()
                     ->assertJsonPath('is_favorited', false)
                     ->assertJsonPath('ids', []);
    }

    public function test_user_cart_is_saved_per_account(): void
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        $product = \App\Models\Product::factory()->create(['price' => 25.00]);

        Sanctum::actingAs($user1);

        $addRes = $this->postJson('/api/cart', [
            'product_id' => $product->id,
            'quantity' => 2,
        ]);
        $addRes->assertOk()
               ->assertJsonCount(1)
               ->assertJsonPath('0.id', $product->id)
               ->assertJsonPath('0.quantity', 2);

        // User 2 has an empty cart
        Sanctum::actingAs($user2);
        $this->getJson('/api/cart')
             ->assertOk()
             ->assertJsonCount(0);

        // User 1 still has the item and can remove it
        Sanctum::actingAs($user1);
        $this->getJson('/api/cart')
             ->assertOk()
             ->assertJsonCount(1);

        $this->deleteJson("/api/cart/{$product->id}")
             ->assertOk()
             ->assertJsonCount(0);
    }

    public function test_guest_cart_is_linked_to_new_account_upon_registration_and_pulled_on_another_device(): void
    {
        $product1 = \App\Models\Product::factory()->create(['price' => 19.90]);
        $product2 = \App\Models\Product::factory()->create(['price' => 45.00]);

        // 1. Guest registers with a cart built before registration
        $registerRes = $this->postJson('/api/auth/register', [
            'name' => 'Novo Cliente',
            'email' => 'novocliente@camargo.com.br',
            'password' => 'senha123',
            'password_confirmation' => 'senha123',
            'cart_items' => [
                ['product_id' => $product1->id, 'quantity' => 3],
                ['product_id' => $product2->id, 'quantity' => 1],
            ],
        ]);

        $registerRes->assertCreated();
        $userId = $registerRes->json('user.id');

        $this->assertDatabaseHas('cart_items', [
            'user_id' => $userId,
            'product_id' => $product1->id,
            'quantity' => 3,
        ]);
        $this->assertDatabaseHas('cart_items', [
            'user_id' => $userId,
            'product_id' => $product2->id,
            'quantity' => 1,
        ]);

        // 2. User logs in from another computer and pulls their saved cart
        $loginRes = $this->postJson('/api/auth/login', [
            'email' => 'novocliente@camargo.com.br',
            'password' => 'senha123',
        ]);
        $loginRes->assertOk();
        $newDeviceToken = $loginRes->json('token');

        $cartRes = $this->withHeader('Authorization', "Bearer {$newDeviceToken}")
                        ->getJson('/api/cart');

        $cartRes->assertOk()
                ->assertJsonCount(2)
                ->assertJsonFragment(['id' => $product1->id, 'quantity' => 3])
                ->assertJsonFragment(['id' => $product2->id, 'quantity' => 1]);
    }

    public function test_registration_fails_when_user_is_under_18(): void
    {
        $underageBirthDate = now()->subYears(17)->format('Y-m-d');

        $response = $this->postJson('/api/auth/register', [
            'name' => 'Menor de Idade',
            'email' => 'menor@camargo.com.br',
            'birth_date' => $underageBirthDate,
            'password' => 'senha123',
            'password_confirmation' => 'senha123',
        ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['birth_date']);
    }

    public function test_user_can_upload_and_remove_avatar_and_rejects_oversized_or_non_image_files(): void
    {
        \Illuminate\Support\Facades\Storage::fake('public');

        $user = User::factory()->create();
        Sanctum::actingAs($user);

        // PNG 64x64 válido codificado em binário (independe da extensão GD no ambiente de testes)
        $validPngBytes = base64_decode(
            'iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAOUlEQVR42u3OMQEAAAgDINc/9K3h4QcUaJ'
            . 'AgQRIkSJAgQRIkSJAgQRIkSJAgQRIkSJAgQRIk6NMF2bwAAf41yWAAAAAASUVORK5CYII='
        );

        // 1. Rejeita arquivo que ultrapassa 2MB (2048 KB)
        $oversizedFile = \Illuminate\Http\UploadedFile::fake()
            ->createWithContent('grande.png', $validPngBytes)
            ->size(2500);

        $this->postJson('/api/auth/avatar', [
            'avatar' => $oversizedFile,
        ])->assertStatus(422)->assertJsonValidationErrors(['avatar']);

        // 2. Rejeita arquivo malicioso / formato inválido (ex: script disfarçado ou SVG/PHP)
        $maliciousFile = \Illuminate\Http\UploadedFile::fake()
            ->create('exploit.php', 10, 'application/x-php');

        $this->postJson('/api/auth/avatar', [
            'avatar' => $maliciousFile,
        ])->assertStatus(422)->assertJsonValidationErrors(['avatar']);

        // 3. Aceita imagem válida dentro do limite
        $validImage = \Illuminate\Http\UploadedFile::fake()
            ->createWithContent('avatar.png', $validPngBytes);

        $uploadRes = $this->postJson('/api/auth/avatar', [
            'avatar' => $validImage,
        ]);

        $uploadRes->assertOk();
        $storedPath = $user->fresh()->avatar;
        $this->assertNotNull($storedPath);
        \Illuminate\Support\Facades\Storage::disk('public')->assertExists($storedPath);

        // 4. Remove o avatar e apaga o arquivo do disco
        $this->deleteJson('/api/auth/avatar')->assertOk();
        $this->assertNull($user->fresh()->avatar);
        \Illuminate\Support\Facades\Storage::disk('public')->assertMissing($storedPath);
    }
}
