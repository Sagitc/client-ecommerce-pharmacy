export function initModalLogin() {
    const modal = document.querySelector('.modal-login');
    const closeButton = modal.querySelector('.modal-login__close');

    closeButton.addEventListener('click', () => {
        modal.classList.remove('is-active');
    });
}
