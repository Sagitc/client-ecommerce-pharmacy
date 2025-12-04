import axios from 'axios';
import { openCart, addOnCart } from './_cartModal';
import { addItemToCart } from '../services/cartService';
import { updateCartState } from '@/helpers/cartHandler';

//  Declarations

const buyBtns = document.querySelectorAll('.products__btn-buy');


//  Events

// buyBtns.forEach(btn => {
//     btn.addEventListener('click', event => {
//         event.stopPropagation();
//         event.preventDefault();

//         addOnCart(btn.parentElement?.parentElement as HTMLElement)
//     });
// });


//  Functions

/**
 * 
 * @param byWhat 
 * @param orderBy 
 * @param limit 
 * @param identifier 
 * @param divToAppend 
 * @returns 
 */
/**
 * Busca produtos a partir de diferentes critérios e cria os elementos DOM correspondentes.
 *
 * @remarks
 * - Realiza requisições HTTP via axios para endpoints da API esperados:
 *   - GET /api/product/{id} -> responde com { product }
 *   - GET /api/products/{id}/related?limit=...&orderBy=... -> responde com { products }
 *   - GET /api/products/category/{categoryId}?limit=...&orderBy=... -> responde com { products }
 *   - GET /api/products?limit=...&orderBy=... -> responde com { products }
 * - Após receber os dados, chama createProductElement(products, divToAppend).
 * - Se o parâmetro identifier não for fornecido quando necessário ('id', 'related', 'category'),
 *   a função registra um erro via console.error e retorna sem fazer a requisição.
 * - Erros lançados por axios (ex.: problemas de rede ou resposta HTTP com status de erro)
 *   são propagados para o chamador.
 *
 * @async
 * @param {'id' | 'all' | 'related' | 'category'} byWhat - Critério de busca:
 *   - 'id': busca um produto específico por ID.
 *   - 'related': busca produtos relacionados a um produto (requer identifier).
 *   - 'category': busca produtos de uma categoria (requer identifier).
 *   - 'all': busca produtos gerais (sem filtro específico).
 * @param {'selling' | 'views' | 'price' | null} orderBy - Campo de ordenação opcional aplicado à query; use null para sem ordenação.
 * @param {number} [limit=10] - Limite de itens a retornar quando aplicável.
 * @param {number | null} [identifier=null] - Identificador necessário para os modos 'id', 'related' e 'category'.
 * @param {HTMLElement | null} [divToAppend=null] - Elemento DOM onde os elementos de produto serão anexados. Se null, a função createProductElement deverá tratar o caso.
 *
 * @returns {Promise<void>} Promise que resolve quando a operação de busca e a chamada a createProductElement forem iniciadas.
 *
 * @throws {Error} Propaga erros de requisição (axios).
 *
 * @example
 * // Buscar 8 produtos mais vendidos e anexar no elemento com id "products"
 * await getProducts('all', 'selling', 8, null, document.getElementById('products'));
 *
 * @example
 * // Buscar um produto por ID
 * await getProducts('id', null, 1, 123);
 */
export async function getProducts(
    byWhat: 'id' | 'all' | 'related' | 'category' | 'search',
    orderBy: 'selling' | 'views' | 'price' | string = 'selling',
    limit: number = 10,
    identifier: number | null | string = null,
    divToAppend: HTMLElement | null = null
): Promise<number> {

    let products;

    switch (byWhat) {
        case 'id':

            if (!identifier) {
                console.error('Identifier is required for fetching product by ID.');
                return 0;
            };

            products = (await axios.get(`/api/product/${identifier}`)).data.product;
            break;

        case 'related':

            if (!identifier) {
                console.error('Identifier is required for fetching related products.');
                return 0;
            };

            products = (await axios.get(`/api/product/${identifier}/related?limit=${limit}${orderBy ? `&orderBy=${orderBy}` : ''}`)).data.products;
            break;

        case 'category':

            if (!identifier) {
                console.error('Identifier is required for fetching products by category.');
                return 0;
            }

            products = (await axios.get(`/api/products/category/${identifier}?limit=${limit}${orderBy ? `&orderBy=${orderBy}` : ''}`)).data.products;
            break;

        case 'search':

            if (!identifier) {
                console.error('Identifier is required for fetching products by search.');
                return 0;
            }

            products = (await axios.get(`/api/search?product_name=${identifier}&limit=${limit}${orderBy ? `&orderBy=${orderBy}` : ''}`)).data.products;
            break;

        default:

            products = (await axios.get(`/api/products?limit=${limit}${orderBy ? `&orderBy=${orderBy}` : ''}`)).data.products;
            break;
    }

    createProductElement(products, divToAppend as HTMLElement);

    return products.length;

}

function createProductElement(products: any, divToAppend: HTMLElement) {

    for (let i = 0; i < products.length; i++) {

        let productElement = document.createElement('a');
        productElement.href = `/product/${products[i]?.id}`;
        productElement.classList.add('products__card');
        productElement.setAttribute('data-product-id', products[i]?.id);

        productElement.innerHTML = `
            <button class="products__like">
                <img src="images/icons/icon_fav_outline.svg" aria-pressed="false" alt="Ícone de favoritar">
                <span class="mobile-touch"></span>
            </button>

            <div class="products__image">
                <img src="${products[i]?.image}" alt="Imagem do produto">

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

        divToAppend.appendChild(productElement);

    }


    const modal_buy = document.querySelector('#modal__container') as HTMLElement;

    const favIcons = divToAppend.querySelectorAll('.products__like');
    const addBtns = divToAppend.querySelectorAll('.products__btn-buy');

    favIcons.forEach(icon => {
        icon.addEventListener('click', event => {
            event.stopPropagation();
            event.preventDefault();
            toggleFavIcon(icon)
        });
    });

    addBtns.forEach(btn => {

        btn.addEventListener('click', (event) => {
            event.stopPropagation();
            event.preventDefault();
            addOnCart(parseInt((btn.parentElement?.parentElement?.getAttribute('data-product-id') as string)));
            openCart();
        });


    });
}

function toggleFavIcon(icon: Element) {

    if (icon.classList.contains('active')) {

        icon.setAttribute('aria-pressed', 'false');
        icon.querySelector('img')?.setAttribute('src', '/images/icons/icon_fav_outline.svg');

    } else {

        icon.setAttribute('aria-pressed', 'true');
        icon.querySelector('img')?.setAttribute('src', '/images/icons/icon_fav_filled.svg');

        //  Script para adicionar aos favoritos do perfil

    }
    icon.classList.toggle('active');
}