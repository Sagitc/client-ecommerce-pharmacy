export function initModalCart(): void {
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
    cartBtn.addEventListener('click', () => { openModal(); });

    cartBtnClose.addEventListener('click', () => { closeModal(); });

    //  Clique fora do modal carrinho
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

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
    function openModal(): void {
        elementThatOpenedModal = document.activeElement as HTMLElement;

        modal.classList.remove('is-disabled');
        document.body.style.overflow = 'hidden';

        document.body.setAttribute('aria-hidden', 'true');
        modal.setAttribute('aria-hidden', 'false');

        modal.addEventListener('keydown', callEventKeydown);

        firstFocusableElement.focus();
    }

    function closeModal(): void {
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

    function callEventKeydown(event: KeyboardEvent): void {
        if (event.key === 'Escape') {
            closeModal();
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
}