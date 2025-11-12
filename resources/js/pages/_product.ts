import axios from 'axios';

//  DECLARATIONS

const miniImages = document.querySelectorAll('.product__img-mini') as NodeListOf<HTMLButtonElement>;
const mainImage = document.querySelector('#product__img') as HTMLImageElement;
const favButton = document.querySelector('#products__like') as HTMLButtonElement;
const productId = document.getElementById('product')?.getAttribute('data-id');

//  EVENTS

loadRelatedProducts();

miniImages.forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector('.product__img-mini.active')?.classList.remove('active');
        btn.classList.add('active');

        let img = btn.querySelector('img');

        if (img) {
            updateMainImage(img.src, img.alt);
        }
    });
});

favButton.addEventListener('click', () => {
    toggleFavIcon(favButton)
});

//  FUNCTIONS

function updateMainImage(src: string, alt: string) {
    mainImage.setAttribute('src', src);
    mainImage.setAttribute('alt', alt);
}

function toggleFavIcon(button: Element) {
    if (button.classList.contains('active')) {
        button.setAttribute('aria-pressed', 'false');
        button.querySelector('img')?.setAttribute('src', 'http://localhost:8000/images/icons/icon_fav_outline.svg');

        //  Script para remover dos favoritos do perfil

    } else {
        button.setAttribute('aria-pressed', 'true');
        button.querySelector('img')?.setAttribute('src', 'http://localhost:8000/images/icons/icon_fav_filled.svg');

        //  Script para adicionar aos favoritos do perfil

    }
    button.classList.toggle('active');
}

async function fetchRelatedProducts() {

    try {

        const response = await axios.get(`/api/product/${productId}/related`);

        if (response.data.error === null) {

            let $products = response.data.products;

            console.log($products[0].id);

            return $products;

        }

    } catch (error) {

        console.error('Failed to fetch category products:', error);

    }
}

async function loadRelatedProducts() {

    const product = await fetchRelatedProducts();

    console.log(product[0].image);

    if (!product) return;

    for (let i = 0; i < product.length; i++) {

        const cardProducts = document.createElement('a');
        cardProducts.href = `/product/${product[i].id}`;
        cardProducts.classList.add('products__card');

        // console.log(products[i]?.main_image);

        cardProducts.innerHTML = `
        <button class="products__like">
            <img src="../images/icons/icon_fav_outline.svg" aria-pressed="false" alt="Ícone de favoritar">
            <span class="mobile-touch"></span>
        </button>

        <div class="products__image">
            <img src="${product[i].image}" alt="Imagem do produto">

            <button class="products__btn-buy">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="11" y="4" width="2" height="16" fill="#fff" />
                    <rect x="4" y="11" width="16" height="2" fill="#fff" />
                </svg>
                <span class="mobile-touch"></span>
            </button>
        </div>

        <div class="products__text">
            <h3 class="products__title">${product[i].label}</h3>

            <span class="products__price">R$ ${product[i].price.toFixed(2).replace('.', ',')}</span>
        </div>`

        document.querySelector('#related__content')?.appendChild(cardProducts);
    }

}