import type { ProductCartProps } from "@/types/product.interface";

// --- ESTADO INTERNO ---

let cartItems: ProductCartProps[] = [];

const LISTENERS: Function[] = [];


// --- OBSERVER PATTERN ---


/**
 * Adiciona uma função de callback para ser executada quando o carrinho mudar.
 * @param listener A função de callback que reage à mudança de estado
 */
export function subscribe(listener: Function): void {
    LISTENERS.push(listener);
}

/**
 * Remove uma função de callback da lista de ouvintes do carrinho.
 * @param listener A função de callback a ser removida
 */
export function unsubscribe(listener: Function): void {
    const index = LISTENERS.indexOf(listener);
    if (index > -1) {
        LISTENERS.splice(index, 1);
    }
}

/**
 * Notifica todos os ouvintes registrados sobre uma mudança no carrinho.
 */
function notifyListeners(): void {
    LISTENERS.forEach(listener => listener());
}


// --- LÓGICA E GETTERS ---


/**
 * 
 * @returns Retorna uma cópia do array de itens do carrinho.
 */
export function getCartItems(): ProductCartProps[] {
    return [...(cartItems || [])];
}

/**
 * 
 * @returns Retorna o número total de itens distintos do carrinho.
 */
export function getItemCount(): number {
    return cartItems.length;
}

/**
 * Calcula o valor total do carrinho.
 */
export function calculateTotal(): number {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
}


// --- STATE MODIFIERS ---


/**
 * Atualiza o estado do carrinho com um novo array de itens e notifica os ouvintes.
 * @param newItems O novo array de itens do carrinho
 */
export function updateCartState(newItems: ProductCartProps[]): void {
    cartItems = newItems;
    notifyListeners();
}

export function clearCart(): void {
    cartItems = [];
    notifyListeners();
}