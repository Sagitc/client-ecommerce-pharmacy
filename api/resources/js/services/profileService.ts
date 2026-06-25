import axios from 'axios';

// ---  TYPES  ---

interface OrderApiResponse {
    error: string | null;
    id: number;
    status: string;
    user?: Array<{
        id: number;
        full_name: string;
    }>;
    total_amount: string;
    payment_method: string;
    products?: Array<{
        'label': string;
        'price': number;
        'quantity'?: number;
        'subtotal'?: number;
    }>;

}


// ---  API CALLS  ---


export async function fetchUserOrders(): Promise<OrderApiResponse[]> {
    try {
        const response = await axios.get<OrderApiResponse[]>('/orders', {});
        return response.data;
    } catch (error) {
        console.error('Error fetching user orders:', error);
        throw new Error('Failed to fetch user orders');
    }
}