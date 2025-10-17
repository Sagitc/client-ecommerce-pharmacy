import { getFocusableElements } from '../app';

//  DECLARATIONS
const options: NodeListOf<Element> = document.querySelectorAll('.info__option-btn');

const resumeAddressBtn: HTMLButtonElement | null = document.querySelector('#address__change');
const resumeCreditBtn: HTMLButtonElement | null = document.querySelector('#credit__change');
const profilePasswordBtn: HTMLButtonElement | null = document.querySelector('#perfil__password button');
const profileNumberBtn: HTMLButtonElement | null = document.querySelector('#perfil__number button');
const profileEmailBtn: HTMLButtonElement | null = document.querySelector('#perfil__email button');
const addressAddBtn: HTMLButtonElement | null = document.querySelector('#modal__resume-address__add');
const creditAddBtn: HTMLButtonElement | null = document.querySelector('#modal__resume-credit__add');    

const modalAddress: HTMLDivElement | null = document.querySelector('#modal__resume-address');
const modalCredit: HTMLDivElement | null = document.querySelector('#modal__resume-credit');
const modalPassword: HTMLDivElement | null = document.querySelector('#modal__profile-password');
const modalNumber: HTMLDivElement | null = document.querySelector('#modal__profile-number');
const modalEmail: HTMLDivElement | null = document.querySelector('#modal__profile-email');
const modalAddressAdd: HTMLDivElement | null = document.querySelector('#modal__address-add');
const modalCreditAdd: HTMLDivElement | null = document.querySelector('#modal__credit-add');

const modalInfos = {
    address: {
        btn: resumeAddressBtn,
        modal: modalAddress
    },
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



let elementThatOpenedModal: HTMLElement | null = null;


//  EVENTS
options.forEach(btn => {
    btn.addEventListener('click', () => {
        toggleInfoOption(btn);
    });
});

for( const key in modalInfos ) {
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
        case 'requests':
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
        case 'favoritos':
            resumeSection?.classList.add('is-disabled');
            profileSection?.classList.add('is-disabled');
            requestsSection?.classList.add('is-disabled');
            covenantSection?.classList.add('is-disabled');
            favoritesSection?.classList.remove('is-disabled');
            break;
        case 'sair':
            window.location.href = '/logout';
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