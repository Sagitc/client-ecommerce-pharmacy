import * as userService from "@/services/userService";
import * as userHandler from "@/handlers/userHandler";
import { getProducts } from "@/components/_products_cards";

//  Declarations

const most_sell_area = document.querySelector('#products__content') as HTMLElement;
const catalog_area   = document.querySelector('#catalog__product-content') as HTMLElement;
const daily_area     = document.querySelector('#daily__content') as HTMLElement;

const catalogBtns = document.querySelectorAll('.catalog__option');

getProducts('all', 'selling', 10, null, most_sell_area);
getProducts('related', 'selling', 10, 1, catalog_area);
getProducts('all', 'selling', 10, null, daily_area);

//  Events

catalogBtns.forEach(btn => {
    btn.addEventListener('click', () => { filterCatalog(btn) });
});


//  Functions

async function loadInitialUser() {
    try {
        const user = await userService.fetchUser();

        if (user && user.id) {
            userHandler.setUser(user);
        } else {
            userHandler.clearUser();
        }
    } catch (error) {
        console.error('Error loading initial user:', error);
        userHandler.clearUser();
    }
}

loadInitialUser();

function filterCatalog(btn: Element) {

    if (btn.classList.contains('active')) {

        return;

    } else {

        document.querySelector('.catalog__option.active')?.classList.remove('active');
        btn.classList.add('active');

    }
}