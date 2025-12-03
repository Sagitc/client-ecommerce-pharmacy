import axios from 'axios';

export function initHeader(): void {
    //  Declarations
    const header = document.querySelector('.header__content') as HTMLDivElement;
    const userMenuArea = document.querySelector('#header__menu-wrapper') as HTMLDivElement;

    const mobileMenu = document.querySelector('#mobile-menu') as HTMLDivElement;
    const mobileMenuButton = header.querySelector('#header__mobile-menu') as HTMLButtonElement;

    const mobileSearch = document.querySelector('#header__mobile-search') as HTMLDivElement;
    const mobileSearchButton = header.querySelector('#header__mobile-search_icon') as HTMLButtonElement;
    const mobileSearchCloseBtn = document.querySelector('.header__mobile-search_close-btn') as HTMLButtonElement;

    const mobileCart = document.querySelector('#modal__container') as HTMLDivElement;
    const mobileCartButton = header.querySelector('#header__mobile-cart') as HTMLButtonElement;

    const draggableIcon = mobileMenu.querySelector('.dragIcon') as HTMLDivElement;
    const draggableArea = mobileMenu.querySelector('.mobile-menu__wrapper') as HTMLDivElement;

    let isDragging = false;
    let startY: number;
    let deltaY: number;

    const closeThreshold = 100;

    let isLogged: boolean = false;

    //  Events
    mobileMenuButton.addEventListener('click', toggleMobileMenu);

    mobileSearchButton.addEventListener('click', toggleMobileSearch);
    mobileSearchCloseBtn.addEventListener('click', toggleMobileSearch);

    mobileCartButton.addEventListener('click', toggleMobileCart);

    draggableIcon.addEventListener('touchstart', (e: TouchEvent) => {
        isDragging = true;
        startY = e.touches[0]!.clientY;
        mobileMenu.style.transition = 'none';
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
        draggableArea.style.transition = 'transform 0.3s ease';
        if (deltaY > closeThreshold) {
            
            mobileMenu.classList.remove('is-menu-open');
            mobileMenu.style.transform = `translateY(100%)`;
            draggableIcon.style.opacity = '0';
            setTimeout(() => {
                mobileMenu.classList.add('is-disabled');
                mobileMenu.style.transform = 'translateY(0)';

                draggableArea.style.removeProperty('transition');
                mobileMenu.style.removeProperty('transform');
                draggableIcon.style.opacity = '';
            }, 300);
        } else {
            mobileMenu.style.transform = 'translateY(0)';
            setTimeout(() => {
                mobileMenu.style.removeProperty('transform');
                draggableArea.style.removeProperty('transition');
            }, 300);
        }
        deltaY = 0;
    });

    userMenuArea.addEventListener('mouseover', (event: MouseEvent) => {
        document.getElementById('user-menu__area')?.classList.remove('is-disabled');
    });

    userMenuArea.addEventListener('mouseout', (event: MouseEvent) => {
        document.getElementById('user-menu__area')?.classList.add('is-disabled');
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
            mobileMenu.style.removeProperty('transform');
            draggableArea.style.removeProperty('transition');

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    mobileMenu.classList.add('is-menu-open');
                });
            });
        } else {
            mobileMenu.classList.remove('is-menu-open');
            setTimeout(() => {
                mobileMenu.classList.add('is-disabled');
            }, 350);
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