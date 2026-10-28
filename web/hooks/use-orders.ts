// web/hooks/use-orders.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    createOrderRequest,
    fetchOrdersRequest,
    fetchOrderByIdRequest,
} from "@/services/order-service";

export function useOrders() {
    const queryClient = useQueryClient();

    const ordersQuery = useQuery({
        queryKey: ["orders"],
        queryFn: fetchOrdersRequest,
    });

    const createOrderMutation = useMutation({
        mutationFn: createOrderRequest,
        onSuccess: () => {
            // Limpa o carrinho local após fechar o pedido
            if (typeof window !== "undefined") {
                localStorage.removeItem("user_cart");
            }
            queryClient.invalidateQueries({ queryKey: ["cart"] });
            queryClient.invalidateQueries({ queryKey: ["orders"] });
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },
    });

    return {
        orders: ordersQuery.data ?? [],
        isLoadingOrders: ordersQuery.isLoading,
        createOrder: createOrderMutation.mutateAsync,
        isCreatingOrder: createOrderMutation.isPending,
        createOrderError: createOrderMutation.error,
    };
}

export function useOrderDetail(orderId: string | number) {
    return useQuery({
        queryKey: ["orders", orderId],
        queryFn: () => fetchOrderByIdRequest(orderId),
        enabled: !!orderId,
    });
}