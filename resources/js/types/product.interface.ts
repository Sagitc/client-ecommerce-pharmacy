export interface Product {
    id: number;
    label: string;
    main_image: URL;
    MS: number;
    SKU: number;
    stock: number;
    EAN: number;
    views_count: number;
    selling_count: number;
    cost: number;
    price: number;
    category: string;
    laboratory: string;
    images: URL[];
    liked?: boolean;
    description?: string;
}

export interface ProductCardProps {
    id: number;
    label: string;
    main_image: URL;
    description?: string;
    price: number;
    laboratory: string;
    liked?: boolean;
}

export interface ProductCartProps {
    id: number;
    label: string;
    price: number;
    quantity: number;
    laboratory: string;
    main_image: URL;
}

export interface ProductDetailProps {

    id: number;
    label: string;
    main_image: URL;
    images: URL[];
    price: number;
    cost: number;
    MS: number;
    SKU: number;
    stock: number;
    EAN: number;
    category: string;
    laboratory: string;
    total_rating: number;
    description: string;
    liked?: boolean;

}

export interface ProductRate {
    id: number;
    user_name: string;
    rating: number;
    comment: string;
    created_at: string;
}

export interface ProductRatesResponse {
    rates: ProductRate[];
    average_rating: number;
    total_rates: number;
}