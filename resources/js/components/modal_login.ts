export function initModalLogin() {
    // DECLARATIONS
    const modalBtn = document.querySelector(".header__user") as HTMLButtonElement;
    const modalContainer = document.querySelector('.modal-login') as HTMLElement;
    const closeBtnModal = document.querySelector('#modal-login__close-btn') as HTMLButtonElement;

    const focusableElements = getFocusableElements(modalContainer) as HTMLElement[];
    const firstFocusableElement = focusableElements[0] as HTMLElement;
    const lastFocusableElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const modalLeftSide = modalContainer.querySelector('.modal-login__left') as HTMLElement;
    const modalRightSide = modalContainer.querySelector('.modal-login__right') as HTMLElement;

    let elementThatOpenedModal: HTMLElement | null = null;


    const signIn = {
        left: `<h2 class="modal-login__title">Login</h2>

                <div class="modal-login__social">
                    <button class="modal-login__social__item">
                        <img src="{{ asset('images/icon_google.svg') }}" alt="Google">
                    </button>
                    <button class="modal-login__social__item">
                        <img src="{{ asset('images/icon_facebook.svg') }}" alt="Facebook">
                    </button>
                    <button class="modal-login__social__item">
                        <img src="{{ asset('images/icon_twitter.svg') }}" alt="Twitter">
                    </button>
                </div>

                <form id="signIn__form" action="" method="get">
                    @csrf

                    <span>Entre com o seu e-mail ou CPF</span>

                    <input type="text" name="email" id="signIn__user" class="modal-login__input"
                        placeholder="Email ou CPF" required>

                    <input type="password" name="password" id="signIn__password" class="modal-login__input"
                        placeholder="Senha" required>

                    <a id="signIn__forgot">Esqueceu a senha?</a>

                    <button type="submit" class="signIn__submit">Login</button>
                </form>`,
                
        right: `<div class="modal-login__close">
                    <button id="modal-login__close-btn" aria-label="Fechar modal">&times;</button>
                </div>

                <h2 class="modal-login__title">Seja bem-vindo(a)!</h2>

                <span>Novo(a) por aqui? É bom ter você conosco</span>
                <span>Cadastre-se em nosso site!</span>

                <button class="signIn__submit">Cadastrar</button>`
    }

    const signUp = {
        left: "...",
        right: "..."
    }

    // EVENTS
    modalBtn.addEventListener('click', () => { openModal() });
    closeBtnModal.addEventListener('click', () => { closeModal() });

    if (modalContainer) {
        modalContainer.addEventListener('click', (event) => {
            if (event.target === modalContainer) {
                closeModal();
            }
        });
    }

    

    modalContainer.addEventListener('keydown', (event) => {
        if (!modalContainer.classList.contains('is-active')) {
            return;
        } else if (event.key === 'Escape') {
            closeModal();
        }

        if (event.key === 'Tab') {
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

    // FUNCTIONS
    const openModal = () => {
        elementThatOpenedModal = document.activeElement as HTMLElement;

        modalContainer.classList.add('is-active');

        document.body.setAttribute('aria-hidden', 'true');
        modalContainer.setAttribute('aria-hidden', 'false');

        if (focusableElements.length > 0 && focusableElements[0] !== undefined) {
            focusableElements[0].focus();
        }
    }

    const closeModal = () => {
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
        modalRightSide.classList.add('is-red');
        modalLeftSide.classList.remove('is-red');

        modalLeftSide.innerHTML = signIn.left;
        modalRightSide.innerHTML = signIn.right;
    }

    function changeToSignUp() {
        modalRightSide.classList.remove('is-red');
        modalLeftSide.classList.add('is-red');

        modalLeftSide.innerHTML = signUp.left;
        modalRightSide.innerHTML = signUp.right;
    }
}