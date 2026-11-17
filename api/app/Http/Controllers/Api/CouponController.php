<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use App\Models\UserCoupon;
use App\Services\SecuritySanitizer;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CouponController extends Controller
{
    private function formatCoupon(Coupon $coupon, ?UserCoupon $userCoupon = null): array
    {
        return [
            'id' => $coupon->id,
            'code' => $coupon->code,
            'type' => $coupon->type,
            'value' => $coupon->value,
            'min_order_value' => $coupon->min_order_value,
            'max_discount' => $coupon->max_discount,
            'max_uses' => $coupon->max_uses,
            'used_count' => $coupon->used_count,
            'max_uses_per_user' => (int) ($coupon->max_uses_per_user ?? 1),
            'max_redemptions' => $coupon->max_redemptions,
            'redeemed_count' => (int) ($coupon->redeemed_count ?? 0),
            'uses_remaining' => $userCoupon !== null
                ? (int) $userCoupon->uses_remaining
                : (int) ($coupon->max_uses_per_user ?? 1),
            'user_used_count' => $userCoupon !== null ? (int) $userCoupon->used_count : 0,
            'redeemed_at' => $userCoupon?->redeemed_at?->toIso8601String(),
            'expires_at' => $coupon->expires_at?->toIso8601String(),
        ];
    }

    public function myCoupons(Request $request)
    {
        try {
            if (! Coupon::ensureSchemaReady()) {
                return response()->json([]);
            }

            $user = $request->user();
            Coupon::pruneUserInventory($user);

            $inventory = $user->userCoupons()
                ->with('coupon')
                ->latest('redeemed_at')
                ->get()
                ->filter(fn (UserCoupon $uc) => $uc->coupon !== null && $uc->coupon->isValid() && $uc->uses_remaining > 0)
                ->map(fn (UserCoupon $uc) => $this->formatCoupon($uc->coupon, $uc))
                ->values();

            return response()->json($inventory);
        } catch (QueryException) {
            return response()->json([]);
        }
    }

    public function availableCoupons(Request $request)
    {
        try {
            if (! Coupon::ensureSchemaReady()) {
                return response()->json([]);
            }

            $user = $request->user('sanctum');
            if ($user) {
                Coupon::pruneUserInventory($user);
            }

            $redeemedIds = $user
                ? $user->userCoupons()->pluck('coupon_id')->merge($user->orders()->whereNotNull('coupon_id')->pluck('coupon_id'))->unique()->flip()
                : collect();

            $coupons = Coupon::where('is_active', true)
                ->orderBy('id')
                ->get()
                ->filter(fn (Coupon $c) => $c->isValid() && ! $c->isRedemptionExhausted() && ! $redeemedIds->has($c->id))
                ->map(fn (Coupon $c) => $this->formatCoupon($c))
                ->values();

            return response()->json($coupons);
        } catch (QueryException) {
            return response()->json([]);
        }
    }

    public function redeemCoupon(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:64',
        ]);

        $code = Coupon::normalizeCode(SecuritySanitizer::clean($validated['code']));

        if ($code === '') {
            return response()->json([
                'message' => 'Cupom inexistente',
            ], 404);
        }

        try {
            if (! Coupon::ensureSchemaReady()) {
                return response()->json([
                    'message' => 'Não foi possível resgatar o cupom no momento.',
                ], 503);
            }

            return DB::transaction(function () use ($request, $code) {
                $user = $request->user();
                Coupon::pruneUserInventory($user);

                $coupon = Coupon::where('code', $code)->lockForUpdate()->first();

                if (! $coupon) {
                    return response()->json([
                        'message' => 'Cupom inexistente',
                    ], 404);
                }

                $redemptionError = $coupon->getRedemptionError($user);
                if ($redemptionError !== null) {
                    return response()->json([
                        'message' => $redemptionError,
                    ], 422);
                }

                $usesPerUser = max(1, (int) ($coupon->max_uses_per_user ?? 1));

                $userCoupon = $user->userCoupons()->create([
                    'coupon_id' => $coupon->id,
                    'uses_remaining' => $usesPerUser,
                    'used_count' => 0,
                    'redeemed_at' => now(),
                ]);

                $coupon->increment('redeemed_count');

                return response()->json([
                    'message' => 'Cupom adicionado ao seu inventário com sucesso!',
                    'coupon' => $this->formatCoupon($coupon->fresh(), $userCoupon),
                ], 201);
            });
        } catch (QueryException) {
            return response()->json([
                'message' => 'Não foi possível resgatar o cupom no momento.',
            ], 503);
        }
    }

    public function validateCoupon(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:64',
            'subtotal' => 'nullable|numeric|min:0',
        ]);

        $code = Coupon::normalizeCode(SecuritySanitizer::clean($validated['code']));

        if ($code === '') {
            return response()->json([
                'valid' => false,
                'message' => 'Cupom inexistente',
            ], 404);
        }

        try {
            if (! Coupon::ensureSchemaReady()) {
                return response()->json([
                    'valid' => false,
                    'message' => 'Não foi possível validar o cupom no momento.',
                ], 503);
            }

            $coupon = Coupon::where('code', $code)->first();
        } catch (QueryException) {
            return response()->json([
                'valid' => false,
                'message' => 'Não foi possível validar o cupom no momento.',
            ], 503);
        }

        if (! $coupon) {
            return response()->json([
                'valid' => false,
                'message' => 'Cupom inexistente',
            ], 404);
        }

        $user = $request->user('sanctum');
        $subtotal = isset($validated['subtotal']) ? (float) $validated['subtotal'] : null;
        $validationError = $coupon->getValidationError($subtotal, $user);

        if ($validationError !== null) {
            return response()->json([
                'valid' => false,
                'message' => $validationError,
            ], 422);
        }

        $userCoupon = $user
            ? $user->userCoupons()->where('coupon_id', $coupon->id)->first()
            : null;

        $discountAmount = $subtotal !== null ? $coupon->calculateDiscount($subtotal) : 0.0;

        return response()->json([
            'valid' => true,
            'coupon' => $this->formatCoupon($coupon, $userCoupon),
            'discount_amount' => $discountAmount,
            'message' => 'Cupom aplicado com sucesso!',
        ]);
    }
}
