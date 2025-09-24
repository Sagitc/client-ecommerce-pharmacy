import './bootstrap';

import { initHeader } from './components/_header';
import { initModalCart } from './components/_modal-cart';
import { initModalLogin } from './components/_modal-login';
import { initHomePage } from './components/_page-home';

document.addEventListener('DOMContentLoaded', () => {
    initHeader();
    initModalCart();
    initModalLogin();
    initHomePage();
});
