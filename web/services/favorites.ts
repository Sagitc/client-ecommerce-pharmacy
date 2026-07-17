const LOCAL_STORAGE_KEY = "drogaria_camargo_favorites";

const getStoredFavorites = (): number[] => {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
};

export async function fetchFavorites(): Promise<number[]> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(getStoredFavorites());
        }, 300); // delay de 300ms para simular a rede
    });
}

export async function toggleFavoriteRequest(productId: number): Promise<{ isFavorited: boolean }> {
    return new Promise((resolve) => {
        setTimeout(() => {
            const favorites = getStoredFavorites();
            const index = favorites.indexOf(productId);
            let isFavorited = false;

            if (index > -1) {
                favorites.splice(index, 1); // Remove se já existir
            } else {
                favorites.push(productId); // Adiciona se não existir
                isFavorited = true;
            }

            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(favorites));
            resolve({ isFavorited });
        }, 400);
    });
}