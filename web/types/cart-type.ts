import { ProductType } from "@/types/product-type"

export type CartType = {
    id: number,
    userId?: number,
    sessionId?: string,
    items: CartItemType[] | [],
    updateAt: Date,
}

export type CartItemType = Pick<ProductType, 'id' | 'label' | 'fabricator' | 'price' | 'promotionPrice' | 'image'> & {
    quantity: number,
}