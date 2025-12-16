import axios from 'axios';
import type { User, UserRegistrationData, UserLoginData, UserAddressData } from '../types/user.interface';

// --- TYPES ---
interface UserApiResponse {

    id: number;
    full_name: string;
    cpf: string;
    email: string;
    phone_number: string;
    role: 'admin' | 'customer' | 'guest';
    Message?: string;
    Check?: boolean;

}


// --- API CALLS ---


/**
 * Busca o ID do usuário atual.
 * @return Uma promessa que resolve para o ID do usuário.
 */
export async function fetchUser(): Promise<User | null> {
    try {
        const response = await axios.get<UserApiResponse>('/user/get');
        
        if (response.data && response.data.id) {
            return response.data as User;
        }

        return null;

    } catch (error) {

        return null;
        
    }
}

/**
 * Registra um novo usuário.
 * @param userData Os dados do novo usuário a ser cadastrado.
 */
export async function registerUser(userData: UserRegistrationData): Promise<void> {
    try {
        await axios.post('/user/register', userData);
    } catch (error) {
        console.error('Error registering user:', error);
        throw error;
    }
}

/**
 * Faz login do usuário.
 * @param loginData Os dados de login do usuário, campos identifier, password e remember.
 */
export async function loginUser(loginData: UserLoginData): Promise<void> {
    try {
        await axios.post('/user/login', loginData);
    } catch (error) {
        console.error('Error logging in user:', error);
        throw error;
    }
}

/**
 * Cria um novo endereço para o usuário.
 * @param addressData Os dados do endereço do usuário a ser criado.
 * @returns Uma promessa que resolve para os dados do endereço criado.
 */
export async function createAddress(addressData: UserAddressData): Promise<UserAddressData> {
    try {
        const response = await axios.post<UserAddressData>('/user/address/create', addressData);
        return response.data;
    } catch (error) {
        console.error('Error creating user address:', error);
        throw error;
    }
}

/**
 * Busca os endereços do usuário.
 * @returns Uma promessa que resolve para uma lista dos endereços do usuário.
 */
export async function fetchUserAddresses(): Promise<UserAddressData[]> {
    try {
        const response = await axios.get<UserAddressData[]>(`/user/addresses`);
        return response.data;
    } catch (error) {
        console.error('Error fetching user addresses:', error);
        throw error;
    }
}

/**
 * Busca os favoritos do usuário.
 * @returns Uma promessa que resolve para uma lista dos IDs dos produtos favoritos do usuário.
 */
export async function fetchUserFavorites(): Promise<number[]> {
    try {
        const response = await axios.get('/user/favorites');
        return response.data.favorites;
    } catch (error) {
        console.error('Error fetching user favorites:', error);
        throw error;
    }
}

/**
 * Faz logout do usuário.
 * @returns Uma promessa que resolve quando o logout for concluído.
 */
export async function logoutUser(): Promise<void> {
    try {
        await axios.post('/user/logout');
    } catch (error) {
        console.error('Error logging out user:', error);
        throw error;
    }
}