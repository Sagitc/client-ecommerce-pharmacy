// use-cart.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchCart, updateCartRequest, removeFromCartRequest } from "@/services/cart-service";

export function useCart() {
    const queryClient = useQueryClient();

    const cart = useQuery({
        queryKey: ["cart"],
        queryFn: fetchCart,
        staleTime: 1000 * 60 * 5,
        refetchOnMount: true,
    });

    const addToCartMutation = useMutation({
        mutationFn: updateCartRequest,
        onSuccess: (updatedCart) => {
            queryClient.setQueryData(["cart"], updatedCart);
            queryClient.invalidateQueries({ queryKey: ["cart"] });
        },
    });

    const removeFromCartMutation = useMutation({
        mutationFn: removeFromCartRequest,
        onSuccess: (updatedCart) => {
            queryClient.setQueryData(["cart"], updatedCart);
            queryClient.invalidateQueries({ queryKey: ["cart"] });
        },
    });

    return {
        cart,
        addToCart: addToCartMutation.mutate,
        removeFromCart: removeFromCartMutation.mutate,
        isLoading: addToCartMutation.isPending || removeFromCartMutation.isPending,
    };
}
