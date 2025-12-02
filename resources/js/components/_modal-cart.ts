import axios from 'axios';

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

// if (!modal.classList.contains('not-logged')) {

//     const quantitySelect = document.querySelector('#item-card__quantity') as HTMLSelectElement;

//     quantitySelect.addEventListener('change', () => {
//         if (quantitySelect.value === 'selectQuantity') {
//             quantitySelect.classList.add('is-disabled');

//             customQuantityInput.classList.remove('is-disabled');
//             customQuantityInput.focus();
//         }
//     });

//     customQuantityInput.addEventListener('blur', () => {

//         if (customQuantityInput.value === '' || customQuantityInput.value === '0') {
//             customQuantityInput.classList.add('is-disabled');
//             quantitySelect.classList.remove('is-disabled');

//             customQuantityInput.value = '';
//             quantitySelect.value = '1';
//         }

//     });
// }


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
        id: product_id,
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

async function removeFromCart(product_id: number) {

    let user = (await axios.get('/user/get')).data.id;

    axios.post('/api/cart/remove', {
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

async function createCartProductElement(productData: any) {

    divToAppend.innerHTML = '';

    for (let i = 0; i < productData.length; i++) {
        let product = document.createElement('div');
        product.classList.add('modal__item-card');
        product.setAttribute('data-product-id', productData[i].id);

        let productContent = `
          <!-- ITEM'S CONTENT -->
          <div class="item-card__details">

            <div class="item-card__image-wrapper">
              <img src="${productData[i].main_image}" class="item-card__image">
            </div>

            <div class="item-card__info">
              <span class="item-card__name">${productData[i].label}</span>
              <span class="item-card__brand">${productData[i].laboratory}</span>
            </div>

            <button aria-label="Remover item" class="item-card__delete-btn">
              <img src="${iconTrash}" alt="Ícone de remover item">
            </button>

          </div>


          <!-- ITEM'S BOTTOM -->
          <div class="item-card__bottom">

            <span class="item-card__price">R$ ${productData[i].price.toFixed(2).replace('.', ',')}</span>

            <select name="item-quantity" id="item-card__quantity">
              <option value="1" selected>1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="selectQuantity">Selecionar quantidade</option>
            </select>

            <input type="number" class="is-disabled" id="custom-quantity-input" min="1" max="99" value="0" aria-label="Quantidade personalizada">

          </div>`;

        product.innerHTML = productContent;

        divToAppend.appendChild(product);
    }

    const removeItemBtns = modal.querySelectorAll('.item-card__details .item-card__delete-btn') as NodeListOf<HTMLButtonElement>;

    removeItemBtns.forEach((button) => {

        button.addEventListener('click', () => {

            const productCard = button?.closest('.modal__item-card') as HTMLDivElement;
            const productId = parseInt(productCard.getAttribute('data-product-id')!);

            removeFromCart(productId);

        });

    });
}

async function getCart() {

    let user = (await axios.get('/user/get')).data.id;

    return await axios.get('/api/cart/get', {

        params: { user_id: user }

    }).then(response => {
        
        createCartProductElement(response.data.cart);
        updateCart(response.data.cart as CartProduct[]);

        return response.data.cart.length;

    }).catch(error => {
        console.error('Error fetching cart data:', error);
    });

}

function updateCart(products: CartProduct[]): void {

    let soma: number = 0;
    let tamanho: number = products.length;

    for (let i = 0; i < products.length; i++) {

        let price: number = products[i]!.price;
        let quantity: number = products[i]!.quantity;

        soma += price * quantity;
    }

    const totalEl = modal.querySelector('.modal__subtotal-value') as HTMLSpanElement;
    const itemsEl = modal.querySelector('.modal__item-count') as HTMLSpanElement;

    totalEl.textContent = `R$ ${soma.toFixed(2).replace('.', ',')}`;
    itemsEl.textContent = `${tamanho} item(s)`;

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

function getFocusableElements(container: HTMLElement): HTMLElement[] {
    return Array.from(
        container.querySelectorAll<HTMLElement>(
            'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled])'
        )
    )
}
