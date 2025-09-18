export function initHeader(): void {
    //  Declarations
    const header = document.querySelector('.header__content') as HTMLDivElement;

    const mobileMenu = document.querySelector('#mobile-menu') as HTMLDivElement
    const mobileMenuButton = header.querySelector('#header__mobile-menu') as HTMLButtonElement
    const mobileMenuCloseBtn = mobileMenu.querySelector('.mobile-menu__wrapper .modal__close-btn') as HTMLButtonElement

    const mobileSearch = document.querySelector('#header__mobile-search') as HTMLDivElement
    const mobileSearchButton = header.querySelector('#header__mobile-search_icon') as HTMLButtonElement
    const mobileSearchCloseBtn = document.querySelector('.header__mobile-search_close-btn') as HTMLButtonElement

    const mobileCart = document.querySelector('#modal__container') as HTMLDivElement;
    const mobileCartButton = header.querySelector('#header__mobile-cart') as HTMLButtonElement;

    //  Events
    mobileMenuButton.addEventListener('click', toggleMobileMenu);
    mobileMenuCloseBtn.addEventListener('click', toggleMobileMenu);

    mobileSearchButton.addEventListener('click', toggleMobileSearch);
    mobileSearchCloseBtn.addEventListener('click', toggleMobileSearch);

    mobileCartButton.addEventListener('click', toggleMobileCart);

    
    //  Functions
    function toggleMobileMenu(): void {

        //  Make login verification to show different menu options

        if (mobileMenu.classList.contains('is-disabled')) {
            mobileMenu.classList.remove('is-disabled');
        } else {
            mobileMenu.classList.add('is-disabled');
        }
    }

    function toggleMobileSearch(): void {
        if (mobileSearch.classList.contains('is-disabled')) {
            mobileSearch.classList.remove('is-disabled');
        } else {
            mobileSearch.classList.add('is-disabled');
        }
    }

    function toggleMobileCart(): void {
        if (mobileCart.classList.contains('is-disabled')) {
            mobileCart.classList.remove('is-disabled');
        } else {
            mobileCart.classList.add('is-disabled');
        }
    }
}