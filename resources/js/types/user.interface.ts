export interface User {

    id: number;
    full_name: string;
    cpf: string;
    email: string;
    phone_number: string;
    role: 'admin' | 'customer' | 'guest';
    
}

export interface UserRegistrationData {

    full_name: string;
    cpf: string;
    email: string;
    password: string;
    password_confirmation: string;
    phone_number: string;

}

export interface UserLoginData {

    identifier: string;
    password: string;
    remember?: boolean;

}

export interface UserAddressData {

    user_id: number;
    street: string;
    number: number;
    complement: string;
    country: string;
    city: string;
    state: string;
    zipcode: string;

}