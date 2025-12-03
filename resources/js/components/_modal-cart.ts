import axios from 'axios';
import { getFocusableElements } from '../app';

// Declarations

interface CartProduct {
    id: number;
    label: string;
    price: number;
    quantity: number;
    laboratory: string;
    main_image: string;
}

const cartBtn = document.querySelector('#header__cart') as HTMLButtonElement;
const modal = document.querySelector('#modal__container') as HTMLDivElement;
const cartBtnClose = modal.querySelector('.modal__close-btn') as HTMLButtonElement;

const customQuantityInput = document.querySelector('#custom-quantity-input') as HTMLInputElement;

const focusableElements = getFocusableElements(modal) as HTMLElement[];
const firstFocusableElement = focusableElements[0] as HTMLElement;
const lastFocusableElement = focusableElements[focusableElements.length - 1] as HTMLElement;

const divToAppend = modal.querySelector('#modal__container .modal__body') as HTMLDivElement;
const iconTrash = '/images/icons/icon_trash_black.svg';

let elementThatOpenedModal: HTMLElement | null = null;


// Events

cartBtn.addEventListener('click', () => { openCart(); });
cartBtnClose.addEventListener('click', () => { closeCart(); });

//  Clique fora do modal carrinho
modal.addEventListener('click', (event) => {
    if (event.target === modal) {
        closeCart();
    }
});

if (!modal.classList.contains('not-logged')) {

    let value = await getCart();

    if (value === 0) {
        divToAppend.innerHTML =
            `
            <div class="modal__empty-message">
                <span class="modal__guest-text">Seu carrinho está vazio...<br>vamos mudar isso!</span>
            </div>
        `;
    }

}


// Functions

export function openCart(): void {
    elementThatOpenedModal = document.activeElement as HTMLElement;

    modal.classList.remove('is-disabled');
    document.body.style.overflow = 'hidden';

    document.body.setAttribute('aria-hidden', 'true');
    modal.setAttribute('aria-hidden', 'false');

    modal.addEventListener('keydown', callEventKeydown);

    firstFocusableElement.focus();
}

function closeCart(): void {
    modal.classList.add('is-disabled');
    document.body.style.overflow = 'auto';

    document.body.removeAttribute('aria-hidden');
    modal.removeAttribute('aria-hidden');

    modal.removeEventListener('keydown', callEventKeydown);

    if (elementThatOpenedModal) {
        elementThatOpenedModal.focus();
        elementThatOpenedModal = null;
    }
}

export async function addOnCart(product_id: number) {

    let response = (await axios.get('/user/get')).data;

    await axios.post('/api/cart/add', {
        product_id: product_id,
        user_id: response.id,
        product_quantity: 1
    })
        .then(response => {
            getCart();
        })
        .catch(error => {
            console.error('Error adding product to cart:', error);
        });

}

async function getCart(): Promise<undefined> {

    let user = (await axios.get('/user/get')).data.id;

    return await axios.get('/api/cart/get', {

        params: { user_id: user }

    }).then(response => {

        if (response.data.cart.length === 0) {
            divToAppend.innerHTML =
                `
            <div class="modal__empty-message">
                <span class="modal__guest-text">Seu carrinho está vazio...<br>vamos mudar isso!</span>
            </div>
        `;
            updateCart(response.data.cart as CartProduct[]);
            return;
        }

        createCartProductElement(response.data.cart as CartProduct[]);
        updateCart(response.data.cart as CartProduct[]);

        return response.data.cart.length;

    }).catch(error => {
        console.error('Error fetching cart data:', error);
    });

}

async function getProductRegister(product_id: number): Promise<any> {

    let response = await axios.get(`/api/product/${product_id}`, {
        params: { product_id: product_id }
    });

    return response.data.product;
}

