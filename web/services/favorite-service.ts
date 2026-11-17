// web/services/favorite-service.ts

import { getAuthToken } from "./auth-service";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
const LOCAL_STORAGE_KEY = "user_favorites";

const getStoredFavorites = (): number[] => {
    if (typeof window === "undefined") return [];
    try {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        const parsed = stored ? JSON.parse(stored) : [];
        return Array.isArray(parsed) ? parsed.map(Number) : [];
    } catch {
        return [];
    }
};

const setStoredFavorites = (ids: number[]) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(ids));
};

export const clearStoredFavorites = () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(LOCAL_STORAGE_KEY);
};

export async function fetchFavorites(): Promise<number[]> {
    const token = getAuthToken();

    if (!token) {
        return getStoredFavorites();
    }

    try {
        const res = await fetch(`${API_URL}/favorites`, {
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            cache: "no-store",
        });

        if (res.ok) {
            const data = await res.json();
            return Array.isArray(data?.ids) ? data.ids.map(Number) : [];
        }
    } catch {
        // Ignora erro de rede
    }

    return [];
}

export async function toggleFavoriteRequest(productId: number): Promise<{ isFavorited: boolean; ids: number[] }> {
    const token = getAuthToken();
    const numericId = Number(productId);

    if (token) {
        const res = await fetch(`${API_URL}/favorites/${numericId}/toggle`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!res.ok) {
            throw new Error("Não foi possível atualizar os favoritos.");
        }

        const data = await res.json();
        const updatedIds: number[] = Array.isArray(data?.ids) ? data.ids.map(Number) : [];
        return {
            isFavorited: Boolean(data.is_favorited),
            ids: updatedIds,
        };
    }

    const favorites = getStoredFavorites();
    const index = favorites.indexOf(numericId);
    let isFavorited = false;

    if (index > -1) {
        favorites.splice(index, 1);
    } else {
        favorites.push(numericId);
        isFavorited = true;
    }

    setStoredFavorites(favorites);
    return { isFavorited, ids: favorites };
}

export async function syncLocalFavoritesToServer(): Promise<number[]> {
    const token = getAuthToken();
    if (!token) return getStoredFavorites();

    const localIds = getStoredFavorites();

    if (localIds.length > 0) {
        try {
            const res = await fetch(`${API_URL}/favorites/sync`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ product_ids: localIds }),
            });

            if (res.ok) {
                clearStoredFavorites();
                const data = await res.json();
                return Array.isArray(data?.ids) ? data.ids.map(Number) : [];
            }
        } catch {
            // Ignora erro de sincronização silenciosa
        }
    }

    return fetchFavorites();
}
