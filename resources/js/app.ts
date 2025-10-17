import './bootstrap';

import { initHeader } from './components/_header';
import { initModalCart } from './components/_modal-cart';
import { initModalLogin } from './components/_modal-login';

document.addEventListener('DOMContentLoaded', () => {
    initHeader();
    initModalCart();
    initModalLogin();
});

export function getFocusableElements(container: HTMLElement) {
    return Array.from(
        container.querySelectorAll<HTMLElement>(
            'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled])'
        )
    )
}