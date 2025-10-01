//  Declarations

const catalogBtns = document.querySelectorAll('.catalog__option');
const btnPrev = document.querySelectorAll('.products__btn-prev') as NodeListOf<HTMLButtonElement>;
const btnNext = document.querySelectorAll('.products__btn-next') as NodeListOf<HTMLButtonElement>;

let scrollableSection: HTMLDivElement;
let otherButton: HTMLButtonElement;

//  Events

catalogBtns.forEach(btn => {
    btn.addEventListener('click', () => { filterCatalog(btn) });
});

btnNext.forEach(btn => {
    btn.addEventListener('click', (e) => { scrollRight(btn); });
});

btnPrev.forEach(btn => {
    btn.addEventListener('click', (e) => { scrollLeft(btn); });
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

function scrollRight(button: HTMLButtonElement): void {
    scrollableSection = button.parentElement?.parentElement?.parentElement?.querySelector('div[id$="__content"]') as HTMLDivElement;
    if (!scrollableSection) return;

    let card = scrollableSection.querySelector('.products__card') as HTMLLinkElement;
    if (!card) return;

    let scrollAmount: number = card.offsetWidth + (parseInt(window.getComputedStyle(scrollableSection).gap) || 0);

    scrollableSection.scrollBy({ left: (scrollAmount * 4), behavior: 'smooth' });

    otherButton = button.parentElement?.querySelector('button[class$="-prev"]') as HTMLButtonElement;  //  Botão prev

    scrollableSection.addEventListener('scrollend', () => { 
        setTimeout(() => updateBtns(scrollableSection, button, otherButton), 200); //  Tempo para garantir que o scroll terminou
    });
}

function scrollLeft(button: HTMLButtonElement): void {
    scrollableSection = button.parentElement?.parentElement?.parentElement?.querySelector('div[id$="__content"]') as HTMLDivElement;
    if (!scrollableSection) return;

    let card = scrollableSection.querySelector('.products__card') as HTMLLinkElement;
    if (!card) return;
    
    let scrollAmount: number = card.offsetWidth + (parseInt(window.getComputedStyle(scrollableSection).gap) || 0);

    scrollableSection.scrollBy({ left: -(scrollAmount * 4), behavior: 'smooth' });

    otherButton = button.parentElement?.querySelector('button[class$="-next"]') as HTMLButtonElement;  //  Botão next

    scrollableSection.addEventListener('scrollend', () => { 
        setTimeout(() => updateBtns(scrollableSection, otherButton, button), 200); //  Tempo para garantir que o scroll terminou
    });
}

function updateBtns(scrollableSection: HTMLDivElement, rightBtn: HTMLButtonElement, leftBtn: HTMLButtonElement): void {
    let scrollLeft = scrollableSection.scrollLeft;
    let scrollWidth = scrollableSection.scrollWidth;
    let clientWidth = scrollableSection.clientWidth;

    if (scrollLeft < 1) {
        leftBtn.disabled = true;
        rightBtn.disabled = false;
    } else if (scrollLeft + clientWidth >= scrollWidth - 1) {
        rightBtn.disabled = true;
        leftBtn.disabled = false;
    } else {
        rightBtn.disabled = false;
        leftBtn.disabled = false;
    }
}