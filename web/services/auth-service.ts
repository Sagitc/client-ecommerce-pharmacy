// web/services/auth-service.ts

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
const TOKEN_KEY = "camargo_auth_token";

export const getAuthToken = (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
};

export const setAuthToken = (token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
};

export const clearAuthToken = () => {
    localStorage.removeItem(TOKEN_KEY);
};

export async function loginRequest(credentials: { email: string; password: string }) {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        body: JSON.stringify(credentials),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Erro ao realizar login.");

    setAuthToken(data.token);
    return data;
}

export async function registerRequest(payload: {
    name: string;
    email: string;
    cpf?: string;
    phone?: string;
    password: string;
    password_confirmation: string;
}) {
    const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Erro ao criar conta.");

    setAuthToken(data.token);
    return data;
}

export async function fetchCurrentUser() {
    const token = getAuthToken();
    if (!token) return null;

    const res = await fetch(`${API_URL}/auth/me`, {
        headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        clearAuthToken();
        return null;
    }

    return res.json();
}

export async function logoutRequest() {
    const token = getAuthToken();
    if (token) {
        await fetch(`${API_URL}/auth/logout`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });
    }
    clearAuthToken();
}