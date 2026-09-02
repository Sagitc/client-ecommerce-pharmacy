import { ProductOrderType } from "@/types/product-type";
import { UserType } from "@/types/user-type";

export type OrderType = {
    id: string;
    date: string;
    receiver: Pick<UserType, 'name' | 'lastName' | 'email' | 'phone'>;
    address: NonNullable<UserType['addresses']>[number];
    paymentMethod: "credit_card" | "pix" | "boleto";
    total: string;
    status: "pending" | "processing" | "shipped" | "delivered" | "canceled";
    items: ProductOrderType[];
    nfe?: {
        key: string;
        url: string;
    };
}