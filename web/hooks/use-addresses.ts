// web/hooks/use-addresses.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    fetchAddressesRequest,
    createAddressRequest,
    updateAddressRequest,
    setDefaultAddressRequest,
    deleteAddressRequest,
    AddressPayload,
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

    const updateAddressMutation = useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: Partial<AddressPayload> }) =>
            updateAddressRequest(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["addresses"] });
            queryClient.invalidateQueries({ queryKey: ["auth-user"] });
        },
    });

    const setDefaultAddressMutation = useMutation({
        mutationFn: setDefaultAddressRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["addresses"] });
            queryClient.invalidateQueries({ queryKey: ["auth-user"] });
        },
    });

    const removeAddressMutation = useMutation({
        mutationFn: deleteAddressRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["addresses"] });
            queryClient.invalidateQueries({ queryKey: ["auth-user"] });
        },
    });

    return {
        addresses: addressesQuery.data ?? [],
        isLoadingAddresses: addressesQuery.isLoading,
        addAddress: addAddressMutation.mutateAsync,
        isAddingAddress: addAddressMutation.isPending,
        updateAddress: updateAddressMutation.mutateAsync,
        isUpdatingAddress: updateAddressMutation.isPending,
        setDefaultAddress: setDefaultAddressMutation.mutateAsync,
        isSettingDefaultAddress: setDefaultAddressMutation.isPending,
        removeAddress: removeAddressMutation.mutateAsync,
        isRemovingAddress: removeAddressMutation.isPending,
    };
}
