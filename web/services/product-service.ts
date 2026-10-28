// web/services/product-service.ts

import { ProductType, ProductFilters } from "@/types/product-type";

type FilterType = typeof ProductFilters[number]["value"] | undefined;

const getApiUrl = () => {
    if (typeof window === "undefined") {
        return process.env.INTERNAL_API_URL || "http://api:8000/api";
    }
    return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
};

function mapProductFromApi(raw: any): ProductType {
    return {
        id: raw.id,
        label: raw.label,
        fabricator: raw.fabricator,
        description: raw.description ?? undefined,
        price: Number(raw.price),
        promotionPrice: raw.promotion_price ? Number(raw.promotion_price) : undefined,
        image: raw.image ?? undefined,
        category: raw.category,
        requiresPrescription: Boolean(raw.requires_prescription),
    };
}

export async function fetchProducts(filter?: FilterType): Promise<ProductType[]> {

    const baseUrl = getApiUrl();

    const url = filter 
        ? `${baseUrl}/products?filter=${encodeURIComponent(filter)}` 
        : `${baseUrl}/products`;

    const res = await fetch(url, {
        headers: {
            "Accept": "application/json",
        },
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error(`Erro ao buscar produtos: ${res.status}`);
    }

    const data = await res.json();
    return Array.isArray(data) ? data.map(mapProductFromApi) : [];
}

export async function fetchProductById(id: string | number): Promise<ProductType> {
    const baseUrl = getApiUrl();
    const res = await fetch(`${baseUrl}/products/${id}`, {
        headers: { "Accept": "application/json" },
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error("Produto não encontrado.");
    }

    const raw = await res.json();
    return mapProductFromApi(raw);
}