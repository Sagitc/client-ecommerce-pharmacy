import { addOnCart, openCart } from '@/components/_cartModal';
import { getFocusableElements } from '../app';
import * as userHandler from '../handlers/userHandler';
import * as userService from '../services/userService';
import * as addressHandler from '../handlers/addressHandler';
import * as addressService from '../services/addressService';
import * as profileService from '../services/profileService';


//  DECLARATIONS
const options: NodeListOf<Element> = document.querySelectorAll('.info__option-btn');

const resumeAddressBtn: HTMLButtonElement | null = document.querySelector('#address__change');
const resumeCreditBtn: HTMLButtonElement | null = document.querySelector('#credit__change');
const profilePasswordBtn: HTMLButtonElement | null = document.querySelector('#perfil__password button');
const profileNumberBtn: HTMLButtonElement | null = document.querySelector('#perfil__number button');
const profileEmailBtn: HTMLButtonElement | null = document.querySelector('#perfil__email button');
const addressAddBtn: HTMLButtonElement | null = document.querySelector('#modal__resume-address__add');
const creditAddBtn: HTMLButtonElement | null = document.querySelector('#modal__resume-credit__add');
const changeAvatarBtn: HTMLButtonElement | null = document.querySelector('#greeting__avatar-change__area');

const modalAddress: HTMLDivElement | null = document.querySelector('#modal__resume-address');
const modalCredit: HTMLDivElement | null = document.querySelector('#modal__resume-credit');
const modalPassword: HTMLDivElement | null = document.querySelector('#modal__profile-password');
const modalNumber: HTMLDivElement | null = document.querySelector('#modal__profile-number');
const modalEmail: HTMLDivElement | null = document.querySelector('#modal__profile-email');
const modalAddressAdd: HTMLDivElement | null = document.querySelector('#modal__address-add');
const modalCreditAdd: HTMLDivElement | null = document.querySelector('#modal__credit-add');
const modalChangeAvatar: HTMLDivElement | null = document.querySelector('#modal__change-avatar');

const formChangeAvatar: HTMLFormElement | null = document.querySelector('#form_change_avatar');
const formRemoveAvatar: HTMLFormElement | null = document.querySelector('#form_remove_avatar');

const btnChangeAvatar: HTMLButtonElement | null = document.querySelector('#new_avatar-btn');
const btnRemoveAvatar: HTMLButtonElement | null = document.querySelector('#remove_avatar-btn');

const inputChangeAvatar: HTMLInputElement | null = document.querySelector('input[name="avatar"]');

const params: URLSearchParams = new URLSearchParams(window.location.search);
const tab: string | null = params.get('tab');

const modalInfos = {
    credit: {
        btn: resumeCreditBtn,
        modal: modalCredit
    },
    password: {
        btn: profilePasswordBtn,
        modal: modalPassword
    },
    number: {
        btn: profileNumberBtn,
        modal: modalNumber
    },
    email: {
        btn: profileEmailBtn,
        modal: modalEmail
    },
    addressAdd: {
        btn: addressAddBtn,
        modal: modalAddressAdd
    },
    creditAdd: {
        btn: creditAddBtn,
        modal: modalCreditAdd
    }
};

const modalCloseBtn: NodeListOf<Element> = document.querySelectorAll('.modal__close');
const divToAppend: HTMLDivElement | null = document.querySelector('#favorites__content');

let elementThatOpenedModal: HTMLElement | null = null;

//  EVENTS

userHandler.setUser(await userService.fetchUser());
let user = userHandler.getUserProfile();

loadUserAddresses();
loadUserFavorites();

let btnActiveOnLoad: Element | null = null;

btnActiveOnLoad = document.querySelector('.info__option-btn[data-option="' + (tab ? tab : 'resume') + '"]');

if (btnActiveOnLoad) {
    toggleInfoOption(btnActiveOnLoad);
}

if (tab && modalInfos[tab as keyof typeof modalInfos]) {
    const obj = modalInfos[tab as keyof typeof modalInfos];
    elementThatOpenedModal = obj.btn;
    toggleModal(obj.modal);
}

