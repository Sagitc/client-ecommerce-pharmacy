export function initModalLogin() {
    // DECLARATIONS
    const modalBtn = document.querySelector("#header__user") as HTMLButtonElement;
    const modal = document.querySelector("#modal-login") as HTMLElement;
    const modalMobile = document.getElementById('modal-login') as HTMLElement;

    const closeBtnsModal = modal.querySelectorAll('.modal-login__close-btn') as NodeListOf<HTMLButtonElement>;

    const wrapper1 = modal.querySelector('.modal-login__wrapper1') as HTMLElement;
    const wrapper2 = modal.querySelector('.modal-login__wrapper2') as HTMLElement;
    const wrapper3 = modal.querySelector('.modal-login__wrapper3') as HTMLElement;

    let firstElement: HTMLElement;
    let lastElement: HTMLElement;

    const signInBtn = wrapper2?.querySelector('.signIn__btn') as HTMLButtonElement;
    const signUpBtn = wrapper1?.querySelector('.signUp__btn') as HTMLButtonElement;

    let elementThatOpenedModal: HTMLElement | null = null;

    // EVENTS
    modalBtn.addEventListener('click', () => { openModal() });

    closeBtnsModal.forEach((btn) => {
        btn.addEventListener('click', () => { closeModal() });
    });

    modal?.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    signInBtn?.addEventListener('click', () => { changeToSignIn() });
    signUpBtn?.addEventListener('click', () => { changeToSignUp() });

    // FUNCTIONS
    function openModal() {

        if (window.innerWidth > 991) {
            elementThatOpenedModal = document.activeElement as HTMLElement;

            modal.classList.add('is-active');
            wrapper1.classList.remove('is-disabled');

            document.body.setAttribute('aria-hidden', 'true');
            modal.setAttribute('aria-hidden', 'false');

            if (wrapper2.classList.contains('is-disabled')) {
                wrapper1.setAttribute('aria-hidden', 'false');
                wrapper2.setAttribute('aria-hidden', 'true');

                firstElement = getFocusableElements(wrapper1)[0] as HTMLElement;
                lastElement = getFocusableElements(wrapper1)[getFocusableElements(wrapper1).length - 1] as HTMLElement;

                if (getFocusableElements(wrapper1).length > 0 && firstElement !== undefined) {
                    firstElement.focus();
                }

            } else {
                wrapper1.setAttribute('aria-hidden', 'true');
                wrapper2.setAttribute('aria-hidden', 'false');

                firstElement = getFocusableElements(wrapper2)[0] as HTMLElement;
                lastElement = getFocusableElements(wrapper2)[getFocusableElements(wrapper2).length - 1] as HTMLElement;

                if (getFocusableElements(wrapper2).length > 0 && firstElement !== undefined) {
                    firstElement.focus();
                }
            }
        } else {
            elementThatOpenedModal = document.activeElement as HTMLElement;

            modalMobile.classList.remove('is-disabled');

            document.body.setAttribute('aria-hidden', 'true');
            modalMobile.setAttribute('aria-hidden', 'false');
        }

        callEventKeydown(firstElement, lastElement);

    }

    function closeModal() {
        elementThatOpenedModal?.focus();

        document.body.setAttribute('aria-hidden', 'false');
        modal.setAttribute('aria-hidden', 'true');

        wrapper1.setAttribute('aria-hidden', 'true');
        wrapper2.setAttribute('aria-hidden', 'true');

        modal.classList.remove('is-active');
    }

    function getFocusableElements(container: HTMLElement) {
        return Array.from(
            container.querySelectorAll<HTMLElement>(
                'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled])'
            )
        )
    }

    function callEventKeydown(
        firstElement: HTMLElement,
        lastElement: HTMLElement) {

        modal.addEventListener('keydown', (event) => {
            if (!modal.classList.contains('is-active')) {
                return;
            }

            if (event.key === 'Escape') {
                closeModal();
            } else if (event.key === 'Tab') {
                if (event.shiftKey) {
                    // Shift + Tab
                    if (document.activeElement === firstElement) {
                        event.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    // Tab
                    if (document.activeElement === lastElement) {
                        event.preventDefault();
                        firstElement.focus();
                    }

                }
            }
        });
    }

    function changeToSignIn() {
        wrapper1.classList.remove('is-disabled');
        wrapper2.classList.add('is-disabled');

        wrapper2.setAttribute('aria-hidden', 'true');
        wrapper1.setAttribute('aria-hidden', 'false');

        firstElement = getFocusableElements(wrapper1)[0] as HTMLElement;
        lastElement = getFocusableElements(wrapper1)[getFocusableElements(wrapper1).length - 1] as HTMLElement;

        firstElement.focus();

        callEventKeydown(firstElement, lastElement);
    }

    function changeToSignUp() {
        wrapper1.classList.add('is-disabled');
        wrapper2.classList.remove('is-disabled');

        wrapper1.setAttribute('aria-hidden', 'true');
        wrapper2.setAttribute('aria-hidden', 'false');

        firstElement = getFocusableElements(wrapper2)[0] as HTMLElement;
        lastElement = getFocusableElements(wrapper2)[getFocusableElements(wrapper2).length - 1] as HTMLElement;

        firstElement.focus();

        callEventKeydown(firstElement, lastElement);
    }
}