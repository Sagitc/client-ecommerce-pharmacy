//  Declarations

const favIcons = document.querySelectorAll('.products__like');
const buyBtns = document.querySelectorAll('.products__btn-buy');


//  Events

favIcons.forEach(icon => {
    icon.addEventListener('click', event => {
        event.stopPropagation();
        event.preventDefault();
        toggleFavIcon(icon)
    });
});

buyBtns.forEach(btn => {
    btn.addEventListener('click', event => {
        event.stopPropagation();
        event.preventDefault();

        addOnCart(btn.parentElement?.parentElement as HTMLElement)
    });
});


//  Functions

function toggleFavIcon(icon: Element) {
    if (icon.classList.contains('active')) {
        icon.setAttribute('aria-pressed', 'false');
        icon.querySelector('img')?.setAttribute('src', 'http://localhost:8000/images/icons/icon_fav_outline.svg');

        //  Script para remover dos favoritos do perfil

    } else {
        icon.setAttribute('aria-pressed', 'true');
        icon.querySelector('img')?.setAttribute('src', 'http://localhost:8000/images/icons/icon_fav_filled.svg');

        //  Script para adicionar aos favoritos do perfil

    }
    icon.classList.toggle('active');
}

function addOnCart(item: HTMLElement | undefined) {
    // if (!item) return;

    // const cart = document.querySelector('.cart') as HTMLElement;
    // const itemClone = item.cloneNode(true) as HTMLElement;
    // cart.appendChild(itemClone);
}