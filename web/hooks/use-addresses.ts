// web/hooks/use-addresses.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    fetchAddressesRequest,
    createAddressRequest,
    deleteAddressRequest,
} from "@/services/address-service";

export function useAddresses() {
    const queryClient = useQueryClient();

    const addressesQuery = useQuery({
        queryKey: ["addresses"],
        queryFn: fetchAddressesRequest,
    });

    const addAddressMutation = useMutation({
        mutationFn: createAddressRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["addresses"] });
            queryClient.invalidateQueries({ queryKey: ["auth-user"] });
        },
    });

    const removeAddressMutation = useMutation({
        mutationFn: deleteAddressRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["addresses"] });
        },
    });

    return {
        addresses: addressesQuery.data ?? [],
        isLoadingAddresses: addressesQuery.isLoading,
        addAddress: addAddressMutation.mutateAsync,
        isAddingAddress: addAddressMutation.isPending,
        removeAddress: removeAddressMutation.mutateAsync,
    };
}