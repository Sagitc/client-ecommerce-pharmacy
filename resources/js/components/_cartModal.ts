import axios from 'axios';
import { createFocusTrapHandler, getFocusableElements } from '@/helpers/focusTrapHandler';
import * as cartHandler from '@/helpers/cartHandler';
import * as cartService from '@/services/cartService';

// Declarations

const cartBtn = document.querySelector('#header__cart') as HTMLButtonElement;
const modal = document.querySelector('#modal__container') as HTMLDivElement;
const cartBtnClose = modal.querySelector('.modal__close-btn') as HTMLButtonElement;

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

// --- RE-DISPLAY CART ---

function renderCartModal(): void {
    const products = cartHandler.getCartItems();
    const itemCount = cartHandler.getItemCount();
    const totalPrice = cartHandler.calculateTotal();

    if (itemCount === 0) {
        divToAppend.innerHTML =
            `
            <div class="modal__empty-message">
                <span class="modal__guest-text">Seu carrinho está vazio...<br>vamos mudar isso!</span>
            </div>
            `;

    } else {
        createCartProductElement(products);
    }

    (modal.querySelector('.modal__subtotal-value') as HTMLSpanElement).textContent = `R$ ${totalPrice.toFixed(2).replace('.', ',')}`;
    (modal.querySelector('.modal__item-count') as HTMLSpanElement).textContent = `${itemCount} item(s)`;
}

cartHandler.subscribe(renderCartModal);

export async function addOnCart(product_id: number): Promise<void> {

    try {
        const updatedItems = await cartService.addItemToCart(product_id);
        cartHandler.updateCartState(updatedItems);
    } catch (error) {
        console.error('Error adding product to cart:', error);
    }

}

async function loadInitialCart(): Promise<void> {
    
    try {
        const initialItems = await cartService.fetchCart();
        cartHandler.updateCartState(initialItems);
    } catch (error) {
        console.error('Error loading initial cart data:', error);
    }   
}

loadInitialCart();

// --- MODAL LOGIC ---

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

        button.addEventListener('click', async () => {

            const productCard = button?.closest('.modal__item-card') as HTMLDivElement;
            const productId = parseInt(productCard.getAttribute('data-product-id')!);

            const updatedItems = await cartService.removeItemFromCart(productId);
            cartHandler.updateCartState(updatedItems);

        });

    });

    quantityInputs.forEach((input) => {

        input.addEventListener('change', async () => {

            const productCard = input?.closest('.modal__item-card') as HTMLDivElement;
            const productId = parseInt(productCard.getAttribute('data-product-id')!) as number;
            const newQuantity = parseInt(input.value) as number;

            if (isNaN(newQuantity) || !Number.isInteger(newQuantity)) {

                input.value = '1';
                let updatedItems = await cartService.updateCartItemQuantity(productId, 1);
                cartHandler.updateCartState(updatedItems);
                return;

            } else if (newQuantity < 1) {

                let updatedItems = await cartService.removeItemFromCart(productId);
                cartHandler.updateCartState(updatedItems);
                return;

            } else if (newQuantity >= 1 && newQuantity <= 99) {

                let updatedItems = await cartService.updateCartItemQuantity(productId, newQuantity);
                cartHandler.updateCartState(updatedItems);
                return;

            }
        });

    });

}

export function openCart(): void {

    elementThatOpenedModal = document.activeElement as HTMLElement;

    modal.classList.remove('is-disabled');
    document.body.style.overflow = 'hidden';

    document.body.setAttribute('aria-hidden', 'true');
    modal.setAttribute('aria-hidden', 'false');

    const focusTrapHandler = createFocusTrapHandler(modal);

    (modal as any).focusTrapHandlerRef = focusTrapHandler;
    modal.addEventListener('keydown', focusTrapHandler);

    let focusableEls = getFocusableElements(modal);
    focusableEls[0]?.focus();

}

export function closeCart(): void {

    modal.classList.add('is-disabled');
    document.body.style.overflow = 'auto';

    document.body.removeAttribute('aria-hidden');
    modal.removeAttribute('aria-hidden');

    const focusTrapHandler = (modal as any).focusTrapHandlerRef;

    if (focusTrapHandler) {
        modal.removeEventListener('keydown', focusTrapHandler);
        delete (modal as any).focusTrapHandlerRef;
    }

    if (elementThatOpenedModal) {
        elementThatOpenedModal.focus();
        elementThatOpenedModal = null;
    }
}