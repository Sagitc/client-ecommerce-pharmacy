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

function filterCatalog(btn: Element) {

    if (btn.classList.contains('active')) {

        return;

    } else {

        document.querySelector('.catalog__option.active')?.classList.remove('active');
        btn.classList.add('active');

    }
}