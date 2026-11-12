// cart-service.ts

import { ProductOrderType } from "@/types/product-type";

const LOCAL_STORAGE_KEY = "user_cart";

const getStoredCart = (): ProductOrderType[] => {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
};

export async function fetchCart(): Promise<ProductOrderType[]> {
    return getStoredCart();
}

export async function updateCartRequest(product: Omit<ProductOrderType, 'quantity'> & { quantity?: number }): Promise<ProductOrderType[]> {
    return new Promise((resolve) => {
        setTimeout(() => {
            const cart = getStoredCart();
            const existingIndex = cart.findIndex((item) => item.id === product.id);
            const qtyToAdd = product.quantity && product.quantity > 0 ? product.quantity : 1;

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
