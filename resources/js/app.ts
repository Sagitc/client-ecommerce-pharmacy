import './bootstrap';

import { initModalCart } from './components/modal_cart';
import { initModalLogin } from './components/modal_login';

document.addEventListener('DOMContentLoaded', () => {
    initModalCart();
    initModalLogin();
});