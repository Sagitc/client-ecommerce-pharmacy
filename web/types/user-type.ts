import { CartType } from "@/types/cart-type";
import { AddressType } from "@/types/address-type";
import { ProductOrderType } from "./product-type";

type UserType = {
    id: number;
    name: string;
    lastName: string;
    fullName?: string;
    role?: "customer" | "pharmacist" | "admin";
    avatar: string;
    cart: CartType;
    gender: "male" | "female" | "other";
    cpf?: string;
    birthDate?: Date;
    orders?: {
        id: number;
        orderNumber?: string;
        date: Date;
        status?: string;
        shippingMethod?: "delivery" | "pickup";
        address: AddressType;
        items: ProductOrderType[];
        paymentMethod: "credit_card" | "pix" | "debit_card" | "cash_on_delivery";
        total: number;
    }[];
    addresses?: AddressType[];
    paymentMethods?: {
        id: number;
        cardNumber: string;
        cardHolder: string;
        expirationDate: string;
        cvv: string;
        isDefault: boolean;
    }[];
    email: string;
    phone?: string;
    favorites?: number[];
};

type UserRegisterType = Pick<UserType, "id" | "name" | "lastName"> & {
    email: string;
    password: string;
};

export type { UserType, UserRegisterType };
