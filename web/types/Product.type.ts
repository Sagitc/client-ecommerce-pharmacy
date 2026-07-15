export type Product = {
    id: number,
    label: string,
    description?: string,
    price: number,
    image?: string,
    category: string,
}

export type ProductCart = Pick<Product, 'id' | 'label' | 'price' | 'image'> & {
    quantity: number,
}