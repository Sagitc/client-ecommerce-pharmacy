// web/services/address-service.ts

import { getAuthToken } from "./auth-service";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export interface AddressPayload {
    label?: string;
    cep: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state?: string;
    is_default?: boolean;
}

export async function fetchAddressesRequest() {
    const token = getAuthToken();
    const res = await fetch(`${API_URL}/addresses`, {
        headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    });

    if (!res.ok) throw new Error("Erro ao buscar endereços.");
    return res.json();
}

export async function createAddressRequest(payload: AddressPayload) {
    const token = getAuthToken();
    const res = await fetch(`${API_URL}/addresses`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Erro ao salvar endereço.");
    return data;
}

export async function deleteAddressRequest(id: number) {
    const token = getAuthToken();
    const res = await fetch(`${API_URL}/addresses/${id}`, {
        method: "DELETE",
        headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    });

    if (!res.ok) throw new Error("Erro ao remover endereço.");
    return res.json();
}