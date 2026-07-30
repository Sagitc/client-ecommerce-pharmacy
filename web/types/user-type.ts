import { CartType } from "@/types/cart-type"

type UserType = {
    id: number,
    name: string,
    lastName: string,
    avatar: string,
    cart: CartType
}

type UserRegisterType = Pick<UserType, 'id' | 'name' | 'lastName'> & {
    email: string,
    password: string
}

export type { UserType, UserRegisterType };