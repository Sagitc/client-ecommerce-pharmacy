export function initModalCart() {
    // Declarations
    const cartBtn = document.querySelector('#header__cart') as HTMLButtonElement;
    const modalContainer = document.querySelector('#modal__container') as HTMLDivElement;
    const cartBtnClose = modalContainer.querySelector('.modal__close-btn') as HTMLButtonElement;

    const quantitySelect = document.querySelector('#item-card__quantity') as HTMLSelectElement;
    const customQuantityInput = document.querySelector('#custom-quantity-input') as HTMLInputElement;

    const focusableElements = getFocusableElements(modalContainer) as HTMLElement[];
    const firstFocusableElement = focusableElements[0] as HTMLElement;
    const lastFocusableElement = focusableElements[focusableElements.length - 1] as HTMLElement;


    let elementThatOpenedModal: HTMLElement | null = null;

    // Events
    if (cartBtn && modalContainer) {
        cartBtn.addEventListener('click', () => {
            elementThatOpenedModal = document.activeElement as HTMLElement;

            modalContainer.classList.remove('is-disabled');
            modalContainer.classList.add('is-active');
            document.body.style.overflow = 'hidden';

            document.body.setAttribute('aria-hidden', 'true');
            modalContainer.setAttribute('aria-hidden', 'false');

            if (focusableElements.length > 0 && focusableElements[0] !== undefined) {
                focusableElements[0].focus();
            }
        });


    }

    if (cartBtnClose && modalContainer) {
        cartBtnClose.addEventListener('click', () => {
            modalContainer.classList.add('is-disabled');
            document.body.style.overflow = 'auto';

            document.body.removeAttribute('aria-hidden');
            modalContainer.removeAttribute('aria-hidden');

            if (elementThatOpenedModal) {
                elementThatOpenedModal.focus();
                elementThatOpenedModal = null;
            }
        });
    }

    if (modalContainer) {
        modalContainer.addEventListener('click', (event) => {
            if (event.target === modalContainer) {
                modalContainer.classList.remove('is-active');
                modalContainer.classList.add('is-disabled');
            }
        });
    }

    document.addEventListener('keydown', (event) => {
        if (!modalContainer.classList.contains('is-active')) {
            return;
        } else if (event.key === 'Escape') {
            modalContainer.classList.remove('is-active');
            modalContainer.classList.add('is-disabled');
            document.body.style.overflow = 'auto';

            document.body.removeAttribute('aria-hidden');
            modalContainer.removeAttribute('aria-hidden');

            if (elementThatOpenedModal) {
                elementThatOpenedModal.focus();
                elementThatOpenedModal = null;
            }
        }

        if (event.key === 'Tab') {
            if (event.shiftKey && document.activeElement === firstFocusableElement && lastFocusableElement) {
                // Shift + Tab
                event.preventDefault();
                lastFocusableElement.focus();
            } else if (!event.shiftKey && document.activeElement === lastFocusableElement && firstFocusableElement) {
                // Tab
                if (document.activeElement === lastFocusableElement) {
                    event.preventDefault();
                    firstFocusableElement.focus();
                }
            }
        }

    });



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

    // Functions
    function getFocusableElements(container: HTMLElement): HTMLElement[] {
            return Array.from(
                container.querySelectorAll<HTMLElement>(
                    'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled])'
                )
            )
        }
}