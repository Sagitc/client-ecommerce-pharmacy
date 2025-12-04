import axios from 'axios';
import type { ProductCartProps } from '../types/product.interface';
import { getUser } from './userService';

// --- TYPES ---

interface CartApiResponse {
    error: string | null;
    cart: ProductCartProps[];
    total_items: number;
    total_price: number;
}


// --- API CALLS ---

/**
 * Busca o carrinho atualizado do servidor.
 * @return Uma promessa que resolve para os dados do carrinho.
 */
export async function fetchCart(): Promise<ProductCartProps[]> {
    try {
        const userId = await getUser();
        const response = await axios.get<CartApiResponse>('/cart/get', {
            params: { user_id: userId }
        });
        return response.data.cart;
    } catch (error) {
        console.error('Error fetching cart data:', error);
        throw new Error('Failed to fetch cart data');
    }
}

/**
 * Adiciona um item ao carrinho no servidor.
 * @param product_id ID do produto a ser adicionado
 * @param quantity Quantidade do produto a ser adicionada
 * @returns Uma promessa que resolve para os dados atualizados do carrinho.
 */
export async function addItemToCart(product_id: number, quantity: number = 1): Promise<ProductCartProps[]> {
    try {
        const userId = await getUser();

        const response = await axios.post<CartApiResponse>('/cart/add', {
            product_id: product_id,
            user_id: userId,
            product_quantity: quantity
        });

        return response.data.cart;

    } catch (error) {
        console.error('Error adding product to cart:', error);
        throw new Error('Failed to add product to cart');
    }
}

/**
 * Remove um item do carrinho no servidor.
 * @param product_id ID do produto a ser removido.
 * @returns Uma promessa que resolve para os dados atualizados do carrinho.
 */
export async function removeItemFromCart(product_id: number): Promise<ProductCartProps[]> {
    try {
        const userId = await getUser();

        const response = await axios.post<CartApiResponse>('/cart/remove', {
            product_id: product_id,
            user_id: userId
        });

        return response.data.cart;

    } catch (error) {
        console.error('Error removing product from cart:', error);
        throw new Error('Failed to remove product from cart');
    }
}

/**
 * Atualiza a quantidade de um item no carrinho no servidor.
 * @param product_id ID do produto a ser atualizado.
 * @param quantity Nova quantidade do produto no carrinho.
 * @returns Uma promessa que resolve para os dados atualizados do carrinho.
 */
export async function updateCartItemQuantity(product_id: number, quantity: number): Promise<ProductCartProps[]> {
    try {
        const userId = await getUser();

        const response = await axios.post<CartApiResponse>('/cart/update-quantity', {
            product_id: product_id,
            user_id: userId,
            product_quantity: quantity
        });

        return response.data.cart;

    } catch (error) {
        console.error('Error updating product quantity in cart:', error);
        throw new Error('Failed to update product quantity in cart');
    }
}