"use client";

import { useUser } from "@/contexts/user-context";
import { useFavorites } from "@/hooks/use-favorites";
import { ProductCard } from "@/components/product-card";

export default function FavoritesPage() {
    // const user = useUser();

    const favorities = useFavorites();

    return (
        <div className="bg-background shadow-md rounded-lg px-4 pt-6 pb-8">
            <h1 className="text-xl font-bold">Meus favoritos</h1>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4  gap-4 mt-6">
                {favorities.favoriteIds.data?.map((id) => (
                    <ProductCard key={id} productId={id} parentStyle="w-full shadow-md" />
                ))}
            </div>
        </div>
    );
}