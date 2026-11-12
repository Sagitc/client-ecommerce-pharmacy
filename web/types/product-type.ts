export type ProductImageType = {
    id: number;
    product_id?: number;
    url: string;
    sort_order?: number;
};

export type ProductType = {
    id: number;
    sku?: string;
    ean?: string;
    label: string;
    fabricator: string;
    dosage?: string;
    activeIngredient?: string;
    description?: string;
    price: number;
    promotionPrice?: number;
    image?: string;
    category: string;
    stripeType?: "free" | "red" | "red_retained";
    requiresPrescription?: boolean;
    inStock?: boolean;
    stockQuantity?: number;
    salesCount?: number;
    images?: ProductImageType[];
};

export type ProductOrderType = Pick<ProductType, 'id' | 'label' | 'fabricator' | 'image' | 'price' | 'promotionPrice' | 'requiresPrescription'> & {
    quantity: number;
};

export const ProductFilters = [
    { label: "Mais vendidos", value: "most-sell" },
    { label: "Para você", value: "for-you" },
    { label: "Dermocosméticos", value: "dermocosmetics" },
    { label: "Laboratório", value: "laboratory" },
    { label: "Novidades", value: "news" },
    { label: "Vitaminas e suplementos", value: "suplement" },
    { label: "Anticoncepcionais", value: "contraceptive" },
    { label: "Higiene pessoal", value: "hygiene" },
    { label: "Infantil", value: "infantile" },
    { label: "Produtos capilares", value: "hair-care" },
    { label: "Cuidados no inverno", value: "winter-care" },
    { label: "Protetores solares", value: "sunscreen" },
    { label: "Diabétes", value: "diabetes" },
    { label: "Lançamentos", value: "release" }
] as const;
