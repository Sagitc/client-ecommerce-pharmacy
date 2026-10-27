// web/hooks/use-product.ts

import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/services/product-service";
import { ProductFilters } from "@/types/product-type";

type FilterType = typeof ProductFilters[number]["value"] | undefined;

export function useProducts(filter?: FilterType) {
    return useQuery({
        queryKey: ["products", filter], 
        queryFn: () => fetchProducts(filter),
        staleTime: 1000 * 60 * 5, // Mantém os dados em cache por 5 minutos
    });
}