options.forEach(btn => {
    btn.addEventListener('click', () => {
        toggleInfoOption(btn);
    });
});

for (const key in modalInfos) {
    const obj = modalInfos[key as keyof typeof modalInfos];

    obj.btn?.addEventListener('click', () => {
        elementThatOpenedModal = obj.btn;
        toggleModal(obj.modal);
    });
}

modalCloseBtn.forEach(btn => {
    btn.addEventListener('click', () => {
        toggleModal(btn.parentElement?.parentElement as HTMLDivElement);
    });
});

changeAvatarBtn?.addEventListener('click', () => {
    elementThatOpenedModal = changeAvatarBtn;
    toggleModal(modalChangeAvatar);
});

resumeAddressBtn?.addEventListener('click', () => {
    toggleModal(modalAddress);

    let content = document.querySelector('#modal__resume-address .modal__content');
    let addresses = addressHandler.getAddresses();
    let mainAddress = addressHandler.getMainAddress();

    if (!content || !addresses || addresses.length === 0) return;

    content.innerHTML = '';

    for (let x = 0; addresses.length > x; x++) {
        let addressElements = document.createElement('div');
        addressElements.classList.add('modal__options-checkbox');
        addressElements.setAttribute('data-address-id', addresses[x]!.id.toString());

        addressElements.innerHTML = `
            <input selected type="radio" ${addresses[x]!.id === mainAddress?.id ? 'checked' : ''} name="address__option" id="address__option${x}">
            <label class="modal__option-checkbox__title" for="address__option${x}">
                <h4>${addresses[x]!.street}, ${addresses[x]!.number}</h4>
                <span class="modal__option-checkbox__description modal__address-region">${addresses[x]!.district} • ${addresses[x]!.zipcode}</span>
                <span class="modal__option-checkbox__description modal__address-receiver">${addresses[x]!.receiver_name}</span>
            </label>
            <button type="button" aria-label="Remover item" class="item-card__delete-btn">
              <img src="/images/icons/icon_trash_black.svg" alt="Ícone de remover item">
            </button>
        `
        content.appendChild(addressElements);
    }

    content.querySelectorAll('.item-card__delete-btn').forEach(btn => {
        btn.addEventListener('click', async (event) => {
            event.preventDefault();
            let address_id = parseInt((btn.parentElement?.getAttribute('data-address-id') as string));

            await addressService.removeAddress(address_id);
            addressHandler.setAddresses(await addressService.fetchAddresses());

            loadUserAddresses();
            
            toggleModal(modalAddress);
            resumeAddressBtn?.click();

        });
    });

    // Remove o listener antigo e adiciona um novo para evitar múltiplas execuções
    const saveBtn = document.querySelector('#modal__resume-address__save');
    const newSaveBtn = saveBtn?.cloneNode(true) as HTMLElement;
    saveBtn?.parentNode?.replaceChild(newSaveBtn, saveBtn);
    
    newSaveBtn?.addEventListener('click', async () => {
        let selectedAddressRadio: HTMLInputElement | null = content.querySelector('input[name="address__option"]:checked');

        if (!selectedAddressRadio) return;

        let selectedAddressDiv: HTMLDivElement | null = selectedAddressRadio.parentElement as HTMLDivElement;

        if (!selectedAddressDiv) return;

        let selectedAddressId: number = parseInt((selectedAddressDiv.getAttribute('data-address-id') as string));

        if (!selectedAddressId || selectedAddressId === mainAddress?.id) {
            toggleModal(modalAddress);
            return;
        }

        await addressService.setDefaultAddress(selectedAddressId);
        addressHandler.setAddresses(await addressService.fetchAddresses());

        loadUserAddresses();

        toggleModal(modalAddress);
    });

});

btnChangeAvatar?.addEventListener('click', () => {
    inputChangeAvatar?.click();
});

inputChangeAvatar?.addEventListener('change', () => {
    formChangeAvatar?.submit();
});

btnRemoveAvatar?.addEventListener('click', () => {
    formRemoveAvatar?.submit();
});

