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
    const rawMeta = raw.metadata;
    let parsedMeta: Record<string, string | string[]> | undefined = undefined;
    if (rawMeta && typeof rawMeta === "object" && !Array.isArray(rawMeta)) {
        parsedMeta = rawMeta;
    } else if (typeof rawMeta === "string") {
        try {
            const parsed = JSON.parse(rawMeta);
            if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
                parsedMeta = parsed;
            }
        } catch {
            parsedMeta = undefined;
        }
    }

    return {
        id: raw.id,
        sku: raw.sku ?? undefined,
        ean: raw.ean ?? undefined,
        label: raw.label,
        fabricator: raw.fabricator,
        dosage: raw.dosage ?? undefined,
        activeIngredient: raw.active_ingredient ?? undefined,
        description: raw.description ?? undefined,
        price: Number(raw.price),
        promotionPrice: raw.promotion_price ? Number(raw.promotion_price) : undefined,
        image: raw.image ?? undefined,
        category: raw.category,
        subgroup: raw.subgroup ?? undefined,
        metadata: parsedMeta,
        stripeType: raw.stripe_type ?? "free",
        requiresPrescription: Boolean(raw.requires_prescription),
        inStock: Boolean(raw.in_stock ?? true),
        stockQuantity: Number(raw.stock_quantity ?? 0),
        salesCount: Number(raw.sales_count ?? 0),
        images: Array.isArray(raw.images) ? raw.images : [],
    };
}

export async function fetchProducts(filter?: FilterType): Promise<ProductType[]> {
    const baseUrl = getApiUrl();

    const url = filter
        ? `${baseUrl}/products?filter=${encodeURIComponent(filter)}`
        : `${baseUrl}/products`;

    const res = await fetch(url, {
        headers: {
            Accept: "application/json",
        },
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error(`Erro ao buscar produtos: ${res.status}`);
    }

    const data = await res.json();
    return Array.isArray(data) ? data.map(mapProductFromApi) : [];
}

export interface SearchProductsParams {
    q?: string;
    category?: string;
    subgroup?: string;
    fabricator?: string;
    min_price?: number;
    max_price?: number;
    order?: "price_asc" | "price_desc" | "most_sold" | "newest";
    limit?: number;
}

export async function searchProductsRequest(params: SearchProductsParams): Promise<ProductType[]> {
    const baseUrl = getApiUrl();
    const searchParams = new URLSearchParams();

    if (params.q && params.q.trim()) {
        searchParams.set("q", params.q.trim());
    }
    if (params.category) {
        searchParams.set("category", params.category);
    }
    if (params.subgroup) {
        searchParams.set("subgroup", params.subgroup);
    }
    if (params.fabricator) {
        searchParams.set("fabricator", params.fabricator);
    }
    if (params.min_price !== undefined && !Number.isNaN(params.min_price)) {
        searchParams.set("min_price", String(params.min_price));
    }
    if (params.max_price !== undefined && !Number.isNaN(params.max_price)) {
        searchParams.set("max_price", String(params.max_price));
    }
    if (params.order) {
        searchParams.set("order", params.order);
    }
    searchParams.set("limit", String(params.limit ?? 100));

    const queryString = searchParams.toString();
    const url = `${baseUrl}/products${queryString ? `?${queryString}` : ""}`;

    const res = await fetch(url, {
        headers: {
            Accept: "application/json",
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
        headers: { Accept: "application/json" },
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error("Produto não encontrado.");
    }

    const raw = await res.json();
    return mapProductFromApi(raw);
}
