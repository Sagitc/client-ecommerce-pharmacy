import { CartType } from "@/types/cart-type"
import { AddressType } from "@/types/address-type"
import { ProductOrderType } from "./product-type"

type UserType = {
    id: number,
    name: string,
    lastName: string,
    avatar: string,
    cart: CartType,
    gender: "male" | "female" | "other"
    cpf?: string,
    birthDate?: Date,
    orders?: {
        id: number,
        date: Date,
        address: AddressType,
        items: ProductOrderType[],
        paymentMethod: "credit_card" | "pix" | "debit_card",
        total: number
    }[],
    addresses?: AddressType[],
    paymentMethods?: {
        id: number,
        cardNumber: string,
        cardHolder: string,
        expirationDate: string,
        cvv: string,
        isDefault: boolean
    }[],
    email: string,
    phone?: string,
    favorites?: number[],
}

type UserRegisterType = Pick<UserType, 'id' | 'name' | 'lastName'> & {
    email: string,
    password: string
}

export type { UserType, UserRegisterType };