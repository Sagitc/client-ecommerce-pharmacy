"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useFavorites } from "@/hooks/use-favorites";
import { useProducts } from "@/hooks/use-product";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";

export default function FavoritesPage() {
    const { favoriteIds } = useFavorites();
    const { data: allProducts = [], isLoading: isLoadingProducts } = useProducts();

    const favIds = favoriteIds.data || [];
    const isLoading = favoriteIds.isLoading || isLoadingProducts;

    return (
        <div className="bg-background border shadow-sm rounded-lg px-6 pt-6 pb-8">
            <h1 className="text-2xl font-bold flex items-center gap-2">
                <Heart className="size-6 text-red-500 fill-red-500" />
                Meus favoritos
            </h1>

            {isLoading ? (
                <div className="py-12 text-center text-muted-foreground">
                    Carregando seus produtos favoritos...
                </div>
            ) : favIds.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
                    <Heart className="size-12 text-muted-foreground/40" />
                    <p className="text-muted-foreground">
                        Você ainda não adicionou nenhum produto aos favoritos.
                    </p>
                    <Button variant="outline">
                        <Link href="/">Explorar produtos</Link>
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
                    {favIds.map((id) => {
                        const matchedProduct = allProducts.find((p) => p.id === id);
                        return (
                            <ProductCard
                                key={id}
                                product={matchedProduct}
                                productId={id}
                                parentStyle="w-full border shadow-xs"
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
}
