//  Declarations

const catalogBtns = document.querySelectorAll('.catalog__option');
const btnPrev = document.querySelectorAll('.products__btn-prev') as NodeListOf<HTMLButtonElement>;
const btnNext = document.querySelectorAll('.products__btn-next') as NodeListOf<HTMLButtonElement>;

let scrollableSection: HTMLDivElement;

//  Events

catalogBtns.forEach(btn => {
    btn.addEventListener('click', () => { filterCatalog(btn) });
});

btnNext.forEach(btn => {
    btn.addEventListener('click', (e) => { scrollRight(btn); });
});

// document.querySelectorAll('.products__nav').forEach(containerNav => {
//     containerNav.addEventListener('click', event => {
//         scrollCards(containerNav, event);
//     });
// });


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

    scrollableSection = button.parentElement?.parentElement?.parentElement?.querySelector('div[class$="__content"]') as HTMLDivElement;
    if (!scrollableSection) return;

    if (scrollableSection.scrollWidth <= scrollableSection.clientWidth + 1) {
        button.disabled = true;
        return;
    }

    let card = scrollableSection.querySelector('.products__card') as HTMLLinkElement;
    if (!card) return;

    let cardWidth = card.offsetWidth;
    let cardGap = parseInt(window.getComputedStyle(scrollableSection).gap) || 0;
    let scrollAmount = cardWidth + cardGap;

    scrollableSection.scrollBy({ left: scrollAmount * 4, behavior: 'smooth' });

    scrollableSection.addEventListener('scrollend', () => {
        if (scrollableSection.scrollWidth <= scrollableSection.clientWidth + scrollableSection.scrollLeft + 1) {
            button.disabled = true;
        } else {
            button.disabled = false;
        }
    });
}

function scrollLeft(button: HTMLButtonElement): void {
    scrollableSection = button.parentElement?.parentElement?.parentElement?.querySelector('div[class$="__content"]') as HTMLDivElement;
    if (!scrollableSection) return;

    let card = scrollableSection.querySelector('.products__card') as HTMLLinkElement;
    if (!card) return;

    let cardWidth = card.offsetWidth;
    let cardGap = parseInt(window.getComputedStyle(scrollableSection).gap) || 0;
    let scrollAmount = cardWidth + cardGap;

    scrollableSection.scrollBy({ left: -(scrollAmount * 4), behavior: 'smooth' });

    scrollableSection.addEventListener('scrollend', () => {
        if (scrollableSection.scrollWidth <= scrollableSection.clientWidth + scrollableSection.scrollLeft + 1) {
            button.disabled = true;
        } else {
            button.disabled = false;
        }
    });
}


// function updateButtonStates(sectionScrollable: HTMLDivElement, btn: HTMLButtonElement): void {

//     if (sectionScrollable.scrollWidth <= sectionScrollable.clientWidth + sectionScrollable.scrollLeft + 1) {
//         btn.disabled = true;
//     } else {
//         btn.disabled = false;
//     }
// }


function scrollCards(container: Element, event: Event) {
    const sectionTarget = container.parentElement?.parentElement as HTMLElement;

    if (!sectionTarget) return;

    const sectionScrollable = sectionTarget.querySelector('div[class$="__content"]') as HTMLDivElement;
    const btnPrev = container.querySelector('.products__btn--prev') as HTMLButtonElement;
    const btnNext = container.querySelector('.products__btn--next') as HTMLButtonElement;

    if (!sectionScrollable || !btnPrev || !btnNext) {
        console.error('Elementos essenciais (scrollable, prev, next) não encontrados.');
        return;
    }

    const updateButtonStates = () => {
        const scrollLeft = sectionScrollable.scrollLeft;
        const scrollWidth = sectionScrollable.scrollWidth;
        const clientWidth = sectionScrollable.clientWidth;

        btnPrev.disabled = scrollLeft < 1;
        btnNext.disabled = scrollLeft + clientWidth >= scrollWidth - 1;
    };

    container.addEventListener('click', (event) => {
        const clickedButton = (event.target as HTMLElement).closest('button');
        if (!clickedButton) return;

        const card = sectionScrollable.querySelector('.products__card') as HTMLElement;
        if (!card) return;

        const cardWidth = card.offsetWidth;
        const cardGap = parseInt(window.getComputedStyle(sectionScrollable).gap) || 0;
        const scrollAmount = cardWidth + cardGap;

        if (clickedButton === btnNext) {
            sectionScrollable.scrollBy({ left: scrollAmount * 4, behavior: 'smooth' });
        } else if (clickedButton === btnPrev) {
            sectionScrollable.scrollBy({ left: -scrollAmount * 4, behavior: 'smooth' });
        }
    });

    sectionScrollable.addEventListener('scrollend', updateButtonStates);
    updateButtonStates();
}
