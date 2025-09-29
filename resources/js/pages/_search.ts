//  Declarations

const collapseBtn = document.querySelectorAll('.result__heading-btn') as NodeListOf<HTMLButtonElement>;
const pageBtn = document.querySelectorAll('.result__nav-page') as NodeListOf<HTMLButtonElement>;
const navBtns = document.querySelectorAll('.result__nav-btn') as NodeListOf<HTMLButtonElement>;
const currentPageElement = document.querySelector('.result__nav-page.active') as HTMLButtonElement;
let currentPage = currentPageElement ? parseInt(currentPageElement.textContent) : 1;
const totalPages: number = pageBtn.length;
const filterMobile = document.getElementById('mobile-filter') as HTMLButtonElement;
const filterArea = document.getElementById('result__filter-box') as HTMLDivElement;

const draggableIcon = document.querySelector('.dragIcon__filter-wrapper') as HTMLDivElement;
const draggableArea = document.getElementById('result__filter-box') as HTMLDivElement;

let isDragging: boolean = false;
let startY: number;
let deltaY: number;
let closeThreshold: number = 100;

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

filterMobile.addEventListener('click', () => {
    // ABRIR: Apenas adiciona a classe 'is-open'
    draggableArea.classList.add('is-open');
});

draggableIcon.addEventListener('touchstart', (e: TouchEvent) => {
    isDragging = true;
    startY = e.touches[0]!.clientY;
    draggableArea.style.transition = 'none';
    console.log('start', startY);
});

draggableIcon.addEventListener('touchmove', (e: TouchEvent) => {
    if (!isDragging) return;

    e.preventDefault();

    const currentY = e.touches[0]!.clientY;
    deltaY = currentY - startY;

    if (deltaY > 0) {
        draggableArea.style.transform = `translateY(${deltaY}px)`;
    }
});

draggableIcon.addEventListener('touchend', () => {
    isDragging = false;
    draggableArea.style.transition = 'transform 0.3s ease, visibility 0s 0.3s';

    if (deltaY > closeThreshold) {
        draggableArea.classList.remove('is-open');
    } else {
        draggableArea.style.transform = 'translateY(0)';
    }
    deltaY = 0;
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