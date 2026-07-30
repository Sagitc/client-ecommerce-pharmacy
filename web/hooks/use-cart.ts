// use-cart.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchCart, updateCartRequest, removeFromCartRequest } from "@/services/cart-service";

export function useCart() {
    const queryClient = useQueryClient();

    const cart = useQuery({
        queryKey: ["cart"],
        queryFn: fetchCart,
    });

    const addToCartMutation = useMutation({
        mutationFn: updateCartRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cart"] });
        },
    });

    const removeFromCartMutation = useMutation({
        mutationFn: removeFromCartRequest,
        onSuccess: () => {
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