import { closeCart } from "@/components/_cartModal";

export function getFocusableElements(container: HTMLElement): Array<HTMLElement> {
    return Array.from(
        container.querySelectorAll<HTMLElement>(
            'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled])'
        )
    )
}

function keyDownListener(event: KeyboardEvent, container: HTMLElement): void {

    const focusableElements = getFocusableElements(container);
    const firstEl = focusableElements[0];
    const lastEl = focusableElements[focusableElements.length - 1];

    if (event.key === 'Escape') {

        event.preventDefault();
        closeCart();
        return;

    } else if (event.key === 'Tab') {

        if (event.shiftKey) {
            // Shift + Tab
            if (document.activeElement === firstEl) {
                event.preventDefault();
                lastEl?.focus();
            }

        } else {
            // Tab
            if (document.activeElement === lastEl) {
                event.preventDefault();
                firstEl?.focus();
            }
        }

    }
}

/**
 * Cria uma função para gerenciar o foco dentro de um container específico.
 * @param {HTMLElement} container 
 * @returns {(event: KeyboardEvent) => void} Função que pode ser usada como listener de eventos de teclado para manter o foco dentro do container.
 */
export function createFocusTrapHandler(container: HTMLElement): (event: KeyboardEvent) => void {

    return (event: KeyboardEvent) => keyDownListener(event, container);

}