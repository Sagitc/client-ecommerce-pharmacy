export interface User {

    id: number;
    full_name: string;
    cpf: string;
    email: string;
    role: 'admin' | 'customer' | 'guest';
    
}