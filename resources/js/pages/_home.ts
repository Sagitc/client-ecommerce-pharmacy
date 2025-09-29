export function initHomePage() {
    //  Declarations

    const catalogBtns = document.querySelectorAll('.catalog__option');


    //  Events
    
    catalogBtns.forEach(btn => {
        btn.addEventListener('click', () => { filterCatalog(btn) });
    });

    document.querySelectorAll('.products__nav').forEach(containerNav => {
        containerNav.addEventListener('click', (event) => {
            scrollCards(containerNav, event)
        });
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
            const scrollWidth = sectionScrollable.scrollWidth; // Largura total do conteúdo
            const clientWidth = sectionScrollable.clientWidth; // Largura visível do container

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
}