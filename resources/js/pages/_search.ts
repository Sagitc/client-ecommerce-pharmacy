import { getProducts } from "@/components/_products_cards";

//  Declarations

const collapseBtn = document.querySelectorAll('.result__heading-btn') as NodeListOf<HTMLButtonElement>;
const pageBtn = document.querySelectorAll('.result__nav-page') as NodeListOf<HTMLButtonElement>;
const navBtns = document.querySelectorAll('.result__nav-btn') as NodeListOf<HTMLButtonElement>;
const currentPageElement = document.querySelector('.result__nav-page.active') as HTMLButtonElement;

let currentPage = currentPageElement ? parseInt(currentPageElement.textContent) : 1;

const filterMobile = document.getElementById('mobile-filter') as HTMLButtonElement;

const draggableIcon = document.querySelector('.dragIcon__filter-wrapper') as HTMLDivElement;
const draggableArea = document.getElementById('result__filter-box') as HTMLDivElement;

const queryString  = document.querySelector('#search-info__title')?.getAttribute('data-query-string') as string;
const productsArea = document.querySelector('#result__cards') as HTMLDivElement;
const navWrapper   = document.getElementById('result__nav-pagination') as HTMLDivElement;

let isDragging: boolean = false;
let startY: number;
let deltaY: number;
let closeThreshold: number = 100;

let productsQnt = await getProducts('search', 'views', 30, queryString, productsArea);
const resultQntEl = document.getElementById('search-info__count') as HTMLSpanElement;
const totalPages = Math.ceil(productsQnt / 40);

const filterSelect = document.getElementById('filter__options') as HTMLSelectElement;

filterSelect.addEventListener('change', async () => {
    const selected = filterSelect.value;

    // feedback visual
    productsArea.innerHTML = '<div class="loading">Carregando...</div>';
    
    productsQnt = await getProducts('search', selected, 30, queryString, productsArea);

    // atualizar contador de resultados
    if (resultQntEl) {
        if (productsQnt === 1) {
            resultQntEl.textContent = `${productsQnt} resultado encontrado`;
        } else {
            resultQntEl.textContent = `${productsQnt} resultados encontrados`;
        }
    }

    // resetar para a primeira página (UI)
    document.querySelector('.result__nav-page.active')?.classList.remove('active');
    const firstPageBtn = document.querySelector('.result__nav-page') as HTMLButtonElement | null;
    if (firstPageBtn) {
        firstPageBtn.classList.add('active');
        firstPageBtn.setAttribute('aria-current', 'page');
    }
    currentPage = 1;

    // ajustar estados dos botões prev/next
    const prevBtn = document.getElementById('nav__prev') as HTMLButtonElement | null;
    const nextBtn = document.getElementById('nav__next') as HTMLButtonElement | null;
    if (prevBtn) {
        prevBtn.disabled = true;
        prevBtn.setAttribute('aria-disabled', 'true');
    }
    if (nextBtn) {
        nextBtn.disabled = currentPage === totalPages;
        nextBtn.setAttribute('aria-disabled', (currentPage === totalPages).toString());
    }
});


//  Events

document.querySelectorAll<HTMLButtonElement>('.result__heading-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const isExpanded = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!isExpanded));
    });
});

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

filterMobile.addEventListener('click', () => {
    draggableArea.classList.add('is-open');
});

draggableIcon.addEventListener('touchstart', (e: TouchEvent) => {
    isDragging = true;
    startY = e.touches[0]!.clientY;
    draggableArea.style.transition = 'none';
});

draggableIcon.addEventListener('touchmove', (e: TouchEvent) => {
    if (!isDragging) return;
    deltaY = (e.touches[0]!.clientY) - startY;
    
    if (deltaY > 0) {
        draggableArea.style.transform = `translateY(${deltaY}px)`;
    }
});

draggableIcon.addEventListener('touchend', () => {
    isDragging = false;
    draggableArea.style.transition = 'all 0.4s ease';
    if (deltaY > closeThreshold) {
        draggableArea.classList.remove('is-open');
        setTimeout(() => {
            draggableArea.style.transform = 'translateY(0)';
            draggableArea.style.removeProperty('transform');
        }, 300);
    } else {
        draggableArea.style.transform = 'translateY(0)';
    }
    deltaY = 0;
});

if (productsQnt && resultQntEl) {
    if (productsQnt === 1) {
        resultQntEl.textContent = `${productsQnt} resultado encontrado`;
    } else {
        resultQntEl.textContent = `${productsQnt} resultados encontrados`;
    }
}

createBtnPage(totalPages, navWrapper);


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

function createBtnPage(num: number, divToAppend: HTMLElement): void {

    for (let i = 0; i < num; i++) {
    
        let btn = document.createElement('button');
        btn.classList.add('result__nav-page');
        btn.setAttribute('aria-label', `Ir para a página ${i + 1}`);
        btn.setAttribute('aria-current', 'false');
        btn.textContent = (i + 1).toString();

        divToAppend.appendChild(btn);

        if (i + 1 === 1) {
            btn.classList.add('active');
            btn.setAttribute('aria-current', 'page');
        }

        btn.addEventListener('click', () => { changePage(btn) });

    }

}