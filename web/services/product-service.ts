// web/services/product-service.ts

import { ProductType, ProductFilters } from "@/types/product-type";
import { ProductData } from "@/data/product-data"; // Mock temporário

type FilterType = typeof ProductFilters[number]["value"] | undefined;

export async function fetchProducts(filter?: FilterType): Promise<ProductType[]> {
  
  // ESTRUTURA FUTURA PARA O LARAVEL:
  // const url = filter ? `${process.env.NEXT_PUBLIC_API_URL}/products?filter=${filter}` : `${process.env.NEXT_PUBLIC_API_URL}/products`;
  // const res = await fetch(url);
  // return res.json();

  // MOCK ATUAL PARA O FRONTEND NÃO QUEBRAR:
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!filter) {
        resolve(ProductData);
        return;
      }

      switch (filter) {
        case "most-sell":
        case "for-you":
        case "dermocosmetics":
        case "laboratory":
        case "news":
        case "suplement":
        case "contraceptive":
        case "hygiene":
        case "infantile":
        case "hair-care":
        case "winter-care":
        case "sunscreen":
        case "diabetes":
        case "release":
          resolve(ProductData.slice(0, 10));
          break;
      }

    }, 600); // 600ms para simular o tempo de rede da API
  });
}