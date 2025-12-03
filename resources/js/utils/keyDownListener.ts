function getFocusableElements(container: HTMLElement): Array<HTMLElement> {
    return Array.from(
        container.querySelectorAll<HTMLElement>(
            'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled])'
        )
    )
}

/**
 * Lista todos os elementos focáveis dentro de um container e gerencia o foco quando a tecla Tab é pressionada.
 * 
 * @param {KeyboardEvent} event - Evento de teclado capturado.
 * @param {HTMLElement} container - Elemento DOM que contém os elementos focáveis.
 * 
 * @remarks
 * Esta função deve ser chamada dentro de um listener de evento de teclado (keydown) para garantir que o foco permaneça dentro do container especificado.
 * @example
 * // Adiciona um listener de teclado a um modal para gerenciar o foco
 * modal.addEventListener('keydown', (event) => {
 *     keyDownListener(event, modal);
 * });
 * 
 * @returns {void}
 */
export function keyDownListener(event: KeyboardEvent, container: HTMLElement): void {

    const focusableElements = getFocusableElements(container);
    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement = focusableElements[focusableElements.length - 1];

    if (event.key === 'Tab') {

        if (event.shiftKey) {
            // Shift + Tab
            if (document.activeElement === firstFocusableElement) {
                event.preventDefault();
                lastFocusableElement?.focus();
            }

        } else {
            // Tab
            if (document.activeElement === lastFocusableElement) {
                event.preventDefault();
                firstFocusableElement?.focus();
            }
        }

    }
}