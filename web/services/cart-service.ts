// cart-service.ts

const LOCAL_STORAGE_KEY = "user_cart";

export type StorageCartItem = {
    id: number;
    quantity: number;
};

const getStoredCart = (): StorageCartItem[] => {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
};

export async function fetchCart(): Promise<StorageCartItem[]> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(getStoredCart());
        }, 300);
    });
}

export async function updateCartRequest(productId: number): Promise<StorageCartItem[]> {
    return new Promise((resolve) => {
        setTimeout(() => {
            const cart = getStoredCart();
            const existingIndex = cart.findIndex((item) => item.id === productId);

            if (existingIndex > -1) {
                cart[existingIndex].quantity += 1;
            } else {
                cart.push({ id: productId, quantity: 1 });
            }

            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cart));
            resolve(cart);
        }, 400);
    });
}


export async function removeFromCartRequest(productId: number): Promise<StorageCartItem[]> {
    return new Promise((resolve) => {
        setTimeout(() => {
            const cart = getStoredCart();
            const updatedCart = cart.filter((item) => item.id !== productId);
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedCart));
            resolve(updatedCart);
        }, 300);
    });
}