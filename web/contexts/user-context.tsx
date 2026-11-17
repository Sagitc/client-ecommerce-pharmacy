"use client";

import {
    createContext,
    ReactNode,
    useContext,
    useMemo,
} from "react";
import { UserType } from "@/types/user-type";
import { useAuth } from "@/hooks/use-auth";
import { useOrders } from "@/hooks/use-orders";
import { useAddresses } from "@/hooks/use-addresses";
import { useFavorites } from "@/hooks/use-favorites";
import { useCart } from "@/hooks/use-cart";

type UserContextType = {
    user: UserType | null;
    setUser: (user: UserType | null) => void;
    isLoading: boolean;
    isAuthenticated: boolean;
    logout: () => Promise<void>;
};

const UserCtx = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const { user: apiUser, isLoadingUser, isAuthenticated, logout } = useAuth();
    const { orders: apiOrders } = useOrders();
    const { addresses: apiAddresses } = useAddresses();
    const { favoriteIds } = useFavorites();
    const { cart } = useCart();

    const mappedUser = useMemo<UserType | null>(() => {
        if (!apiUser) return null;

        const fullName = String(apiUser.name || "").trim();
        const nameParts = fullName.split(/\s+/);
        const firstName = nameParts[0] || "";
        const lastName = nameParts.slice(1).join(" ");

        const rawAddresses = Array.isArray(apiAddresses) && apiAddresses.length > 0
            ? apiAddresses
            : Array.isArray(apiUser.addresses)
                ? apiUser.addresses
                : [];

        const mappedAddresses = rawAddresses.map((addr: any) => ({
            id: Number(addr.id),
            label: addr.label || "Casa",
            receiver: fullName || addr.label || "Cliente",
            street: addr.street || "",
            number: addr.number || "",
            complement: addr.complement || undefined,
            neighborhood: addr.neighborhood || "",
            city: addr.city || "",
            state: addr.state || "RJ",
            zipCode: addr.cep || addr.zipCode || "",
            cep: addr.cep || addr.zipCode || "",
            isDefault: Boolean(addr.is_default ?? addr.isDefault),
            is_default: Boolean(addr.is_default ?? addr.isDefault),
        }));

        const mappedOrders = (Array.isArray(apiOrders) ? apiOrders : []).map((ord: any) => ({
            id: Number(ord.id),
            orderNumber: ord.order_number || String(ord.id),
            date: ord.created_at ? new Date(ord.created_at) : new Date(),
            status: ord.status || "pending",
            shippingMethod: ord.shipping_method || "delivery",
            address: ord.address
                ? {
                    id: Number(ord.address.id),
                    receiver: fullName,
                    street: ord.address.street || "",
                    number: ord.address.number || "",
                    complement: ord.address.complement || undefined,
                    neighborhood: ord.address.neighborhood || "",
                    city: ord.address.city || "",
                    state: ord.address.state || "RJ",
                    zipCode: ord.address.cep || "",
                    isDefault: Boolean(ord.address.is_default),
                }
                : mappedAddresses[0] || {
                    id: 0,
                    receiver: fullName,
                    street: ord.pharmacy_unit?.name || "Retirada na loja",
                    number: "",
                    neighborhood: "",
                    city: "Rio de Janeiro",
                    state: "RJ",
                    zipCode: "",
                    isDefault: false,
                },
            items: (Array.isArray(ord.items) ? ord.items : []).map((item: any) => ({
                id: Number(item.product_id || item.id),
                label: item.product?.label || item.label || `Produto #${item.product_id}`,
                fabricator: item.product?.fabricator || "",
                image: item.product?.image || undefined,
                price: Number(item.unit_price ?? item.price ?? 0),
                quantity: Number(item.quantity ?? 1),
            })),
            paymentMethod: ord.payment_method || "pix",
            total: Number(ord.total ?? 0),
        }));

        return {
            id: Number(apiUser.id),
            name: firstName,
            lastName: lastName,
            fullName: fullName,
            role: apiUser.role || "customer",
            avatar: apiUser.avatar_url || apiUser.avatar || "",
            cart: { id: 0, userId: Number(apiUser.id), items: cart.data || [], updateAt: new Date() },
            gender: (apiUser.gender as any) || "other",
            cpf: apiUser.cpf || "",
            birthDate: apiUser.birth_date ? new Date(apiUser.birth_date + "T12:00:00") : undefined,
            orders: mappedOrders,
            addresses: mappedAddresses,
            paymentMethods: [],
            email: apiUser.email || "",
            phone: apiUser.phone || "",
            favorites: favoriteIds.data || apiUser.favorite_ids || [],
        };
    }, [apiUser, apiOrders, apiAddresses, favoriteIds.data, cart.data]);

    return (
        <UserCtx.Provider
            value={{
                user: mappedUser,
                setUser: () => {},
                isLoading: isLoadingUser,
                isAuthenticated,
                logout,
            }}
        >
            {children}
        </UserCtx.Provider>
    );
};

export const useUser = () => useContext(UserCtx);
