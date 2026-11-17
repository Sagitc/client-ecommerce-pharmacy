<?php
// api/app/Http/Controllers/Api/AuthController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\User;
use App\Services\SecuritySanitizer;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\File;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $minAdultBirthDate = now()->subYears(18)->format('Y-m-d');

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'cpf' => 'nullable|string|max:14|unique:users',
            'phone' => 'nullable|string|max:20',
            'birth_date' => ['nullable', 'date', 'before_or_equal:' . $minAdultBirthDate],
            'gender' => 'nullable|string|max:20',
            'password' => 'required|string|min:6|max:100|confirmed',
            'cart_items' => 'nullable|array|max:100',
            'cart_items.*.product_id' => 'required_with:cart_items|integer',
            'cart_items.*.quantity' => 'nullable|integer|min:1|max:100',
        ], [
            'birth_date.before_or_equal' => 'É necessário ter pelo menos 18 anos para realizar o cadastro.',
        ]);

        $userData = [
            'name' => SecuritySanitizer::clean($validated['name']),
            'email' => strtolower(trim($validated['email'])),
            'cpf' => !empty($validated['cpf']) ? SecuritySanitizer::clean($validated['cpf']) : null,
            'phone' => !empty($validated['phone']) ? SecuritySanitizer::clean($validated['phone']) : null,
            'password' => Hash::make($validated['password']),
            'role' => 'customer',
        ];

        if (Schema::hasColumn('users', 'birth_date')) {
            $userData['birth_date'] = $validated['birth_date'] ?? null;
        }
        if (Schema::hasColumn('users', 'gender')) {
            $userData['gender'] = !empty($validated['gender']) ? SecuritySanitizer::clean($validated['gender']) : null;
        }

        $user = User::create($userData);

        if (!empty($validated['cart_items']) && Schema::hasTable('cart_items')) {
            $requestedIds = collect($validated['cart_items'])->pluck('product_id')->unique()->all();
            $validProductIds = Product::whereIn('id', $requestedIds)->pluck('id')->flip();

            foreach ($validated['cart_items'] as $item) {
                $productId = (int) $item['product_id'];
                if (! $validProductIds->has($productId)) {
                    continue;
                }
                $qty = isset($item['quantity']) ? max(1, min(100, (int) $item['quantity'])) : 1;
                $existing = $user->cartItems()->where('product_id', $productId)->first();
                if ($existing) {
                    $existing->update(['quantity' => min(100, $existing->quantity + $qty)]);
                } else {
                    $user->cartItems()->create([
                        'product_id' => $productId,
                        'quantity' => $qty,
                    ]);
                }
            }
        }

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
        $user = $request->user()->load([
            'addresses' => fn ($q) => $q->orderByDesc('is_default'),
        ]);

        if (Schema::hasTable('favorites')) {
            $user->setAttribute('favorite_ids', $user->favorites()->pluck('product_id')->values());
        } else {
            $user->setAttribute('favorite_ids', []);
        }

        return response()->json($user);
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $minAdultBirthDate = now()->subYears(18)->format('Y-m-d');

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|string|email|max:255|unique:users,email,' . $user->id,
            'phone' => 'nullable|string|max:20',
            'cpf' => 'nullable|string|max:14|unique:users,cpf,' . $user->id,
            'birth_date' => ['nullable', 'date', 'before_or_equal:' . $minAdultBirthDate],
            'gender' => 'nullable|string|max:20',
        ], [
            'birth_date.before_or_equal' => 'É necessário ter pelo menos 18 anos.',
        ]);

        $cleanData = [];
        if (isset($validated['name'])) {
            $cleanData['name'] = SecuritySanitizer::clean($validated['name']);
        }
        if (isset($validated['email'])) {
            $cleanData['email'] = strtolower(trim($validated['email']));
        }
        if (array_key_exists('phone', $validated)) {
            $cleanData['phone'] = !empty($validated['phone']) ? SecuritySanitizer::clean($validated['phone']) : null;
        }
        if (array_key_exists('cpf', $validated)) {
            $cleanData['cpf'] = !empty($validated['cpf']) ? SecuritySanitizer::clean($validated['cpf']) : null;
        }
        if (array_key_exists('birth_date', $validated) && Schema::hasColumn('users', 'birth_date')) {
            $cleanData['birth_date'] = $validated['birth_date'] ?: null;
        }
        if (array_key_exists('gender', $validated) && Schema::hasColumn('users', 'gender')) {
            $cleanData['gender'] = !empty($validated['gender']) ? SecuritySanitizer::clean($validated['gender']) : null;
        }

        $user->update($cleanData);

        return response()->json($user->fresh()->load('addresses'));
    }

    public function changePassword(Request $request)
    {
        $validated = $request->validate([
            'current_password' => 'required|string',
            'password' => 'required|string|min:6|max:100|confirmed',
        ]);

        $user = $request->user();

        if (! Hash::check($validated['current_password'], $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['A senha atual informada está incorreta.'],
            ]);
        }

        $user->forceFill([
            'password' => Hash::make($validated['password']),
        ])->save();

        return response()->json([
            'message' => 'Senha alterada com sucesso.',
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Sessão encerrada com sucesso.']);
    }

    public function updateAvatar(Request $request)
    {
        User::ensureAvatarColumn();

        $request->validate([
            'avatar' => [
                'required',
                File::image()
                    ->types(['jpg', 'jpeg', 'png', 'webp'])
                    ->max(2048) // Limite estrito de 2MB (2048 KB)
                    ->dimensions(
                        \Illuminate\Validation\Rule::dimensions()
                            ->minWidth(32)
                            ->minHeight(32)
                            ->maxWidth(4096)
                            ->maxHeight(4096)
                    ),
            ],
        ], [
            'avatar.required' => 'Selecione uma imagem para enviar.',
            'avatar.image' => 'O arquivo enviado deve ser uma imagem válida.',
            'avatar.mimes' => 'Formato não permitido. Utilize apenas JPG, PNG ou WEBP.',
            'avatar.max' => 'A imagem não pode ultrapassar o limite máximo de 2MB.',
            'avatar.dimensions' => 'As dimensões da imagem devem estar entre 32x32 e 4096x4096 pixels.',
        ]);

        $file = $request->file('avatar');
        $realPath = $file->getRealPath();
        $imageInfo = $realPath ? @getimagesize($realPath) : false;

        $allowedMimeMap = [
            'image/jpeg' => 'jpg',
            'image/png' => 'png',
            'image/webp' => 'webp',
        ];

        $detectedMime = is_array($imageInfo) && isset($imageInfo['mime']) ? $imageInfo['mime'] : null;

        if (! $detectedMime || ! isset($allowedMimeMap[$detectedMime])) {
            throw ValidationException::withMessages([
                'avatar' => ['O conteúdo do arquivo não corresponde a uma imagem segura (JPG, PNG ou WEBP).'],
            ]);
        }

        $user = $request->user();

        if (! empty($user->avatar) && Storage::disk('public')->exists($user->avatar)) {
            Storage::disk('public')->delete($user->avatar);
        }

        $safeFilename = Str::uuid()->toString() . '.' . $allowedMimeMap[$detectedMime];
        $storedPath = $file->storeAs("avatars/{$user->id}", $safeFilename, 'public');

        if (Schema::hasColumn('users', 'avatar')) {
            $user->forceFill(['avatar' => $storedPath])->save();
        }

        return response()->json($user->fresh()->load('addresses'));
    }

    public function deleteAvatar(Request $request)
    {
        User::ensureAvatarColumn();

        $user = $request->user();

        if (! empty($user->avatar) && Storage::disk('public')->exists($user->avatar)) {
            Storage::disk('public')->delete($user->avatar);
        }

        if (Schema::hasColumn('users', 'avatar')) {
            $user->forceFill(['avatar' => null])->save();
        }

        return response()->json($user->fresh()->load('addresses'));
    }

    public function showAvatar(string $id)
    {
        User::ensureAvatarColumn();

        $user = User::findOrFail($id);

        if (empty($user->avatar) || ! Storage::disk('public')->exists($user->avatar)) {
            abort(404);
        }

        $mimeType = Storage::disk('public')->mimeType($user->avatar) ?: 'image/jpeg';

        return Storage::disk('public')->response($user->avatar, null, [
            'Content-Type' => $mimeType,
            'X-Content-Type-Options' => 'nosniff',
            'Cache-Control' => 'public, max-age=86400',
        ]);
    }
}