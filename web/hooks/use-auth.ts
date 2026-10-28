// web/hooks/use-auth.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    fetchCurrentUser,
    loginRequest,
    registerRequest,
    logoutRequest,
} from "@/services/auth-service";

export function useAuth() {
    
    const queryClient = useQueryClient();

    const userQuery = useQuery({
        queryKey: ["auth-user"],
        queryFn: fetchCurrentUser,
        staleTime: 1000 * 60 * 10, // 10 minutos
        retry: false,
    });

    const loginMutation = useMutation({
        mutationFn: loginRequest,
        onSuccess: (data) => {
            queryClient.setQueryData(["auth-user"], data.user);
            queryClient.invalidateQueries({ queryKey: ["addresses"] });
            queryClient.invalidateQueries({ queryKey: ["orders"] });
        },
    });

    const registerMutation = useMutation({
        mutationFn: registerRequest,
        onSuccess: (data) => {
            queryClient.setQueryData(["auth-user"], data.user);
        },
    });

    const logoutMutation = useMutation({
        mutationFn: logoutRequest,
        onSuccess: () => {
            queryClient.setQueryData(["auth-user"], null);
            queryClient.removeQueries({ queryKey: ["addresses"] });
            queryClient.removeQueries({ queryKey: ["orders"] });
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
        logout: logoutMutation.mutateAsync,
    };
}