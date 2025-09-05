export function initModalLogin() {
    // DECLARATIONS
    const modalBtn = document.querySelector("#header__user") as HTMLButtonElement;
    const modalContainer = document.querySelector('#modal-login') as HTMLElement;

    const closeBtnsModal = modalContainer.querySelectorAll('.modal-login__close-btn') as NodeListOf<HTMLButtonElement>;

    const wrapper1 = modalContainer.querySelector('.modal-login__wrapper1') as HTMLElement;
    const wrapper2 = modalContainer.querySelector('.modal-login__wrapper2') as HTMLElement;

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

    modalContainer?.addEventListener('click', (event) => {
        if (event.target === modalContainer) {
            closeModal();
        }
    });
    //     if (!modalContainer.classList.contains('is-active')) {
    //         return;
    //     } else if (wrapper1.getAttribute('aria-hidden') === 'false') {
    //         focusableElements_w1 = getFocusableElements(wrapper1);
    //         firstFocusableElement_w1 = focusableElements_w1[0] as HTMLElement;
    //         lastFocusableElement_w1 = focusableElements_w1[focusableElements_w1.length - 1] as HTMLElement;

    //         console.log(event.key);

    //         if (event.key === 'Escape') {
    //             closeModal();
    //         } else if (event.key === 'Tab') {
    //             if (event.shiftKey) {
    //                 // Shift + Tab
    //                 if (document.activeElement === firstFocusableElement_w1) {
    //                     event.preventDefault();
    //                     lastFocusableElement_w1.focus();
    //                 }
    //             } else {
    //                 // Tab
    //                 if (document.activeElement === lastFocusableElement_w1) {
    //                     event.preventDefault();
    //                     firstFocusableElement_w1.focus();
    //                 }
    //             }
    //         }
    //     } else if (wrapper2.getAttribute('aria-hidden') === 'false') {
    //         focusableElements_w2 = getFocusableElements(wrapper2);
    //         firstFocusableElement_w2 = focusableElements_w2[0] as HTMLElement;
    //         lastFocusableElement_w2 = focusableElements_w2[focusableElements_w2.length - 1] as HTMLElement;

    //         console.log(event.key);

    //         if (event.key === 'Escape') {
    //             closeModal();
    //         } else if (event.key === 'Tab') {
    //             if (event.shiftKey) {
    //                 // Shift + Tab
    //                 if (document.activeElement === firstFocusableElement_w2) {
    //                     event.preventDefault();
    //                     lastFocusableElement_w2.focus();
    //                 }
    //             } else {
    //                 // Tab
    //                 if (document.activeElement === lastFocusableElement_w2) {
    //                     event.preventDefault();
    //                     firstFocusableElement_w2.focus();
    //                 }
    //             }
    //         }
    //     }
    // });

    signInBtn?.addEventListener('click', () => { changeToSignIn() });
    signUpBtn?.addEventListener('click', () => { changeToSignUp() });

    // FUNCTIONS
    function openModal() {
        elementThatOpenedModal = document.activeElement as HTMLElement;

        modalContainer.classList.add('is-active');

        document.body.setAttribute('aria-hidden', 'true');
        modalContainer.setAttribute('aria-hidden', 'false');

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

        callEventKeydown(firstElement, lastElement);

    }

    function closeModal() {
        elementThatOpenedModal?.focus();

        document.body.setAttribute('aria-hidden', 'false');
        modalContainer.setAttribute('aria-hidden', 'true');

        wrapper1.setAttribute('aria-hidden', 'true');
        wrapper2.setAttribute('aria-hidden', 'true');

        modalContainer.classList.remove('is-active');
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

        modalContainer.addEventListener('keydown', (event) => {
            if (!modalContainer.classList.contains('is-active')) {
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