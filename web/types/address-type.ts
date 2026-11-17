export type AddressType = {
    id: number;
    label?: string;
    receiver: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    cep?: string;
    isDefault: boolean;
    is_default?: boolean;
};
