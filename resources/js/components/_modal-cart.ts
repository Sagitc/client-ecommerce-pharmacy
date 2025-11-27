import axios from 'axios';

// Declarations

const cartBtn = document.querySelector('#header__cart') as HTMLButtonElement;
const modal = document.querySelector('#modal__container') as HTMLDivElement;
const cartBtnClose = modal.querySelector('.modal__close-btn') as HTMLButtonElement;

const quantitySelect = document.querySelector('#item-card__quantity') as HTMLSelectElement;
const customQuantityInput = document.querySelector('#custom-quantity-input') as HTMLInputElement;

const focusableElements = getFocusableElements(modal) as HTMLElement[];
const firstFocusableElement = focusableElements[0] as HTMLElement;
const lastFocusableElement = focusableElements[focusableElements.length - 1] as HTMLElement;

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

// btnBuy.forEach( (button) => {
//     button.addEventListener('click', () => {
//         const productId = parseInt(button.getAttribute('data-product-id') || '0', 10);
//         if (productId) {
//             addOnCart(productId);
//             openCart();
//         }
//     });
// }

if (!modal.classList.contains('not-logged')) {
    quantitySelect.addEventListener('change', () => {
        if (quantitySelect.value === 'selectQuantity') {
            quantitySelect.classList.add('is-disabled');

            customQuantityInput.classList.remove('is-disabled');
            customQuantityInput.focus();
        }
    });

    customQuantityInput.addEventListener('blur', () => {

        if (customQuantityInput.value === '' || customQuantityInput.value === '0') {
            customQuantityInput.classList.add('is-disabled');
            quantitySelect.classList.remove('is-disabled');

            customQuantityInput.value = '';
            quantitySelect.value = '1';
        }

    });
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

export function closeCart(): void {
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

    axios.post('/api/cart/add', {
        id: product_id,
        user_id: response.id
    })
        .then(response => {
            console.log(response.data.cart);
        })
        .catch(error => {
            console.error('Error adding product to cart:', error);
        });

    updateCartTotal();

}

function removeFromCart() {



    updateCartTotal();

}

function createProductElement() {
    let product = document.createElement('div');
}

function updateCartTotal() {

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
