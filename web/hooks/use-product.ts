// web/hooks/use-product.ts

import { useQuery } from "@tanstack/react-query";
import { fetchProducts, fetchProductById } from "@/services/product-service";
import { ProductFilters } from "@/types/product-type";

type FilterType = typeof ProductFilters[number]["value"] | undefined;

export function useProducts(filter?: FilterType, enabled = true) {
    return useQuery({
        queryKey: ["products", filter],
        queryFn: () => fetchProducts(filter),
        staleTime: 1000 * 60 * 5,
        enabled,
    });
}

export function useProductDetail(id: string | number) {
    return useQuery({
        queryKey: ["product", id],
        queryFn: () => fetchProductById(id),
        enabled: !!id,
    });
}