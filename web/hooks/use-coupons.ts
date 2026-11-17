"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    fetchAvailableCouponsRequest,
    fetchMyCouponsRequest,
    redeemCouponRequest,
} from "@/services/coupon-service";
import { useAuth } from "./use-auth";

export function useCoupons() {
    const queryClient = useQueryClient();
    const { isAuthenticated } = useAuth();

    const myCouponsQuery = useQuery({
        queryKey: ["my-coupons"],
        queryFn: fetchMyCouponsRequest,
        enabled: isAuthenticated,
    });

    const availableCouponsQuery = useQuery({
        queryKey: ["available-coupons", isAuthenticated],
        queryFn: fetchAvailableCouponsRequest,
    });

    const redeemMutation = useMutation({
        mutationFn: (code: string) => redeemCouponRequest(code),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["my-coupons"] });
            queryClient.invalidateQueries({ queryKey: ["available-coupons"] });
        },
    });

    return {
        myCoupons: myCouponsQuery.data || [],
        isLoadingMyCoupons: myCouponsQuery.isLoading,
        availableCoupons: availableCouponsQuery.data || [],
        isLoadingAvailableCoupons: availableCouponsQuery.isLoading,
        redeemCoupon: redeemMutation.mutateAsync,
        isRedeemingCoupon: redeemMutation.isPending,
    };
}
