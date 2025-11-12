import axios from 'axios';

//  Declarations

mostSellProducts();
catalogProducts();
dailyProducts();

const buyBtns = document.querySelectorAll('.products__btn-buy');

let products: Product[] = [];

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

buyBtns.forEach(btn => {
    btn.addEventListener('click', event => {
        event.stopPropagation();
        event.preventDefault();

        addOnCart(btn.parentElement?.parentElement as HTMLElement)
    });
});


//  Functions

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

export async function fetchProducts(orderBy: 'selling' | 'views' | 'price' | null): Promise<Product[]> {

    try {

        let url: string;

        if (!orderBy) {
            url = `/api/products`;
        } else {
            url = `/api/products?orderBy=${orderBy}`;
        }

        const response = await axios.get<ApiResponse>(url);

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

async function mostSellProducts() {

    const products = await fetchProducts('selling');

    for (let i = 0; i < products.length; i++) {
        const cardProducts = document.createElement('a');
        cardProducts.href = `/product/${products[i]?.id}`;
        cardProducts.classList.add('products__card');

        // console.log(products[i]?.main_image);

        cardProducts.innerHTML = `
        <button class="products__like">
            <img src="images/icons/icon_fav_outline.svg" aria-pressed="false" alt="Ícone de favoritar">
            <span class="mobile-touch"></span>
        </button>

        <div class="products__image">
            <img src="${products[i]?.main_image}" alt="Imagem do produto">

            <button class="products__btn-buy">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="11" y="4" width="2" height="16" fill="#fff" />
                    <rect x="4" y="11" width="16" height="2" fill="#fff" />
                </svg>
                <span class="mobile-touch"></span>
            </button>
        </div>

        <div class="products__text">
            <h3 class="products__title">${products[i]?.label}</h3>

            <span class="products__price">R$ ${products[i]?.price.toFixed(2).replace('.', ',')}</span>
        </div>`
        
        document.querySelector('#products__content')?.appendChild(cardProducts);
    }

    const favIcons = document.querySelectorAll('.products__like');


    favIcons.forEach(icon => {
        icon.addEventListener('click', event => {
            event.stopPropagation();
            event.preventDefault();
            toggleFavIcon(icon)
        });
    });

}

async function catalogProducts() {
    
    const products = await fetchProducts(null);

    for (let i = 0; i < products.length; i++) {
        const cardProducts = document.createElement('a');
        cardProducts.href = `/product/${products[i]?.id}`;
        cardProducts.classList.add('products__card');

        cardProducts.innerHTML = `
        <button class="products__like">
            <img src="images/icons/icon_fav_outline.svg" aria-pressed="false" alt="Ícone de favoritar">
            <span class="mobile-touch"></span>
        </button>

        <div class="products__image">
            <img src="${products[i]?.main_image}" alt="Imagem do produto">

            <button class="products__btn-buy">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="11" y="4" width="2" height="16" fill="#fff" />
                    <rect x="4" y="11" width="16" height="2" fill="#fff" />
                </svg>
                <span class="mobile-touch"></span>
            </button>
        </div>

        <div class="products__text">
            <h3 class="products__title">${products[i]?.label}</h3>

            <span class="products__price">R$ ${products[i]?.price.toFixed(2).replace('.', ',')}</span>
        </div>`
        
        document.querySelector('#daily__content')?.appendChild(cardProducts);
        document.querySelector('#catalog .catalog__area .catalog__product-content')?.appendChild(cardProducts);
    }

    const favIcons = document.querySelectorAll('.products__like');


    favIcons.forEach(icon => {
        icon.addEventListener('click', event => {
            event.stopPropagation();
            event.preventDefault();
            toggleFavIcon(icon)
        });
    });

}

async function dailyProducts() {
    
    const products = await fetchProducts(null);

    for (let i = 0; i < products.length; i++) {
        const cardProducts = document.createElement('a');
        cardProducts.href = `/product/${products[i]?.id}`;
        cardProducts.classList.add('products__card');

        cardProducts.innerHTML = `
        <button class="products__like">
            <img src="images/icons/icon_fav_outline.svg" aria-pressed="false" alt="Ícone de favoritar">
            <span class="mobile-touch"></span>
        </button>

        <div class="products__image">
            <img src="${products[i]?.main_image}" alt="Imagem do produto">

            <button class="products__btn-buy">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="11" y="4" width="2" height="16" fill="#fff" />
                    <rect x="4" y="11" width="16" height="2" fill="#fff" />
                </svg>
                <span class="mobile-touch"></span>
            </button>
        </div>

        <div class="products__text">
            <h3 class="products__title">${products[i]?.label}</h3>

            <span class="products__price">R$ ${products[i]?.price.toFixed(2).replace('.', ',')}</span>
        </div>`
        
        document.querySelector('#daily__content')?.appendChild(cardProducts);
    }

    const favIcons = document.querySelectorAll('.products__like');


    favIcons.forEach(icon => {
        icon.addEventListener('click', event => {
            event.stopPropagation();
            event.preventDefault();
            toggleFavIcon(icon)
        });
    });

}

function addOnCart(item: HTMLElement | undefined) {
    // if (!item) return;

    // const cart = document.querySelector('.cart') as HTMLElement;
    // const itemClone = item.cloneNode(true) as HTMLElement;
    // cart.appendChild(itemClone);
}