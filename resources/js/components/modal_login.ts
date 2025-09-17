export function initModalLogin() {
    // DECLARATIONS
    const modalBtn = document.querySelector("#header__user") as HTMLButtonElement;
    const modal = document.querySelector("#modal-login") as HTMLElement;

    const modalCloseBtns = modal.querySelectorAll('.modal-login__close-btn') as NodeListOf<HTMLButtonElement>;
    const modalForgotBtns = modal.querySelectorAll('.forgot-password') as NodeListOf<HTMLButtonElement>;

    const wrapper1 = modal.querySelector('.modal-login__wrapper1') as HTMLElement;
    const wrapper2 = modal.querySelector('.modal-login__wrapper2') as HTMLElement;
    const wrapper3 = modal.querySelector('.modal-login__wrapper3') as HTMLElement;
    const wrapper4 = modal.querySelector('.modal-login__wrapper4') as HTMLElement;

    let firstElement: HTMLElement;
    let lastElement: HTMLElement;

    const signInBtn = wrapper2?.querySelector('.signIn__btn') as HTMLButtonElement;
    const signUpBtn = wrapper1?.querySelector('.signUp__btn') as HTMLButtonElement;

    const mobileSignInBtn = wrapper3?.querySelector('#mobile__signIn') as HTMLButtonElement;
    const mobileSignUpBtn = wrapper3?.querySelector('#mobile__signUp') as HTMLButtonElement;

    const mobileSignInForm = wrapper3?.querySelector('#form-signIn__mobile') as HTMLFormElement;
    const mobileSignUpForm = wrapper3?.querySelector('#form-signUp__mobile') as HTMLFormElement;

    let elementThatOpenedModal: HTMLElement | null = null;

    // EVENTS
    modalBtn.addEventListener('click', () => { openModal() });

    modalCloseBtns.forEach((btn) => {
        btn.addEventListener('click', () => { closeModal() });
    });

    modalForgotBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            wrapper1.classList.add('is-disabled');
            wrapper3.classList.add('is-disabled');
            wrapper4.classList.remove('is-disabled');

            wrapper1.setAttribute('aria-hidden', 'true');
            wrapper3.setAttribute('aria-hidden', 'true');
            wrapper4.setAttribute('aria-hidden', 'false');

            firstElement = getFocusableElements(wrapper4)[0] as HTMLElement;
            lastElement = getFocusableElements(wrapper4)[getFocusableElements(wrapper4).length - 1] as HTMLElement;

            if (getFocusableElements(wrapper4).length > 0 && firstElement !== undefined) {
                firstElement.focus();
            }

            callEventKeydown(firstElement, lastElement);
        });
    });

    modal?.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    signInBtn?.addEventListener('click', () => { changeToSignIn() });
    signUpBtn?.addEventListener('click', () => { changeToSignUp() });
    mobileSignInBtn?.addEventListener('click', () => { changeToSignIn() });
    mobileSignUpBtn?.addEventListener('click', () => { changeToSignUp() });

    // teste
    document.querySelector('#header__mobile-search_icon')?.addEventListener('click', openModal);

    // FUNCTIONS
    function openModal() {

        elementThatOpenedModal = document.activeElement as HTMLElement;

        document.body.setAttribute('aria-hidden', 'true');
        modal.setAttribute('aria-hidden', 'false');
        modal.classList.remove('is-disabled');


        if (window.innerWidth > 991) {

            if (wrapper2.classList.contains('is-disabled')) {
                wrapper1.classList.remove('is-disabled');

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
            wrapper3.classList.remove('is-disabled');

            wrapper3.setAttribute('aria-hidden', 'false');

            firstElement = getFocusableElements(wrapper3)[0] as HTMLElement;
            lastElement = getFocusableElements(wrapper3)[getFocusableElements(wrapper3).length - 1] as HTMLElement;

            if (getFocusableElements(wrapper3).length > 0 && firstElement !== undefined) {
                firstElement.focus();
            }
        }

        callEventKeydown(firstElement, lastElement);

    }

    function closeModal() {
        elementThatOpenedModal?.focus();

        if (!wrapper1.classList.contains('is-disabled') || !wrapper2.classList.contains('is-disabled')) {
            wrapper1.setAttribute('aria-hidden', 'true');
            wrapper2.setAttribute('aria-hidden', 'true');
        } else if (!wrapper3.classList.contains('is-disabled')) {
            wrapper3.classList.add('is-disabled');
            wrapper3.setAttribute('aria-hidden', 'true');
        } else if (!wrapper4.classList.contains('is-disabled')) {
            wrapper4.classList.add('is-disabled');
            wrapper4.setAttribute('aria-hidden', 'true');
        }

        modal.classList.add('is-disabled');
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
            if (modal.classList.contains('is-disabled')) {
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

        if (wrapper3.classList.contains('is-disabled')) {
            wrapper1.classList.remove('is-disabled');
            wrapper2.classList.add('is-disabled');

            wrapper2.setAttribute('aria-hidden', 'true');
            wrapper1.setAttribute('aria-hidden', 'false');

            firstElement = getFocusableElements(wrapper1)[0] as HTMLElement;
            lastElement = getFocusableElements(wrapper1)[getFocusableElements(wrapper1).length - 1] as HTMLElement;

            firstElement.focus();

            callEventKeydown(firstElement, lastElement);
        } else {
            mobileSignInBtn.classList.add('is-active');
            mobileSignUpBtn.classList.remove('is-active');

            mobileSignInForm.classList.remove('is-disabled');
            mobileSignInForm.setAttribute('aria-hidden', 'false');

            mobileSignUpForm.classList.add('is-disabled');
            mobileSignUpForm.setAttribute('aria-hidden', 'true');

            firstElement = getFocusableElements(wrapper3)[0] as HTMLElement;
            lastElement = getFocusableElements(wrapper3)[getFocusableElements(wrapper3).length - 1] as HTMLElement;

            firstElement.focus();

            callEventKeydown(firstElement, lastElement);
        }
    }

    function changeToSignUp() {

        if (wrapper3.classList.contains('is-disabled')) {
            wrapper1.classList.add('is-disabled');
            wrapper2.classList.remove('is-disabled');

            wrapper1.setAttribute('aria-hidden', 'true');
            wrapper2.setAttribute('aria-hidden', 'false');

            firstElement = getFocusableElements(wrapper2)[0] as HTMLElement;
            lastElement = getFocusableElements(wrapper2)[getFocusableElements(wrapper2).length - 1] as HTMLElement;

            firstElement.focus();

            callEventKeydown(firstElement, lastElement);
        } else {
            mobileSignInBtn.classList.remove('is-active');
            mobileSignUpBtn.classList.add('is-active');

            mobileSignInForm.classList.add('is-disabled');
            mobileSignInForm.setAttribute('aria-hidden', 'true');

            mobileSignUpForm.classList.remove('is-disabled');
            mobileSignUpForm.setAttribute('aria-hidden', 'false');

            firstElement = getFocusableElements(wrapper3)[0] as HTMLElement;
            lastElement = getFocusableElements(wrapper3)[getFocusableElements(wrapper3).length - 1] as HTMLElement;

            firstElement.focus();

            console.log(firstElement, lastElement);

            callEventKeydown(firstElement, lastElement);
        }
    }
}