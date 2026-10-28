// web/services/order-service.ts

import { getAuthToken } from "./auth-service";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export interface CreateOrderPayload {
    shipping_method: "delivery" | "pickup";
    address_id?: number | null;
    pharmacy_unit_id?: number | null;
    shipping_cost: number;
    payment_method: "pix" | "credit_card" | "debit_card" | "cash_on_delivery";
    notes?: string;
    items: {
        id: number;
        quantity: number;
    }[];
    prescriptions?: File[];
}

export async function createOrderRequest(payload: CreateOrderPayload) {

    const token = getAuthToken();
    const formData = new FormData();

    formData.append("shipping_method", payload.shipping_method);
    formData.append("shipping_cost", String(payload.shipping_cost));
    formData.append("payment_method", payload.payment_method);

    if (payload.address_id) {
        formData.append("address_id", String(payload.address_id));
    }
    if (payload.pharmacy_unit_id) {
        formData.append("pharmacy_unit_id", String(payload.pharmacy_unit_id));
    }
    if (payload.notes) {
        formData.append("notes", payload.notes);
    }

    payload.items.forEach((item, index) => {
        formData.append(`items[${index}][id]`, String(item.id));
        formData.append(`items[${index}][quantity]`, String(item.quantity));
    });

    if (payload.prescriptions && payload.prescriptions.length > 0) {
        payload.prescriptions.forEach((file) => {
            formData.append("prescriptions[]", file);
        });
    }

    const res = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            ...(token ? { "Authorization": `Bearer ${token}` } : {}),
        },
        body: formData,
    });

    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || "Não foi possível finalizar o seu pedido.");
    }

    return data;
}

export async function fetchOrdersRequest() {
    const token = getAuthToken();
    const res = await fetch(`${API_URL}/orders`, {
        headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    });

    if (!res.ok) throw new Error("Erro ao carregar histórico de pedidos.");
    return res.json();
}

export async function fetchOrderByIdRequest(id: string | number) {
    const token = getAuthToken();
    const res = await fetch(`${API_URL}/orders/${id}`, {
        headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    });

    if (!res.ok) throw new Error("Pedido não encontrado.");
    return res.json();
}