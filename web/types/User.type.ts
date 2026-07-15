import { Cart } from "@/types/Cart.type"

type UserRegister = {
    id: number,
    name: string,
    lastName: string,
    email: string,
    password: string,
    avatar: string
}

type User = {
    id: number,
    name: string,
    lastName: string,
    avatar: string,
    cart?: Cart
}

export type { User, UserRegister };