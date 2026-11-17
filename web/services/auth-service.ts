// web/services/auth-service.ts

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
const TOKEN_KEY = "camargo_auth_token";

export const getAuthToken = (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
};

export const setAuthToken = (token: string) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(TOKEN_KEY, token);
};

export const clearAuthToken = () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(TOKEN_KEY);
};

function extractApiError(data: any, fallback: string): string {
    if (data?.errors && typeof data.errors === "object") {
        const firstFieldErrors = Object.values(data.errors)[0];
        if (Array.isArray(firstFieldErrors) && firstFieldErrors.length > 0) {
            return String(firstFieldErrors[0]);
        }
    }
    return data?.message || fallback;
}

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
    if (!res.ok) throw new Error(extractApiError(data, "Erro ao realizar login."));

    setAuthToken(data.token);
    return data;
}

export async function registerRequest(payload: {
    name: string;
    email: string;
    cpf?: string;
    phone?: string;
    birth_date?: string;
    gender?: string;
    password: string;
    password_confirmation: string;
}) {
    let guestCartItems: { product_id: number; quantity: number }[] = [];
    if (typeof window !== "undefined") {
        try {
            const rawCart = localStorage.getItem("user_cart");
            const parsedCart = rawCart ? JSON.parse(rawCart) : [];
            if (Array.isArray(parsedCart) && parsedCart.length > 0) {
                guestCartItems = parsedCart.map((item: any) => ({
                    product_id: Number(item.id ?? item.product_id),
                    quantity: item.quantity && item.quantity > 0 ? Number(item.quantity) : 1,
                }));
            }
        } catch {
            guestCartItems = [];
        }
    }

    const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        body: JSON.stringify({
            ...payload,
            ...(guestCartItems.length > 0 ? { cart_items: guestCartItems } : {}),
        }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(extractApiError(data, "Erro ao criar conta."));

    if (typeof window !== "undefined" && guestCartItems.length > 0) {
        localStorage.removeItem("user_cart");
    }

    setAuthToken(data.token);
    return data;
}

export async function fetchCurrentUser() {
    const token = getAuthToken();
    if (!token) return null;

    try {
        const res = await fetch(`${API_URL}/auth/me`, {
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!res.ok) {
            if (res.status === 401) {
                clearAuthToken();
            }
            return null;
        }

        return await res.json();
    } catch {
        return null;
    }
}

export async function updateProfileRequest(payload: {
    name?: string;
    email?: string;
    cpf?: string | null;
    phone?: string | null;
    birth_date?: string | null;
    gender?: string | null;
}) {
    const token = getAuthToken();
    if (!token) throw new Error("Você precisa estar autenticado para atualizar o perfil.");

    const res = await fetch(`${API_URL}/auth/profile`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(extractApiError(data, "Erro ao atualizar perfil."));
    return data;
}

export async function updateAvatarRequest(file: File) {
    const token = getAuthToken();
    if (!token) throw new Error("Você precisa estar autenticado para atualizar sua foto.");

    const formData = new FormData();
    formData.append("avatar", file);

    const res = await fetch(`${API_URL}/auth/avatar`, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: formData,
    });

    const data = await res.json().catch(() => null);
    if (!res.ok) throw new Error(extractApiError(data, "Erro ao enviar a foto de perfil."));
    return data;
}

export async function deleteAvatarRequest() {
    const token = getAuthToken();
    if (!token) throw new Error("Você precisa estar autenticado para remover sua foto.");

    const res = await fetch(`${API_URL}/auth/avatar`, {
        method: "DELETE",
        headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    });

    const data = await res.json().catch(() => null);
    if (!res.ok) throw new Error(extractApiError(data, "Erro ao remover a foto de perfil."));
    return data;
}

export async function changePasswordRequest(payload: {
    current_password: string;
    password: string;
    password_confirmation: string;
}) {
    const token = getAuthToken();
    if (!token) throw new Error("Você precisa estar autenticado para alterar a senha.");

    const res = await fetch(`${API_URL}/auth/password`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(extractApiError(data, "Erro ao alterar a senha."));
    return data;
}

export async function logoutRequest() {
    const token = getAuthToken();
    if (token) {
        try {
            await fetch(`${API_URL}/auth/logout`, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });
        } catch {
            // Ignora falha de rede ao encerrar sessão local
        }
    }
    clearAuthToken();
}

export async function forgotPasswordRequest(email: string) {
    const res = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(extractApiError(data, "Não foi possível enviar o link de recuperação."));
    return data;
}

export async function resetPasswordRequest(payload: {
    token: string;
    email: string;
    password: string;
    password_confirmation: string;
}) {
    const res = await fetch(`${API_URL}/auth/reset-password`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(extractApiError(data, "Erro ao redefinir a senha."));
    return data;
}
