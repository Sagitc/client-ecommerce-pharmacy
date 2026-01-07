import axios from 'axios';
import type { Address } from '../handlers/addressHandler';

// --- TYPES --- 

interface AddressApiResponse {
    error: string | null;
    addresses: Address[] | [];
}


// --- API CALLS ---


/**
 * Busca a lista de endereços do usuário a partir da API.
 * @returns Uma promessa que resolve para a lista de endereços do usuário
 */
export async function fetchAddresses(): Promise<Address[]> {
    try {
        const response = await axios.get<AddressApiResponse>('/user/addresses');
        return response.data.addresses;
    } catch (error) {
        console.error('Error fetching addresses:', error);
        throw new Error('Failed to fetch addresses');
    }
}

/**
 * Adiciona um novo endereço para o usuário via API.
 * @param addressData Os dados do endereço a ser adicionado
 * @returns Uma promessa que resolve para a lista atualizada de endereços do usuário
 */
export async function addAddress(addressData: Omit<Address, 'id' | 'is_default'>): Promise<Address[]> {
    try {
        const response = await axios.post<AddressApiResponse>('/user/addresses/add', addressData);
        return response.data.addresses;
    } catch (error) {
        console.error('Error adding address:', error);
        throw new Error('Failed to add address');
    }
}

export async function removeAddress(addressId: number): Promise<Address[]> {
    try {
        const response = await axios.post<AddressApiResponse>('/user/addresses/remove', { id: addressId });
        return response.data.addresses;
    } catch (error) {
        console.error('Error removing address:', error);
        throw new Error('Failed to remove address');
    }
}

export async function updateAddress(addressData: Address): Promise<Address[]> {
    try {
        const response = await axios.post<AddressApiResponse>('/user/addresses/update', addressData);
        return response.data.addresses;
    } catch (error) {
        console.error('Error updating address:', error);
        throw new Error('Failed to update address');
    }
}

export async function setDefaultAddress(addressId: number): Promise<Address[]> {
    try {
        const response = await axios.post<AddressApiResponse>('/user/addresses/set-default', { id: addressId });
        return response.data.addresses;
    } catch (error) {
        console.error('Error setting default address:', error);
        throw new Error('Failed to set default address');
    }
}