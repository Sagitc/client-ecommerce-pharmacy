// web/services/cart-service.ts

import { ProductOrderType } from "@/types/product-type";
import { getAuthToken } from "./auth-service";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
const LOCAL_STORAGE_KEY = "user_cart";

const getStoredCart = (): ProductOrderType[] => {
    if (typeof window === "undefined") return [];
    try {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        const parsed = stored ? JSON.parse(stored) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
};

const setStoredCart = (cart: ProductOrderType[]) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cart));
};

export const clearStoredCart = () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(LOCAL_STORAGE_KEY);
};

function mapServerCartItem(raw: any): ProductOrderType {
    return {
        id: Number(raw.id ?? raw.product_id),
        label: raw.label,
        fabricator: raw.fabricator,
        image: raw.image ?? undefined,
        price: Number(raw.price),
        promotionPrice:
            raw.promotionPrice !== null && raw.promotionPrice !== undefined
                ? Number(raw.promotionPrice)
                : raw.promotion_price !== null && raw.promotion_price !== undefined
                    ? Number(raw.promotion_price)
                    : undefined,
        requiresPrescription: Boolean(raw.requiresPrescription ?? raw.requires_prescription),
        quantity: Number(raw.quantity ?? 1),
    };
}

export async function fetchCart(): Promise<ProductOrderType[]> {
    const token = getAuthToken();

    if (!token) {
        return getStoredCart();
    }

    try {
        const res = await fetch(`${API_URL}/cart`, {
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            cache: "no-store",
        });

        if (res.ok) {
            const data = await res.json();
            return Array.isArray(data) ? data.map(mapServerCartItem) : [];
        }
    } catch {
        // Ignora erro de rede
    }

    return [];
}

export async function updateCartRequest(
    product: Omit<ProductOrderType, "quantity"> & { quantity?: number }
): Promise<ProductOrderType[]> {
    const token = getAuthToken();
    const qtyToAdd = product.quantity && product.quantity > 0 ? product.quantity : 1;

    if (token) {
        const res = await fetch(`${API_URL}/cart`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
                product_id: product.id,
                quantity: qtyToAdd,
            }),
        });

        if (!res.ok) {
            throw new Error("Erro ao adicionar produto ao carrinho.");
        }

        const data = await res.json();
        return Array.isArray(data) ? data.map(mapServerCartItem) : [];
    }

    const cart = getStoredCart();
    const existingIndex = cart.findIndex((item) => item.id === product.id);

    if (existingIndex > -1) {
        cart[existingIndex].quantity += qtyToAdd;
    } else {
        cart.push({
            id: product.id,
            label: product.label,
            fabricator: product.fabricator,
            image: product.image,
            price: product.price,
            promotionPrice: product.promotionPrice,
            requiresPrescription: product.requiresPrescription,
            quantity: qtyToAdd,
        });
    }

    setStoredCart(cart);
    return cart;
}

export async function removeFromCartRequest(productId: number): Promise<ProductOrderType[]> {
    const token = getAuthToken();

    if (token) {
        const res = await fetch(`${API_URL}/cart/${productId}`, {
            method: "DELETE",
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!res.ok) {
            throw new Error("Erro ao remover produto do carrinho.");
        }

        const data = await res.json();
        return Array.isArray(data) ? data.map(mapServerCartItem) : [];
    }

    const cart = getStoredCart();
    const updatedCart = cart.filter((item) => item.id !== productId);
    setStoredCart(updatedCart);
    return updatedCart;
}

export async function syncLocalCartToServer(): Promise<ProductOrderType[]> {
    const token = getAuthToken();
    if (!token) return getStoredCart();

    const localCart = getStoredCart();

    if (localCart.length > 0) {
        try {
            const res = await fetch(`${API_URL}/cart/sync`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    items: localCart.map((item) => ({
                        product_id: item.id,
                        quantity: item.quantity && item.quantity > 0 ? item.quantity : 1,
                    })),
                }),
            });

            if (res.ok) {
                clearStoredCart();
                const data = await res.json();
                return Array.isArray(data) ? data.map(mapServerCartItem) : [];
            }
        } catch {
            // Se falhar a sincronização, busca o carrinho atual do servidor
        }
    }

    return fetchCart();
}
