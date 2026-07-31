export type ProductType = {
    id: number,
    label: string,
    fabricator: string,
    description?: string,
    price: number,
    promotionPrice?: number,
    image?: string,
    category: string,
}

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