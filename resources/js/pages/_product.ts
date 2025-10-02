//  DECLARATIONS

const miniImages = document.querySelectorAll('.product__img-mini') as NodeListOf<HTMLButtonElement>;
const mainImage = document.querySelector('#product__img') as HTMLImageElement;
const favButton = document.querySelector('#products__like') as HTMLButtonElement;


//  EVENTS

miniImages.forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector('.product__img-mini.active')?.classList.remove('active');
        btn.classList.add('active');

        let img = btn.querySelector('img');

        if (img) {
            updateMainImage(img.src, img.alt);
        }
    });
});

favButton.addEventListener('click', () => {
        toggleFavIcon(favButton)
});

//  FUNCTIONS

function updateMainImage(src: string, alt: string) {
    mainImage.setAttribute('src', src);
    mainImage.setAttribute('alt', alt);
}

function toggleFavIcon(button: Element) {
    if (button.classList.contains('active')) {
        button.setAttribute('aria-pressed', 'false');
        button.querySelector('img')?.setAttribute('src', 'http://localhost:8000/images/icons/icon_fav_outline.svg');

        //  Script para remover dos favoritos do perfil

    } else {
        button.setAttribute('aria-pressed', 'true');
        button.querySelector('img')?.setAttribute('src', 'http://localhost:8000/images/icons/icon_fav_filled.svg');

        //  Script para adicionar aos favoritos do perfil

    }
    button.classList.toggle('active');
}