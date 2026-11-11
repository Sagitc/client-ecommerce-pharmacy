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
}
