//  DECLARATIONS

const banner1__area = document.querySelector('#banner1__slides-area') as HTMLDivElement;
const totalSlides = document.querySelectorAll('#banner1__slides-area .banner1__images').length;
const dotsArea = document.querySelector('#banner1__dots') as HTMLDivElement;

const banner1__arrowLeft = document.querySelector('#banner1__area .arrow-left') as HTMLButtonElement;
const banner1__arrowRight = document.querySelector('#banner1__area .arrow-right') as HTMLButtonElement;

let currentSlideIndex = 0;


//  EVENTS

if (dotsArea) {
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('span');
        dot.classList.add('banner1__dot');
        dot.setAttribute('data-slide', i.toString());
        if (i === 0) {
            dot.classList.add('active');
        }

        dotsArea.appendChild(dot);
    }

    document.querySelectorAll('.banner1__dot').forEach(dot => {
        dot.addEventListener('click', () => {
            const slideIndex = parseInt(dot.getAttribute('data-slide') || '0');

            scrollBanner('direct', slideIndex);
        });
    });
}

if (banner1__area) {
    banner1__area.addEventListener('mouseover', () => {
        banner1__arrowLeft.classList.add('active');
        banner1__arrowRight.classList.add('active');

        clearInterval(bannerInterval);
    });
    banner1__area.addEventListener('mouseout', () => {
        banner1__arrowLeft.classList.remove('active');
        banner1__arrowRight.classList.remove('active');

        clearInterval(bannerInterval);
        bannerInterval = setInterval(() => {
            scrollBanner('right');
        }, 3000);
    });
}

banner1__arrowLeft.addEventListener('click', () => { scrollBanner('left'); });
banner1__arrowRight.addEventListener('click', () => { scrollBanner('right'); });

let bannerInterval = setInterval(() => {
    scrollBanner('right');
}, 3000);


//  FUNCTIONS

function scrollBanner(direction: 'left' | 'right' | 'direct', destinationIndex?: number): void {

    clearInterval(bannerInterval);
    bannerInterval = setInterval(() => {
        scrollBanner('right');
    }, 3000);

    let new_margin = 0;
    const banner_width = document.querySelector('.banner1__images')?.clientWidth || 0;

    if (banner_width === 0) return;

    document.querySelector('.banner1__images.active')?.classList.remove('active');
    dotsArea.querySelector('.banner1__dot.active')?.classList.remove('active');

    if (direction === 'direct' && destinationIndex !== undefined) {
        currentSlideIndex = destinationIndex;

    } else if (direction === 'left') {
        currentSlideIndex--;
        if (currentSlideIndex < 0) {
            currentSlideIndex = totalSlides - 1;
        }
    } else if (direction === 'right') {
        currentSlideIndex++;
        if (currentSlideIndex >= totalSlides) {
            currentSlideIndex = 0;
        }
    }

    new_margin = banner_width * currentSlideIndex;
    banner1__area.style.marginLeft = `-${new_margin}px`;

    document.querySelector(`.banner1__images[data-slide="${currentSlideIndex}"]`)?.classList.add('active');
    dotsArea.querySelector(`.banner1__dot[data-slide="${currentSlideIndex}"]`)?.classList.add('active');
}