//  FUNCTIONS

function toggleInfoOption(btn: Element): void {
    let resumeSection: HTMLDivElement | null = document.getElementById('info__resume') as HTMLDivElement;
    let profileSection: HTMLDivElement | null = document.getElementById('info__profile') as HTMLDivElement;
    let requestsSection: HTMLDivElement | null = document.getElementById('info__requests') as HTMLDivElement;
    let covenantSection: HTMLDivElement | null = document.getElementById('info__covenant') as HTMLDivElement;
    let favoritesSection: HTMLDivElement | null = document.getElementById('info__favorites') as HTMLDivElement;

    if (!resumeSection || !profileSection || !requestsSection || !covenantSection || !favoritesSection) return;

    document.querySelector('.info__option-btn.active')?.classList.remove('active');
    btn.classList.add('active');

    switch (btn.getAttribute('data-option')) {
        case 'resume':
            resumeSection?.classList.remove('is-disabled');
            profileSection?.classList.add('is-disabled');
            requestsSection?.classList.add('is-disabled');
            covenantSection?.classList.add('is-disabled');
            favoritesSection?.classList.add('is-disabled');
            break;
        case 'profile':
            resumeSection?.classList.add('is-disabled');
            profileSection?.classList.remove('is-disabled');
            requestsSection?.classList.add('is-disabled');
            covenantSection?.classList.add('is-disabled');
            favoritesSection?.classList.add('is-disabled');
            break;
        case 'orders':
            resumeSection?.classList.add('is-disabled');
            profileSection?.classList.add('is-disabled');
            requestsSection?.classList.remove('is-disabled');
            covenantSection?.classList.add('is-disabled');
            favoritesSection?.classList.add('is-disabled');
            break;
        case 'covenant':
            resumeSection?.classList.add('is-disabled');
            profileSection?.classList.add('is-disabled');
            requestsSection?.classList.add('is-disabled');
            covenantSection?.classList.remove('is-disabled');
            favoritesSection?.classList.add('is-disabled');
            break;
        case 'favorites':
            resumeSection?.classList.add('is-disabled');
            profileSection?.classList.add('is-disabled');
            requestsSection?.classList.add('is-disabled');
            covenantSection?.classList.add('is-disabled');
            favoritesSection?.classList.remove('is-disabled');
            break;
        default:
            break;
    }
}

function toggleModal(modal: HTMLDivElement | null): void {
    if (!modal) return;
    modal.classList.toggle('is-disabled');

    if (modal.classList.contains('is-disabled')) return;

    const focusableElements: HTMLElement[] = getFocusableElements(modal);
    if (focusableElements.length === 0) return;

    const firstElement: HTMLElement | undefined = focusableElements[0];
    const lastElement: HTMLElement | undefined = focusableElements[focusableElements.length - 1];

    function callEventKeydown(firstElement: HTMLElement | undefined, lastElement: HTMLElement | undefined): void {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    // Shift + Tab
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement?.focus();
                    }
                } else {
                    // Tab
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement?.focus();
                    }
                }
            }

            if (e.key === 'Escape') {
                modal?.removeEventListener('keydown', handler);
                toggleModal(modal);
            }
        };

        modal?.addEventListener('keydown', handler);
    }

    callEventKeydown(firstElement, lastElement);

    firstElement?.focus();
}

async function loadUserFavorites(): Promise<void> {

    if (!divToAppend) return;

    divToAppend.innerHTML = '';

    let products = await userService.fetchUserFavorites();
    userHandler.setUserFavorites(products);

    createFavsProductElement(products);

}

