import { createProductElement, getProducts } from "@/components/_products_cards";
import * as metadataService from "@/services/metadataService";
import type { Product } from "@/types/product.interface";

//  Declarations

const collapseBtn = document.querySelectorAll('.result__heading-btn') as NodeListOf<HTMLButtonElement>;
const pageBtn = document.querySelectorAll('.result__nav-page') as NodeListOf<HTMLButtonElement>;
const navBtns = document.querySelectorAll('.result__nav-btn') as NodeListOf<HTMLButtonElement>;
const currentPageElement = document.querySelector('.result__nav-page.active') as HTMLButtonElement;

let currentPage = currentPageElement ? parseInt(currentPageElement.textContent) : 1;

const filterMobile = document.getElementById('mobile-filter') as HTMLButtonElement;

const draggableIcon = document.querySelector('.dragIcon__filter-wrapper') as HTMLDivElement;
const draggableArea = document.getElementById('result__filter-box') as HTMLDivElement;

const queryString = document.querySelector('#search-info__title')?.getAttribute('data-query-string') as string;
const productsArea = document.querySelector('#result__cards') as HTMLDivElement;
const navWrapper = document.getElementById('result__nav-pagination') as HTMLDivElement;

const labFilterContainer = document.getElementById('laboratory__content') as HTMLDivElement;
labFilterContainer.innerHTML = '';

let isDragging: boolean = false;
let startY: number;
let deltaY: number;
let closeThreshold: number = 100;

let products = await getProducts('search', 'views', 30, queryString, productsArea) as Product[];
let productsQnt: number = Array.isArray(products) ? products.length : 0;

const laboratories = Array.from(
    products.reduce((map, product: Product) => {
        if (product.laboratory) {
            const count = (map.get(product.laboratory) || 0) + 1;
            map.set(product.laboratory, count);
        }
        return map;
    }, new Map<string, number>())
).map(([laboratory, count]) => ({ laboratory, count }));

const categories = Array.from(
    products.reduce((map, product: Product) => {
        if (product.category) {
            const count = (map.get(product.category) || 0) + 1;
            map.set(product.category, count);
        }
        return map;
    }, new Map<string, number>())
).map(([category, count]) => ({ category, count }));

createFilterBox(categories);

const resultQntEl = document.getElementById('search-info__count') as HTMLSpanElement;
const totalPages = Math.ceil(productsQnt / 30);

const filterSelect = document.getElementById('filter__options') as HTMLSelectElement;



//  Events


filterSelect.addEventListener('change', async () => {
    const selected = filterSelect.value;

    productsQnt = await getProducts('search', selected, 30, queryString, productsArea) as number;

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

document.querySelectorAll<HTMLButtonElement>('.result__heading-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const isExpanded = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!isExpanded));
    });
});

