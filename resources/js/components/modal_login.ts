export function initModalLogin() {
    // DECLARATIONS
    const modalBtn = document.querySelector(".header__user") as HTMLButtonElement;
    const modalContainer = document.querySelector('.modal-login') as HTMLElement;

    const closeBtnsModal = document.querySelectorAll('.modal-login__close-btn') as NodeListOf<HTMLButtonElement>;

    const focusableElements = getFocusableElements(modalContainer) as HTMLElement[];
    const firstFocusableElement = focusableElements[0] as HTMLElement;
    const lastFocusableElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const modalLeftSide_1: HTMLElement | null = modalContainer.querySelector('.modal-login__left.l_pt1');
    const modalRightSide_1: HTMLElement | null = modalContainer.querySelector('.modal-login__right.r_pt1');
    const modalLeftSide_2: HTMLElement | null = modalContainer.querySelector('.modal-login__left.l_pt2');
    const modalRightSide_2: HTMLElement | null = modalContainer.querySelector('.modal-login__right.r_pt2');

    const signInBtn = modalLeftSide_2?.querySelector('.signIn__btn') as HTMLButtonElement;
    const signUpBtn = modalRightSide_1?.querySelector('.signUp__btn') as HTMLButtonElement;

    let elementThatOpenedModal: HTMLElement | null = null;

    // EVENTS
    modalBtn.addEventListener('click', () => { openModal() });

    closeBtnsModal.forEach((btn) => {
        btn.addEventListener('click', () => { closeModal() });
    });

    if (modalContainer) {
        modalContainer.addEventListener('click', (event) => {
            if (event.target === modalContainer) {
                closeModal();
            }
        });
    }

    modalContainer.addEventListener('keydown', (event) => {

        console.log(event.key);

        if (!modalContainer.classList.contains('is-active')) {
            return;
        } 
        if (event.key === 'Escape') {
            closeModal();
        } else if (event.key === 'Tab') {
            if (event.shiftKey) {
                // Shift + Tab
                if (document.activeElement === firstFocusableElement) {
                    event.preventDefault();
                    lastFocusableElement.focus();
                }
            } else {
                // Tab
                if (document.activeElement === lastFocusableElement) {
                    event.preventDefault();
                    firstFocusableElement.focus();
                }
            }
        }
    });

    signInBtn?.addEventListener('click', () => { changeToSignIn() });
    signUpBtn?.addEventListener('click', () => { changeToSignUp() });

    // FUNCTIONS
    function openModal() {
        elementThatOpenedModal = document.activeElement as HTMLElement;

        modalContainer.classList.add('is-active');

        document.body.setAttribute('aria-hidden', 'true');
        modalContainer.setAttribute('aria-hidden', 'false');

        if (focusableElements.length > 0 && focusableElements[0] !== undefined) {
            focusableElements[0].focus();
        }
    }

    function closeModal() {
        elementThatOpenedModal?.focus();

        document.body.setAttribute('aria-hidden', 'false');
        modalContainer.setAttribute('aria-hidden', 'true');

        modalContainer.classList.remove('is-active');
    }

    function getFocusableElements(container: HTMLElement) {
        return Array.from(
            container.querySelectorAll<HTMLElement>(
                'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled])'
            )
        )
    }

    function changeToSignIn() {
        modalLeftSide_1?.classList.remove('is-disabled');
        modalRightSide_1?.classList.remove('is-disabled');

        modalLeftSide_2?.classList.add('is-disabled');
        modalRightSide_2?.classList.add('is-disabled');
    }

    function changeToSignUp() {
        modalLeftSide_1?.classList.add('is-disabled');
        modalRightSide_1?.classList.add('is-disabled');

        modalLeftSide_2?.classList.remove('is-disabled');
        modalRightSide_2?.classList.remove('is-disabled');
    }
}