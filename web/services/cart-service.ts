// cart-service.ts

import { ProductOrderType } from "@/types/product-type";

const LOCAL_STORAGE_KEY = "user_cart";

const getStoredCart = (): ProductOrderType[] => {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
};

export async function fetchCart(): Promise<ProductOrderType[]> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(getStoredCart());
        }, 300);
    });
}

export async function updateCartRequest(product: Omit<ProductOrderType, 'quantity'>): Promise<ProductOrderType[]> {
    return new Promise((resolve) => {
        setTimeout(() => {
            const cart = getStoredCart();
            const existingIndex = cart.findIndex((item) => item.id === product.id);

            if (existingIndex > -1) {
                cart[existingIndex].quantity += 1;
            } else {
                cart.push({ ...product, quantity: 1 });
            }

            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cart));
            resolve(cart);
        }, 400);
    });
}

export async function removeFromCartRequest(productId: number): Promise<ProductOrderType[]> {
    return new Promise((resolve) => {
        setTimeout(() => {
            const cart = getStoredCart();
            const updatedCart = cart.filter((item) => item.id !== productId);
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedCart));
            resolve(updatedCart);
        }, 300);
    });
}