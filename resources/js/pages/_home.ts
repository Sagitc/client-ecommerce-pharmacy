//  Declarations

const catalogBtns = document.querySelectorAll('.catalog__option');


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

        //  Script para filtrar os produtos e mostrar na tela

    }
}