function createCartProductElement(productData: any): void {

    divToAppend.innerHTML = '';

    for (let i = 0; i < productData.length; i++) {
        let product = document.createElement('div');
        product.classList.add('modal__item-card');
        product.setAttribute('data-product-id', productData[i]!.id.toString());

        let productContent = `
          <!-- ITEM'S CONTENT -->
          <div class="item-card__details">

            <div class="item-card__image-wrapper">
              <img src="${productData[i]?.main_image}" class="item-card__image">
            </div>

            <div class="item-card__info">
              <span class="item-card__name">${productData[i]?.label}</span>
              <span class="item-card__brand">${productData[i]?.laboratory}</span>
            </div>

            <button aria-label="Remover item" class="item-card__delete-btn">
              <img src="${iconTrash}" alt="Ícone de remover item">
            </button>

          </div>

          <!-- ITEM'S BOTTOM -->
          <div class="item-card__bottom">

            <span class="item-card__price">R$ ${(productData[i]!.price * productData[i]!.quantity).toFixed(2).replace('.', ',')}</span>

            <input type="number" class="custom-quantity-input" min="1" max="99" value="${productData[i]?.quantity}" aria-label="Quantidade personalizada">

          </div>`;

        product.innerHTML = productContent;

        divToAppend.appendChild(product);
    }

    const removeItemBtns = modal.querySelectorAll('.item-card__details .item-card__delete-btn') as NodeListOf<HTMLButtonElement>;
    const quantityInputs = modal.querySelectorAll('.custom-quantity-input') as NodeListOf<HTMLInputElement>;

    removeItemBtns.forEach((button) => {

        button.addEventListener('click', () => {

            const productCard = button?.closest('.modal__item-card') as HTMLDivElement;
            const productId = parseInt(productCard.getAttribute('data-product-id')!);

            removeFromCart(productId);

        });

    });

    quantityInputs.forEach((input) => {

        input.addEventListener('change', async () => {

            const productCard = input?.closest('.modal__item-card') as HTMLDivElement;
            const productId = parseInt(productCard.getAttribute('data-product-id')!) as number;
            const newQuantity = parseInt(input.value) as number;

            let product = await getProductRegister(productId);

            if (isNaN(newQuantity) || !Number.isInteger(newQuantity)) {
                input.value = '1';
                await updateItem(productId, 1);
                return;
            } else if (newQuantity < 1) {
                await updateItem(productId, 0);
                return;
            } else if (newQuantity >= 1 && newQuantity <= 99) {
                await updateItem(productId, newQuantity);
                return;
            }
        });

    });

}

async function removeFromCart(product_id: number) {

    let user = (await axios.get('/user/get')).data.id;

    axios.post('/api/cart/removeItem', {
        product_id: product_id,
        user_id: user
    })
        .then(response => {
            getCart();
        })
        .catch(error => {
            console.error('Error removing product from cart:', error);
        });

}

async function updateCart(products: CartProduct[]): Promise<void> {

    let soma: number = 0;
    let tamanho: number = products.length;

    let totalEl = modal.querySelector('.modal__subtotal-value') as HTMLSpanElement;
    let itemsEl = modal.querySelector('.modal__item-count') as HTMLSpanElement;

    if (tamanho === 0) {
        totalEl.textContent = `R$ 0,00`;
        itemsEl.textContent = `0 item(s)`;

        modal.querySelector('.modal__checkout-btn')?.setAttribute('disabled', 'true');

        let user = (await axios.get('/user/get')).data.id;

        await axios.post('/api/cart/removeCart', {
            user_id: user

        }).then(response => {
            return;
        }).catch(error => {
            console.error('Error removing cart:', error);
        });

        document.querySelector('#cart__amount')!.textContent = `R$ 0,00`;

        return;
    }

    if (tamanho > 0 && modal.querySelector('.modal__checkout-btn')?.hasAttribute('disabled')) {
        modal.querySelector('.modal__checkout-btn')?.removeAttribute('disabled');
    }

    for (let i = 0; i < products.length; i++) {

        let price: number = products[i]!.price;
        let dbQuantity: number = products[i]!.quantity;

        soma += price * dbQuantity;

        totalEl.textContent = `R$ ${soma.toFixed(2).replace('.', ',')}`;
        itemsEl.textContent = `${tamanho} item(s)`;

    }

    document.querySelector('#cart__amount')!.textContent = `R$ ${soma.toFixed(2).replace('.', ',')}`;

}

async function updateItem(id_product: number, quantity: number): Promise<void> {

    let user = (await axios.get('/user/get')).data.id;

    if (quantity === 0) {
        await removeFromCart(id_product);
        return;
    }

    await axios.post('/api/cart/updateItem', {
        product_id: id_product,
        user_id: user,
        product_quantity: quantity
    })
        .then(response => {
            getCart();
        })
        .catch(error => {
            console.error('Error updating product in cart:', error);
        });

}

function callEventKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
        closeCart();
    } else if (event.key === 'Tab') {
        if (event.shiftKey) {
            // Shift + Tab
            if (document.activeElement === firstFocusableElement) {
                event.preventDefault();
                lastFocusableElement.focus();
            }
        } else {
            // Tab
            if (document.activeElement === lastFocusableElement) {
                event.preventDefault();
                firstFocusableElement.focus();
            }

        }
    }
}