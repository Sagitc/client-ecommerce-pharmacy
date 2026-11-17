// web/hooks/use-auth.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    fetchCurrentUser,
    loginRequest,
    registerRequest,
    updateProfileRequest,
    updateAvatarRequest,
    deleteAvatarRequest,
    changePasswordRequest,
    forgotPasswordRequest,
    resetPasswordRequest,
    logoutRequest,
} from "@/services/auth-service";
import { syncLocalFavoritesToServer, clearStoredFavorites } from "@/services/favorite-service";
import { syncLocalCartToServer, clearStoredCart } from "@/services/cart-service";

export function useAuth() {
    const queryClient = useQueryClient();

    const userQuery = useQuery({
        queryKey: ["auth-user"],
        queryFn: fetchCurrentUser,
        staleTime: 1000 * 60 * 10, // 10 minutos
        retry: false,
    });

    const loginMutation = useMutation({
        mutationFn: async (credentials: { email: string; password: string }) => {
            const data = await loginRequest(credentials);
            const [favorites, cart] = await Promise.all([
                syncLocalFavoritesToServer(),
                syncLocalCartToServer(),
            ]);
            return { ...data, favorites, cart };
        },
        onSuccess: (data) => {
            queryClient.setQueryData(["auth-user"], data.user);
            queryClient.setQueryData(["favorites"], data.favorites);
            queryClient.setQueryData(["cart"], data.cart);
            queryClient.invalidateQueries({ queryKey: ["auth-user"], refetchType: "all" });
            queryClient.invalidateQueries({ queryKey: ["addresses"], refetchType: "all" });
            queryClient.invalidateQueries({ queryKey: ["orders"], refetchType: "all" });
            queryClient.invalidateQueries({ queryKey: ["favorites"], refetchType: "all" });
            queryClient.invalidateQueries({ queryKey: ["cart"], refetchType: "all" });
        },
    });

    const registerMutation = useMutation({
        mutationFn: async (payload: Parameters<typeof registerRequest>[0]) => {
            const data = await registerRequest(payload);
            const [favorites, cart] = await Promise.all([
                syncLocalFavoritesToServer(),
                syncLocalCartToServer(),
            ]);
            return { ...data, favorites, cart };
        },
        onSuccess: (data) => {
            queryClient.setQueryData(["auth-user"], data.user);
            queryClient.setQueryData(["favorites"], data.favorites);
            queryClient.setQueryData(["cart"], data.cart);
            queryClient.invalidateQueries({ queryKey: ["auth-user"], refetchType: "all" });
            queryClient.invalidateQueries({ queryKey: ["addresses"], refetchType: "all" });
            queryClient.invalidateQueries({ queryKey: ["orders"], refetchType: "all" });
            queryClient.invalidateQueries({ queryKey: ["favorites"], refetchType: "all" });
            queryClient.invalidateQueries({ queryKey: ["cart"], refetchType: "all" });
        },
    });

    const updateProfileMutation = useMutation({
        mutationFn: updateProfileRequest,
        onSuccess: (updatedUser) => {
            queryClient.setQueryData(["auth-user"], updatedUser);
            queryClient.invalidateQueries({ queryKey: ["auth-user"] });
        },
    });

    const updateAvatarMutation = useMutation({
        mutationFn: updateAvatarRequest,
        onSuccess: (updatedUser) => {
            queryClient.setQueryData(["auth-user"], updatedUser);
            queryClient.invalidateQueries({ queryKey: ["auth-user"] });
        },
    });

    const deleteAvatarMutation = useMutation({
        mutationFn: deleteAvatarRequest,
        onSuccess: (updatedUser) => {
            queryClient.setQueryData(["auth-user"], updatedUser);
            queryClient.invalidateQueries({ queryKey: ["auth-user"] });
        },
    });

    const changePasswordMutation = useMutation({
        mutationFn: changePasswordRequest,
    });

    const forgotPasswordMutation = useMutation({
        mutationFn: forgotPasswordRequest,
    });

    const resetPasswordMutation = useMutation({
        mutationFn: resetPasswordRequest,
    });

    const logoutMutation = useMutation({
        mutationFn: logoutRequest,
        onSuccess: () => {
            clearStoredFavorites();
            clearStoredCart();
            queryClient.setQueryData(["auth-user"], null);
            queryClient.setQueryData(["addresses"], []);
            queryClient.setQueryData(["orders"], []);
            queryClient.setQueryData(["favorites"], []);
            queryClient.setQueryData(["cart"], []);
            queryClient.invalidateQueries({ queryKey: ["favorites"], refetchType: "all" });
            queryClient.invalidateQueries({ queryKey: ["cart"], refetchType: "all" });
        },
    });

    return {
        user: userQuery.data,
        isAuthenticated: !!userQuery.data,
        isLoadingUser: userQuery.isLoading,
        login: loginMutation.mutateAsync,
        isLoggingIn: loginMutation.isPending,
        register: registerMutation.mutateAsync,
        isRegistering: registerMutation.isPending,
        updateProfile: updateProfileMutation.mutateAsync,
        isUpdatingProfile: updateProfileMutation.isPending,
        updateAvatar: updateAvatarMutation.mutateAsync,
        isUpdatingAvatar: updateAvatarMutation.isPending,
        deleteAvatar: deleteAvatarMutation.mutateAsync,
        isDeletingAvatar: deleteAvatarMutation.isPending,
        changePassword: changePasswordMutation.mutateAsync,
        isChangingPassword: changePasswordMutation.isPending,
        forgotPassword: forgotPasswordMutation.mutateAsync,
        isSendingResetLink: forgotPasswordMutation.isPending,
        resetPassword: resetPasswordMutation.mutateAsync,
        isResettingPassword: resetPasswordMutation.isPending,
        logout: logoutMutation.mutateAsync,
        isLoggingOut: logoutMutation.isPending,
    };
}
