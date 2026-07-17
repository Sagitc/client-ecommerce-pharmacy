import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchFavorites, toggleFavoriteRequest } from "@/services/favorites";

export function useFavorites() {

    const queryClient = useQueryClient();

    const favoriteIds = useQuery({
        queryKey: ["favorites"],
        queryFn: fetchFavorites,
    });

    const toggleFavoriteMutation = useMutation({
        mutationFn: toggleFavoriteRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["favorites"] });
        },
    });

    return {
        favoriteIds,
        toggleFavorite: toggleFavoriteMutation.mutate,
        isLoading: toggleFavoriteMutation.isPending,
    };
}