<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class Coupon extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'type',
        'value',
        'min_order_value',
        'max_discount',
        'max_uses',
        'used_count',
        'max_uses_per_user',
        'max_redemptions',
        'redeemed_count',
        'is_active',
        'starts_at',
        'expires_at',
    ];

    protected $casts = [
        'value' => 'float',
        'min_order_value' => 'float',
        'max_discount' => 'float',
        'max_uses' => 'integer',
        'used_count' => 'integer',
        'max_uses_per_user' => 'integer',
        'max_redemptions' => 'integer',
        'redeemed_count' => 'integer',
        'is_active' => 'boolean',
        'starts_at' => 'datetime',
        'expires_at' => 'datetime',
    ];

    public static function defaultCoupons(): array
    {
        return [
            [
                'code' => 'CAMARGO10',
                'type' => 'percentage',
                'value' => 10.00,
                'min_order_value' => null,
                'max_discount' => 50.00,
                'max_uses' => null,
                'used_count' => 0,
                'max_uses_per_user' => 1,
                'max_redemptions' => null,
                'redeemed_count' => 0,
                'is_active' => true,
                'starts_at' => now()->subDay(),
                'expires_at' => now()->addYear(),
            ],
            [
                'code' => 'BEMVINDO15',
                'type' => 'fixed',
                'value' => 15.00,
                'min_order_value' => 30.00,
                'max_discount' => null,
                'max_uses' => null,
                'used_count' => 0,
                'max_uses_per_user' => 2,
                'max_redemptions' => 50,
                'redeemed_count' => 0,
                'is_active' => true,
                'starts_at' => now()->subDay(),
                'expires_at' => now()->addYear(),
            ],
            [
                'code' => 'EXPIRADO10',
                'type' => 'percentage',
                'value' => 10.00,
                'min_order_value' => null,
                'max_discount' => null,
                'max_uses' => null,
                'used_count' => 0,
                'max_uses_per_user' => 1,
                'max_redemptions' => null,
                'redeemed_count' => 0,
                'is_active' => true,
                'starts_at' => now()->subMonths(2),
                'expires_at' => now()->subDay(),
            ],
            [
                'code' => 'INATIVO20',
                'type' => 'percentage',
                'value' => 20.00,
                'min_order_value' => null,
                'max_discount' => null,
                'max_uses' => null,
                'used_count' => 0,
                'max_uses_per_user' => 1,
                'max_redemptions' => null,
                'redeemed_count' => 0,
                'is_active' => false,
                'starts_at' => null,
                'expires_at' => now()->addMonths(6),
            ],
        ];
    }

    public static function ensureSchemaReady(): bool
    {
        try {
            if (! Schema::hasTable('coupons')) {
                Schema::create('coupons', function (Blueprint $table) {
                    $table->id();
                    $table->string('code')->unique();
                    $table->enum('type', ['percentage', 'fixed']);
                    $table->decimal('value', 8, 2);
                    $table->decimal('min_order_value', 10, 2)->nullable();
                    $table->decimal('max_discount', 8, 2)->nullable();
                    $table->unsignedInteger('max_uses')->nullable();
                    $table->unsignedInteger('used_count')->default(0);
                    $table->unsignedInteger('max_uses_per_user')->default(1);
                    $table->unsignedInteger('max_redemptions')->nullable();
                    $table->unsignedInteger('redeemed_count')->default(0);
                    $table->boolean('is_active')->default(true);
                    $table->timestamp('starts_at')->nullable();
                    $table->timestamp('expires_at')->nullable();
                    $table->timestamps();
                });

                foreach (self::defaultCoupons() as $coupon) {
                    self::updateOrCreate(['code' => $coupon['code']], $coupon);
                }
            } else {
                Schema::table('coupons', function (Blueprint $table) {
                    if (! Schema::hasColumn('coupons', 'max_uses_per_user')) {
                        $table->unsignedInteger('max_uses_per_user')->default(1);
                    }
                    if (! Schema::hasColumn('coupons', 'max_redemptions')) {
                        $table->unsignedInteger('max_redemptions')->nullable();
                    }
                    if (! Schema::hasColumn('coupons', 'redeemed_count')) {
                        $table->unsignedInteger('redeemed_count')->default(0);
                    }
                });
            }

            if (! Schema::hasTable('user_coupons')) {
                Schema::create('user_coupons', function (Blueprint $table) {
                    $table->id();
                    $table->foreignId('user_id')->constrained()->cascadeOnDelete();
                    $table->foreignId('coupon_id')->constrained()->cascadeOnDelete();
                    $table->unsignedInteger('uses_remaining')->default(1);
                    $table->unsignedInteger('used_count')->default(0);
                    $table->timestamp('redeemed_at')->nullable();
                    $table->timestamps();

                    $table->unique(['user_id', 'coupon_id']);
                });
            }

            if (
                Schema::hasTable('orders')
                && ! Schema::hasColumn('orders', 'coupon_id')
            ) {
                Schema::table('orders', function (Blueprint $table) {
                    $table->foreignId('coupon_id')->nullable()->constrained()->nullOnDelete();
                    $table->string('coupon_code')->nullable();
                });
            }

            return true;
        } catch (\Throwable) {
            return false;
        }
    }

    public static function pruneUserInventory(User $user): void
    {
        if (! Schema::hasTable('user_coupons')) {
            return;
        }

        $now = now();

        $user->userCoupons()
            ->where(function ($query) use ($now) {
                $query->where('uses_remaining', '<=', 0)
                    ->orWhereHas('coupon', function ($q) use ($now) {
                        $q->where('is_active', false)
                            ->orWhere(function ($sub) use ($now) {
                                $sub->whereNotNull('expires_at')
                                    ->where('expires_at', '<=', $now);
                            });
                    });
            })
            ->delete();
    }

    public static function normalizeCode(?string $code): string
    {
        return mb_strtoupper(trim((string) $code));
    }

    protected function code(): Attribute
    {
        return Attribute::make(
            set: fn (string $value) => self::normalizeCode($value),
        );
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function userCoupons()
    {
        return $this->hasMany(UserCoupon::class);
    }

    public function isExpired(): bool
    {
        return $this->expires_at !== null && $this->expires_at->isPast();
    }

    public function isRedemptionExhausted(): bool
    {
        return $this->max_redemptions !== null && $this->redeemed_count >= $this->max_redemptions;
    }

    /**
     * Verifica se o cupom está ativo, dentro do prazo de validade e com usos disponíveis.
     */
    public function isValid(): bool
    {
        if (! $this->is_active) {
            return false;
        }

        if ($this->starts_at && $this->starts_at->isFuture()) {
            return false;
        }

        if ($this->isExpired()) {
            return false;
        }

        if ($this->max_uses !== null && $this->used_count >= $this->max_uses) {
            return false;
        }

        return true;
    }

    /**
     * Verifica se o cupom pode ser resgatado para o inventário de um usuário.
     */
    public function getRedemptionError(?User $user = null): ?string
    {
        if (! $this->isValid()) {
            return 'O cupom não é mais válido';
        }

        if ($this->isRedemptionExhausted()) {
            return 'Este cupom atingiu o limite máximo de resgates.';
        }

        if ($user !== null) {
            $alreadyRedeemed = $user->userCoupons()
                ->where('coupon_id', $this->id)
                ->exists();

            $usedPreviously = $user->orders()
                ->where('coupon_id', $this->id)
                ->exists();

            if ($alreadyRedeemed || $usedPreviously) {
                return 'Você já resgatou este cupom anteriormente.';
            }
        }

        return null;
    }

    /**
     * Retorna null se o cupom puder ser usado para o subtotal informado,
     * ou a mensagem de erro correspondente caso contrário.
     */
    public function getValidationError(?float $subtotal = null, ?User $user = null): ?string
    {
        if (! $this->isValid()) {
            if ($user !== null && Schema::hasTable('user_coupons')) {
                $user->userCoupons()->where('coupon_id', $this->id)->delete();
            }
            return 'O cupom não é mais válido';
        }

        if ($user !== null && Schema::hasTable('user_coupons')) {
            self::pruneUserInventory($user);

            $userCoupon = $user->userCoupons()
                ->where('coupon_id', $this->id)
                ->first();

            if (! $userCoupon) {
                return 'Você precisa resgatar este cupom no seu inventário antes de utilizá-lo.';
            }

            if ($userCoupon->uses_remaining <= 0) {
                $userCoupon->delete();
                return 'Você já utilizou todos os usos disponíveis deste cupom.';
            }
        }

        if ($subtotal !== null && $this->min_order_value !== null && $subtotal < $this->min_order_value) {
            return 'Este cupom exige um pedido mínimo de R$ '
                . number_format($this->min_order_value, 2, ',', '.')
                . '.';
        }

        return null;
    }

    /**
     * Calcula o valor do desconto em reais para um determinado subtotal.
     */
    public function calculateDiscount(float $subtotal): float
    {
        if ($subtotal <= 0) {
            return 0.0;
        }

        $discount = $this->type === 'percentage'
            ? round($subtotal * ($this->value / 100), 2)
            : round((float) $this->value, 2);

        if ($this->type === 'percentage' && $this->max_discount !== null) {
            $discount = min($discount, (float) $this->max_discount);
        }

        return round(max(0.0, min($discount, $subtotal)), 2);
    }
}
