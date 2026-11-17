// web/services/coupon-service.ts

import { getAuthToken } from "./auth-service";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export interface ValidatedCoupon {
    id: number;
    code: string;
    type: "percentage" | "fixed";
    value: number;
    min_order_value: number | null;
    max_discount: number | null;
    max_uses?: number | null;
    used_count?: number;
    max_uses_per_user?: number;
    max_redemptions?: number | null;
    redeemed_count?: number;
    uses_remaining?: number;
    user_used_count?: number;
    redeemed_at?: string | null;
    expires_at: string | null;
}

export interface ValidateCouponResponse {
    valid: boolean;
    coupon: ValidatedCoupon;
    discount_amount: number;
    message: string;
}

export interface RedeemCouponResponse {
    message: string;
    coupon: ValidatedCoupon;
}

export function sanitizeCouponErrorMessage(
    rawMessage: unknown,
    fallback = "Não foi possível validar o cupom."
): string {
    if (typeof rawMessage !== "string" || !rawMessage.trim()) {
        return fallback;
    }

    const trimmed = rawMessage.trim();
    if (/SQLSTATE|QueryException|PDOException|Base table or view not found|Connection:\s*(mysql|sqlite|pgsql)/i.test(trimmed)) {
        return fallback;
    }

    return trimmed;
}

export async function fetchMyCouponsRequest(): Promise<ValidatedCoupon[]> {
    const token = getAuthToken();
    if (!token) return [];

    try {
        const res = await fetch(`${API_URL}/coupons/my`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
        });

        if (!res.ok) return [];
        const data = await res.json().catch(() => []);
        return Array.isArray(data) ? data : [];
    } catch {
        return [];
    }
}

export async function fetchAvailableCouponsRequest(): Promise<ValidatedCoupon[]> {
    const token = getAuthToken();

    try {
        const res = await fetch(`${API_URL}/coupons/available`, {
            headers: {
                Accept: "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            cache: "no-store",
        });

        if (!res.ok) return [];
        const data = await res.json().catch(() => []);
        return Array.isArray(data) ? data : [];
    } catch {
        return [];
    }
}

export async function redeemCouponRequest(code: string): Promise<RedeemCouponResponse> {
    const token = getAuthToken();
    if (!token) {
        throw new Error("Você precisa entrar na sua conta para resgatar cupons.");
    }

    const res = await fetch(`${API_URL}/coupons/redeem`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ code }),
    });

    const data = await res.json().catch(() => null);
    if (!res.ok) {
        const fallback =
            res.status >= 500
                ? "Não foi possível resgatar o cupom no momento."
                : "Não foi possível resgatar o cupom.";
        throw new Error(sanitizeCouponErrorMessage(data?.message, fallback));
    }

    return data;
}

export async function validateCouponRequest(payload: {
    code: string;
    subtotal?: number;
}): Promise<ValidateCouponResponse> {
    const token = getAuthToken();
    const res = await fetch(`${API_URL}/coupons/validate`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => null);
    if (!res.ok || !data?.valid) {
        const fallback =
            res.status >= 500
                ? "Não foi possível validar o cupom no momento."
                : "Não foi possível validar o cupom.";
        throw new Error(sanitizeCouponErrorMessage(data?.message, fallback));
    }

    return data;
}

export function calculateCouponDiscount(
    coupon: ValidatedCoupon | null,
    subtotal: number
): number {
    if (!coupon || subtotal <= 0) {
        return 0;
    }

    let discount =
        coupon.type === "percentage"
            ? Math.round(subtotal * (coupon.value / 100) * 100) / 100
            : Math.round(coupon.value * 100) / 100;

    if (coupon.type === "percentage" && coupon.max_discount !== null) {
        discount = Math.min(discount, coupon.max_discount);
    }

    return Math.round(Math.max(0, Math.min(discount, subtotal)) * 100) / 100;
}
