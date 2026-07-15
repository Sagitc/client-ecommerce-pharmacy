export type Product = {
    id: number,
    label: string,
    fabricator: string,
    description?: string,
    price: number,
    image?: string,
    category: string,
}

export type ProductCart = Pick<Product, 'id' | 'label' | 'fabricator' | 'price' | 'image'> & {
    quantity: number,
}