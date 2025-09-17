export function initHeader(): void {
    //  Declarations
    const searchCampBtnMobile = document.querySelector('#header__mobile-search_icon') as HTMLButtonElement;
    const searchCampMobile = document.querySelector('#header__mobile-search') as HTMLDivElement;

    const mobileMenuBtn = document.querySelector('#header__mobile-menu') as HTMLButtonElement;
    const mobileMenu = document.querySelector('#mobile-menu') as HTMLDivElement;

    const mobileLogin = document.querySelector('#mobile-menu__login') as HTMLButtonElement;
    const mobileCart = document.querySelector('#mobile-menu__cart') as HTMLButtonElement;
    const mobileProfile = document.querySelector('#mobile-menu__profile') as HTMLButtonElement;


    //  Events
    searchCampBtnMobile?.addEventListener('click', () => {
        searchCampMobile?.classList.toggle('is-disabled');
    });

    
    //  Functions
    function openCart(): void {
        mobileMenu?.classList.add('is-disabled');
        searchCampMobile?.classList.add('is-disabled');

        
    }
}