<?php
// api/app/Http/Controllers/Api/AuthController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\SecuritySanitizer;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'cpf' => 'nullable|string|max:14|unique:users',
            'phone' => 'nullable|string|max:20',
            'password' => 'required|string|min:6|max:100|confirmed',
        ]);

        $user = User::create([
            'name' => SecuritySanitizer::clean($validated['name']),
            'email' => strtolower(trim($validated['email'])),
            'cpf' => !empty($validated['cpf']) ? SecuritySanitizer::clean($validated['cpf']) : null,
            'phone' => !empty($validated['phone']) ? SecuritySanitizer::clean($validated['phone']) : null,
            'password' => Hash::make($validated['password']),
            'role' => 'customer',
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['As credenciais informadas estão incorretas.'],
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ]);
    }

    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        // Em desenvolvimento, se MAIL_MAILER=log no .env, o link sai em storage/logs/laravel.log
        $status = Password::sendResetLink($request->only('email'));

        if ($status !== Password::RESET_LINK_SENT) {
            throw ValidationException::withMessages([
                'email' => [__($status)],
            ]);
        }

        return response()->json([
            'message' => 'Enviamos um link de recuperação para o seu e-mail.',
        ]);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|min:6|max:100|confirmed',
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function (User $user, string $password) {
                $user->forceFill([
                    'password' => Hash::make($password),
                    'remember_token' => Str::random(60),
                ])->save();

                // Revoga tokens antigos por segurança
                $user->tokens()->delete();

                event(new PasswordReset($user));
            }
        );

        if ($status !== Password::PASSWORD_RESET) {
            throw ValidationException::withMessages([
                'email' => ['Token inválido ou expirado. Solicite uma nova recuperação.'],
            ]);
        }

        return response()->json([
            'message' => 'Sua senha foi redefinida com sucesso.',
        ]);
    }

    public function me(Request $request)
    {
        return response()->json($request->user()->load('addresses'));
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'phone' => 'nullable|string|max:20',
            'cpf' => 'nullable|string|max:14|unique:users,cpf,' . $user->id,
        ]);

        $cleanData = [];
        if (isset($validated['name'])) {
            $cleanData['name'] = SecuritySanitizer::clean($validated['name']);
        }
        if (array_key_exists('phone', $validated)) {
            $cleanData['phone'] = !empty($validated['phone']) ? SecuritySanitizer::clean($validated['phone']) : null;
        }
        if (array_key_exists('cpf', $validated)) {
            $cleanData['cpf'] = !empty($validated['cpf']) ? SecuritySanitizer::clean($validated['cpf']) : null;
        }

        $user->update($cleanData);

        return response()->json($user);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Sessão encerrada com sucesso.']);
    }
}