import './bootstrap';

import { initHeader } from './components/_header';
import { initModalLogin } from './components/_modal-login';

document.addEventListener('DOMContentLoaded', () => {
    initHeader();
    initModalLogin();
});

export function getFocusableElements(container: HTMLElement) {
    return Array.from(
        container.querySelectorAll<HTMLElement>(
            'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled])'
        )
    )
}