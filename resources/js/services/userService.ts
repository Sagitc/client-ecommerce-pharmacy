import axios from 'axios';
import type { User } from '../types/user.interface';

// --- TYPES ---
interface UserApiResponse {
    
    id: number;
    name: string;
    Message?: string;
    Check?: boolean;

}


// --- API CALLS ---

/**
 * Busca o ID do usuário atual.
 * @return Uma promessa que resolve para o ID do usuário.
 */
export async function getUser(): Promise<number> {

    const response = await axios.get<UserApiResponse>('/user/get');
    const data = response.data;
    return data.id;

}

