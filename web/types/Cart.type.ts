import { ProductCart } from "@/types/Product.type"

export type Cart = {
    id: number,
    userId: number,
    items: ProductCart[]
}