import axios from 'axios';

//  Declarations

const favIcons = document.querySelectorAll('.products__like');
const buyBtns = document.querySelectorAll('.products__btn-buy');

// Normalized product shape for the frontend
export interface Product {
    id: number;
    label: string;        // from API 'name'
    main_image: string;   // from API 'image'
    SKU: number | null;
    stock: number;
    EAN: number;
    sales_count: number;
    views_count: number;
    cost: number;
    price: number;
    liked: boolean;
    category: string | null;
    laboratory: string | null;
}

// Raw shape returned by the API (ProductController@getAllProducts)
type RawProduct = {
    id: number;
    name: string;
    SKU: number | null;
    stock: number;
    EAN: number;
    views_count: number;
    sales_count: number;
    cost: number;
    price: number;
    category: string | null;
    laboratory: string | null;
    image: string | null;
    liked: boolean | number;
};

type ApiResponse = {
    error: string | null;
    products: RawProduct[];
}

//  Events

favIcons.forEach(icon => {
    icon.addEventListener('click', event => {
        event.stopPropagation();
        event.preventDefault();
        toggleFavIcon(icon)
    });
});

buyBtns.forEach(btn => {
    btn.addEventListener('click', event => {
        event.stopPropagation();
        event.preventDefault();

        addOnCart(btn.parentElement?.parentElement as HTMLElement)
    });
});

loadProducts();


//  Functions

// Map RawProduct -> Product
function mapApiProduct(raw: RawProduct): Product {
    return {
        id: raw.id,
        label: raw.name,
        main_image: raw.image ?? '/images/products/default_generic.jpg',
        SKU: raw.SKU ?? null,
        stock: raw.stock,
        EAN: raw.EAN,
        sales_count: raw.sales_count,
        views_count: raw.views_count,
        cost: raw.cost,
        price: raw.price,
        liked: Boolean(raw.liked),
        category: raw.category ?? null,
        laboratory: raw.laboratory ?? null,
    };
}

export async function fetchProducts(): Promise<Product[]> {
    try {
        // Use a relative URL and a valid orderBy value accepted by the API (views | selling | price)
        const response = await axios.get<ApiResponse>('/api/products?orderBy=selling');

        if (response.data.error === null) {
            return (response.data.products || []).map(mapApiProduct);
        }

        console.error('API responded with an error: ', response.data.error);
        return [];

    } catch (error) {

        console.error('Failed to fetch products:', error);
        return [];

    }
}

async function loadProducts() {
    const products = await fetchProducts();
}

function toggleFavIcon(icon: Element) {
    if (icon.classList.contains('active')) {
        icon.setAttribute('aria-pressed', 'false');
        icon.querySelector('img')?.setAttribute('src', '/images/icons/icon_fav_outline.svg');

        //  Script para remover dos favoritos do perfil

    } else {
        icon.setAttribute('aria-pressed', 'true');
        icon.querySelector('img')?.setAttribute('src', '/images/icons/icon_fav_filled.svg');

        //  Script para adicionar aos favoritos do perfil

    }
    icon.classList.toggle('active');
}

function addOnCart(item: HTMLElement | undefined) {
    // if (!item) return;

    // const cart = document.querySelector('.cart') as HTMLElement;
    // const itemClone = item.cloneNode(true) as HTMLElement;
    // cart.appendChild(itemClone);
}