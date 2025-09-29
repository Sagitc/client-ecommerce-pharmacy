//  Declarations

const collapseBtn = document.querySelectorAll('.result__heading-btn') as NodeListOf<HTMLButtonElement>;
const pageBtn = document.querySelectorAll('.result__nav-page') as NodeListOf<HTMLButtonElement>;
const navBtns = document.querySelectorAll('.result__nav-btn') as NodeListOf<HTMLButtonElement>;
const currentPageElement = document.querySelector('.result__nav-page.active') as HTMLButtonElement;
let currentPage = currentPageElement ? parseInt(currentPageElement.textContent) : 1;
const totalPages: number = pageBtn.length;


//  Events

collapseBtn.forEach(btn => {
    btn.addEventListener('click', () => { toggleContent(btn) });
});

pageBtn.forEach(btn => {
    btn.addEventListener('click', () => { changePage(btn) });
});

navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        if (btn.id === 'nav__prev') {
            if (currentPage > 1) {
                let futurePage = document.querySelector('.result__nav-page.active')?.previousElementSibling as HTMLButtonElement;

                if (futurePage) {
                    changePage(futurePage);
                }
            }
        } else if (btn.id === 'nav__next') {
            if (currentPage < totalPages) {
                let futurePage = document.querySelector('.result__nav-page.active')?.nextElementSibling as HTMLButtonElement;
                
                if (futurePage) {
                    changePage(futurePage);
                }
            }
        }
    });
});


//  Functions

function toggleContent(btn: HTMLButtonElement) {
    let content = btn.parentElement?.parentElement?.querySelector('div[id$="__content"]') as HTMLDivElement;
    let img = btn.querySelector('img') as HTMLImageElement;

    btn.classList.toggle('closed');

    if (btn.classList.contains('closed')) {
        img.setAttribute('src', 'http://localhost:8000/images/icon_arrow-up_secondary.svg');
    } else {
        img.setAttribute('src', 'http://localhost:8000/images/icon_arrow-down_secondary.svg');
    }


    if (content) {
        content.classList.toggle('is-disabled');
    }
}

function changePage(btn: HTMLButtonElement) {
    document.querySelector('.result__nav-page.active')?.removeAttribute('aria-current');
    document.querySelector('.result__nav-page.active')?.classList.remove('active');
    btn.classList.add('active');
    btn.setAttribute('aria-current', 'page');

    currentPage = parseInt(btn.textContent);

    let prevBtn = navBtns[0] as HTMLButtonElement;
    let nextBtn = navBtns[1] as HTMLButtonElement;

    prevBtn.disabled = currentPage === 1;
    prevBtn.setAttribute('aria-disabled', (currentPage === 1).toString());

    nextBtn.disabled = currentPage === totalPages;
    nextBtn.setAttribute('aria-disabled', (currentPage === totalPages).toString());

    //  Script para trocar a página dos resultados
}