laboratories.forEach(lab => {


    const labItem = document.createElement('div');
    labItem.classList.add('laboratory__checkbox');

    const labCheckbox = document.createElement('input');
    labCheckbox.type = 'checkbox';
    labCheckbox.id = `lab-${lab.laboratory}`;
    labCheckbox.name = `${lab.laboratory}`;
    labCheckbox.value = lab.laboratory;

    const labLabel = document.createElement('label');
    labLabel.htmlFor = `lab-${lab.laboratory}`;
    labLabel.innerHTML = `${lab.laboratory} <span class="lab-count" >(${lab.count})</span>`;

    labItem.appendChild(labCheckbox);
    labItem.appendChild(labLabel);

    labFilterContainer.appendChild(labItem);

    labCheckbox.addEventListener('change', async () => {
        const selectedCheckboxes = Array.from(
            document.querySelectorAll('#laboratory__content input[type="checkbox"]:checked')
        ) as HTMLInputElement[];

        const selectedLaboratories = selectedCheckboxes.map(checkbox => checkbox.value);
        const filteredProducts = await filterResults(products, 'laboratory', selectedLaboratories);

        productsQnt = filteredProducts.length;

        if (resultQntEl) {
            if (productsQnt === 1) {
                resultQntEl.textContent = `${productsQnt} resultado encontrado`;
            } else {
                resultQntEl.textContent = `${productsQnt} resultados encontrados`;
            }
        }

        document.querySelector('.result__nav-page.active')?.classList.remove('active');
        const firstPageBtn = document.querySelector('.result__nav-page') as HTMLButtonElement | null;
        if (firstPageBtn) {
            firstPageBtn.classList.add('active');
            firstPageBtn.setAttribute('aria-current', 'page');
        }
        currentPage = 1;

        // Atualizar botões prev/next
        const prevBtn = document.getElementById('nav__prev') as HTMLButtonElement | null;
        const nextBtn = document.getElementById('nav__next') as HTMLButtonElement | null;
        const newTotalPages = Math.ceil(productsQnt / 40);

        if (prevBtn) {
            prevBtn.disabled = true;
            prevBtn.setAttribute('aria-disabled', 'true');
        }
        if (nextBtn) {
            nextBtn.disabled = currentPage === newTotalPages;
            nextBtn.setAttribute('aria-disabled', (currentPage === newTotalPages).toString());
        }
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

async function filterResults(products: Product[], filterType: 'laboratory' | 'metadata', values: string[]): Promise<Product[]> {

    productsArea.innerHTML = '';

    if (values.length === 0) {
        await createProductElement(products, productsArea);
        return products;
    }

    if (filterType === 'laboratory') {
        const filteredProducts = products.filter(product => values.includes(product.laboratory));
        await createProductElement(filteredProducts, productsArea);
        return filteredProducts;
    } else if (filterType === 'metadata') {
        // Buscar produtos que possuem os valores de metadata selecionados
        const filteredProducts = [];
        
        for (const product of products) {
            // Buscar metadados do produto
            const productMetadata = await metadataService.fetchMetadatasByProduct(product.id);
            
            // Verificar se algum dos valores selecionados está nos metadados do produto
            const hasMatchingMetadata = productMetadata.metadatas.some(metadata => {
                return metadata.metadata_values?.some(value => values.includes(value.label));
            });
            
            if (hasMatchingMetadata) {
                filteredProducts.push(product);
            }
        }
        
        await createProductElement(filteredProducts, productsArea);
        return filteredProducts;
    }

    return products;
}

async function createFilterBox(categories: { category: string; count: number }[]) {

    const contentArea = document.getElementById('result__filters-created') as HTMLDivElement;

    if (!contentArea) {
        return;
    }

    for (const cat of categories) {
        
        let metadados = await metadataService.fetchMetadatasByCategory(cat.category);

        for (const metadata of metadados.metadatas) {
            
            // Converter espaços em hífens para usar em classes e IDs
            const metadataSlug = metadata.label.toLowerCase().replace(/\s+/g, '-');

            let filterBox = document.createElement('div');
            filterBox.classList.add('filter-box__area');

            let filterHeading = document.createElement('div');
            filterHeading.classList.add('result__heading');

            let headingTitle = document.createElement('h3');
            headingTitle.classList.add('result__heading-title');
            headingTitle.id = `${metadataSlug}-title`;
            headingTitle.textContent = metadata.label;

            let headingBtn = document.createElement('button');
            headingBtn.classList.add('result__heading-btn');
            headingBtn.setAttribute('aria-expanded', 'true');
            headingBtn.setAttribute('aria-controls', `${metadataSlug}__content`);
            headingBtn.setAttribute('aria-label', `Expandir filtro de ${metadata.label}`);

            let btnImg = document.createElement('img');
            btnImg.setAttribute('src', 'images/icons/icon_arrow_secondary.svg');
            btnImg.style.transform = 'rotate(90deg)';
            btnImg.style.transition = 'transform 0.6s ease';
            btnImg.style.width = '10px';
            btnImg.setAttribute('alt', 'seta para baixo');

            let btnSpan = document.createElement('span');
            btnSpan.classList.add('mobile-touch');

            headingBtn.appendChild(btnImg);
            headingBtn.appendChild(btnSpan);

            filterHeading.appendChild(headingTitle);
            filterHeading.appendChild(headingBtn);

            let filterContent = document.createElement('div');
            filterContent.id = `${metadataSlug}__content`;
            filterContent.setAttribute('aria-labelledby', `${metadataSlug}-title`);

            if (metadata.metadata_values) {
                for (const value of metadata.metadata_values) {
                    
                    let checkboxDiv = document.createElement('div');
                    checkboxDiv.classList.add(`${metadataSlug}__checkbox`);

                    let checkboxInput = document.createElement('input');
                    checkboxInput.type = 'checkbox';
                    checkboxInput.id = `${metadataSlug}-${value.id}`;
                    checkboxInput.name = `${metadataSlug}-${value.id}`;
                    checkboxInput.value = value.label;

                    let checkboxLabel = document.createElement('label');
                    checkboxLabel.htmlFor = `${metadataSlug}-${value.id}`;
                    checkboxLabel.textContent = value.label;

                    checkboxDiv.appendChild(checkboxInput);
                    checkboxDiv.appendChild(checkboxLabel);

                    filterContent.appendChild(checkboxDiv);

                    checkboxInput.addEventListener('change', async () => {
                        const selectedCheckboxes = Array.from(
                            filterContent.querySelectorAll(`input[type="checkbox"]:checked`)
                        ) as HTMLInputElement[];

                        const selectedValues = selectedCheckboxes.map(checkbox => checkbox.value);
                        await filterResults(products, 'metadata', selectedValues);
                    });
                }
            }

            filterBox.appendChild(filterHeading);
            filterBox.appendChild(filterContent);

            contentArea.appendChild(filterBox);

            headingBtn.addEventListener('click', () => {
                const isExpanded = headingBtn.getAttribute('aria-expanded') === 'true';
                headingBtn.setAttribute('aria-expanded', String(!isExpanded));
            });

        }
    }

    /**
     * <div id="result__method" class="filter-box__area">
                        <div class="result__heading">
                            <h3 class="result__heading-title" id="method-title">Métodos</h3>
                            <button class="result__heading-btn" aria-expanded="true" aria-controls="method__content" aria-label="Expandir filtro de métodos">
                                <img src="{{ asset('images/icon_arrow-down_secondary.svg') }}" alt="">
                                <span class="mobile-touch"></span>
                            </button>
                        </div>
                        <div id="method__content" aria-labelledby="method-title">
                            <div class="method__checkbox">
                                <input type="checkbox" id="method1" name="method1">
                                <label for="method1">Comprimido</label>
                            </div>
                            <div class="method__checkbox">
                                <input type="checkbox" id="method2" name="method2">
                                <label for="method2">Capsula</label>
                            </div>
                            <div class="method__checkbox">
                                <input type="checkbox" id="method3" name="method3">
                                <label for="method3">Solução</label>
                            </div>
                            <div class="method__checkbox">
                                <input type="checkbox" id="method4" name="method4">
                                <label for="method4">Retal</label>
                            </div>
                        </div>
                    </div>
     */

}

// createFilterBox('');