async function loadUserAddresses(): Promise<void> {

    addressHandler.setAddresses(await addressService.fetchAddresses());

    if (addressHandler.getAddresses().length === 0) {

        const addressSection: HTMLDivElement | null = document.querySelector('#address__main') as HTMLDivElement;
        const addressCreateBtn: HTMLButtonElement | null = document.querySelector('#address__create');
        const addressesListModal: HTMLDivElement | null = document.querySelector('#modal__resume-address') as HTMLDivElement;

        addressCreateBtn?.classList.remove('is-disabled');
        
        document.querySelector('#address__change')?.classList.add('is-disabled');

        if (!addressSection) return;

        addressSection.innerHTML = `<p>Você ainda não possui endereços cadastrados.</p>`;

        addressCreateBtn?.addEventListener('click', () => {
            elementThatOpenedModal = addressCreateBtn;
            toggleModal(modalAddressAdd);
        });

        addressesListModal?.classList.contains('is-disabled') ? null : addressesListModal.classList.add('is-disabled');

        return;

    } else if (addressHandler.getAddresses().length > 0) {
        document.querySelector('#address_change')?.classList.contains('is-disabled') ?
            document.querySelector('#address__change')?.classList.remove('is-disabled') : null;

        document.querySelector('#address__create')?.classList.contains('is-disabled') ?
            null : document.querySelector('#address__create')?.classList.add('is-disabled');
    }

    let mainAddress = addressHandler.getMainAddress();

    if (!mainAddress) return;

    const mainStreet: HTMLSpanElement | null = document.querySelector('#address__street');
    const mainComplement: HTMLSpanElement | null = document.querySelector('#address__complements');
    const mainContact: HTMLSpanElement | null = document.querySelector('#address__contact');

    if (!mainStreet || !mainComplement || !mainContact) return;

    mainStreet.textContent = `${mainAddress.street}, ${mainAddress.number} (${mainAddress.complement ?? mainAddress.complement})`;
    mainComplement.textContent = `CEP ${mainAddress.zipcode} • ${mainAddress.district}`;
    mainContact.textContent = `${mainAddress.receiver_name} • ${mainAddress.receiver_phone}`;

}

function createFavsProductElement(products: any) {

    if (!divToAppend) return;

    for (let i = 0; i < products.length; i++) {

        let productElement = document.createElement('a');
        productElement.href = `/product/${products[i]?.id}`;
        productElement.classList.add('products__card');
        productElement.setAttribute('data-product-id', products[i]?.id);

        let imgFavHTML: string;

        if (userHandler.getUserFavorites().includes(products[i])) {
            imgFavHTML = `<img src="images/icons/icon_fav_filled.svg" aria-pressed="true" alt="Ícone de favoritar">`

        } else {
            imgFavHTML = `<img src="images/icons/icon_fav_outline.svg" aria-pressed="false" alt="Ícone de favoritar">`

        }

        productElement.innerHTML = `
                    <button class="products__like">
                        ` + imgFavHTML + `
                        <span class="mobile-touch"></span>
                    </button>
        
                    <div class="products__image">
                        <img src="${products[i]?.image}" alt="Imagem do produto">
        
                        <button class="products__btn-buy">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="11" y="4" width="2" height="16" fill="#fff" />
                                <rect x="4" y="11" width="16" height="2" fill="#fff" />
                            </svg>
                            <span class="mobile-touch"></span>
                        </button>
                    </div>
        
                    <div class="products__text">
                        <h3 class="products__title">${products[i]?.label}</h3>
        
                        <span class="products__price">R$ ${products[i]?.price.toFixed(2).replace('.', ',')}</span>
                    </div>`

        divToAppend.appendChild(productElement);

    }

    const favIcons = divToAppend.querySelectorAll('.products__like');
    const addBtns = divToAppend.querySelectorAll('.products__btn-buy');

    favIcons.forEach(icon => {
        icon.addEventListener('click', event => {
            event.stopPropagation();
            event.preventDefault();

            removeFav(icon);
        });
    });

    addBtns.forEach(btn => {

        btn.addEventListener('click', (event) => {
            event.stopPropagation();
            event.preventDefault();
            addOnCart(parseInt((btn.parentElement?.parentElement?.getAttribute('data-product-id') as string)));
            openCart();
        });


    });

}

async function removeFav(btn: any): Promise<void> {

    let productId = parseInt((btn.parentElement?.getAttribute('data-product-id') as string));

    let favorites = await userService.removeFavoriteProduct(productId);
    userHandler.setUserFavorites(favorites);

    loadUserFavorites();

}

