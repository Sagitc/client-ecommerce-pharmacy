export function initHeader(): void {
    //  Declarations
    const header = document.querySelector('.header__content') as HTMLDivElement;

    const mobileMenu = document.querySelector('#mobile-menu') as HTMLDivElement;
    const mobileMenuButton = header.querySelector('#header__mobile-menu') as HTMLButtonElement;

    const mobileSearch = document.querySelector('#header__mobile-search') as HTMLDivElement;
    const mobileSearchButton = header.querySelector('#header__mobile-search_icon') as HTMLButtonElement;
    const mobileSearchCloseBtn = document.querySelector('.header__mobile-search_close-btn') as HTMLButtonElement;

    const mobileCart = document.querySelector('#modal__container') as HTMLDivElement;
    const mobileCartButton = header.querySelector('#header__mobile-cart') as HTMLButtonElement;

    const draggableIcon = mobileMenu.querySelector('.dragIcon') as HTMLDivElement;

    let isDragging = false;
    let startY: number;
    let deltaY: number;

    const closeThreshold = 100;

    let isLogged = false;

    //  Events
    mobileMenuButton.addEventListener('click', toggleMobileMenu);

    mobileSearchButton.addEventListener('click', toggleMobileSearch);
    mobileSearchCloseBtn.addEventListener('click', toggleMobileSearch);

    mobileCartButton.addEventListener('click', toggleMobileCart);

    draggableIcon.addEventListener('touchstart', (e: TouchEvent) => {
        isDragging = true;
        startY = e.touches[0]!.clientY;
        mobileMenu.style.transition = 'none';
        console.log('start', startY);
    });

    draggableIcon.addEventListener('touchmove', (e: TouchEvent) => {
        if (!isDragging) return;
        deltaY = e.touches[0]!.clientY - startY;
        if (deltaY > 0) {
            mobileMenu.style.transform = `translateY(${deltaY}px)`;
        }
    });

    draggableIcon.addEventListener('touchend', () => {
        isDragging = false;
        mobileMenu.style.transition = 'transform 0.3s ease';
        if (deltaY > closeThreshold) {
            mobileMenu.style.transform = `translateY(100%)`;
            setTimeout(() => {
                mobileMenu.classList.add('is-disabled');
                mobileMenu.style.transform = 'translateY(0)';
            }, 300);
        } else {
            mobileMenu.style.transform = 'translateY(0)';
        }
    });

    //  Functions
    function toggleMobileMenu(): void {

        if (!isLogged) {
            document.querySelector('.mobile-menu__nav')?.classList.add('is-disabled');
        } else {
            document.querySelector('.menu-mobile__login-wrapper')?.classList.add('is-disabled');
        }

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