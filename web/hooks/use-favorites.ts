import { 
    useQuery, 
    useMutation, 
    useQueryClient 
} from "@tanstack/react-query";
import { 
    fetchFavorites, 
    toggleFavoriteRequest 
} from "@/services/favorite-service";

export function useFavorites() {
    const queryClient = useQueryClient();

    const favoriteIds = useQuery({
        queryKey: ["favorites"],
        queryFn: fetchFavorites,
        staleTime: 1000 * 60 * 5,
        refetchOnMount: true,
    });

    const toggleFavoriteMutation = useMutation({
        mutationFn: toggleFavoriteRequest,
        onSuccess: (data) => {
            if (Array.isArray(data?.ids)) {
                queryClient.setQueryData(["favorites"], data.ids);
            }
            queryClient.invalidateQueries({ queryKey: ["favorites"] });
            queryClient.invalidateQueries({ queryKey: ["auth-user"] });
        },
    });

    return {
        favoriteIds,
        toggleFavorite: toggleFavoriteMutation.mutate,
        isLoading: toggleFavoriteMutation.isPending,
    };
}
