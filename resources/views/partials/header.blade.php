<div class="l-header">
    <div class="header__content max-width">
        <a href="/" class="header__logo">
            <img src="{{ asset('images/logo_white.svg') }}" alt="Logo da Farmácia">
        </a>

        <div id="header__search">
            <input aria-label="O que está procurando?" type="text" name="search" id="header__search_input" placeholder="O que está procurando?">
            <svg aria-label="Ícone de busca" class="search-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
        </div>

        <div class="header__actions">
            <button id="header__cart" data-toggle="modal-cart">
                <span class="cart__icon-wrapper"><img src="{{ asset('images/icon_cart_white.svg') }}" alt="Carrinho de compras"></span>
                <span>
                    Carrinho<br>
                    <span id="cart__count">R$ 0,00</span>
                </span>
            </button>
            <button id="header__user" data-toggle="modal-login">
                <span class="user__icon-wrapper"><img src="{{ asset('images/icon_user_white.svg') }}" alt="Menu do usuário"></span>
                <span>
                    Login<br>
                    ou <strong>Cadastro</strong>
                </span>
            </button>
        </div>

        <div id="header__mobile">
            <button id="header__mobile-search_icon" aria-label="Abrir busca">
                <img src="{{ asset('images/icon_magnifier_white.svg') }}" alt="Botão de busca">
                <span class="mobile-touch"></span>
            </button>

            <button id="header__mobile-cart" aria-label="Abrir carrinho">
                <img src="{{ asset('images/icon_basket_white.svg') }}" alt="Carrinho de compras">
                <span class="mobile-touch"></span>
            </button>

            <button id="header__mobile-menu">
                <img src="{{ asset('images/icon_mobile-menu_white.svg') }}" alt="Menu mobile">
                <span class="mobile-touch"></span>
            </button>
        </div>

    </div>

    <div class="is-disabled" id="header__mobile-search">
        <form action="" method="get" id="header__mobile-search_form">
            <input aria-label="O que está procurando?" type="text" name="search" id="header__mobile-search_input" placeholder="O que está procurando?">

        </form>
        <button aria-label="Ícone fechar campo de busca" class="header__mobile-search_close-btn" type="button" id="header__mobile-search_close">
            <svg aria-label="Ícone de X" fill="currentColor" viewBox="0 0 24 24" width="24" height="24">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
            <span class="mobile-touch"></span>
        </button>
    </div>

</div>

<div id="mobile-menu" class="is-disabled" aria-hidden="false">
    <div class="mobile-menu__wrapper">

        <div class="dragIcon">
            <div class="mobile-touch"></div>
        </div>

        <div class="menu-mobile__login-wrapper">
            <h2 class="mobile-menu__greatings">Que bom te ver!</h2>
            <span>Efetue seu login ou crie uma conta!</span>

            <div class="mobile-menu__act-btns">
                <button class="mobile-menu__signIn">Login</button>
                <button class="mobile-menu__signUp">Cadastro</button>
            </div>
        </div>

        <nav class="mobile-menu__nav" aria-label="Menu do usuário">
            <ul>
                <li>
                    <a href="#">
                        Perfil
                        <svg aria-label="Seta para a direita" width="16" height="16" viewBox="0 0 24 24" fill="none" style="vertical-align: middle;">
                            <path d="M8 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </a>
                </li>
                <li>
                    <a href="#">
                        Meus pedidos
                        <svg aria-label="Seta para a direita" width="16" height="16" viewBox="0 0 24 24" fill="none" style="vertical-align: middle;">
                            <path d="M8 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </a>
                </li>
                <li>
                    <a href="#">
                        Produtos favoritos
                        <svg aria-label="Seta para a direita" width="16" height="16" viewBox="0 0 24 24" fill="none" style="vertical-align: middle;">
                            <path d="M8 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </a>
                </li>
                <li>
                    <a href="#">
                        Descontos e benefícios
                        <svg aria-label="Seta para a direita" width="16" height="16" viewBox="0 0 24 24" fill="none" style="vertical-align: middle;">
                            <path d="M8 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </a>
                </li>
                <li>
                    <a href="#">
                        Sair
                        <svg aria-label="Seta para a direita" width="16" height="16" viewBox="0 0 24 24" fill="none" style="vertical-align: middle;">
                            <path d="M8 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </a>
                </li>
            </ul>
        </nav>
    </div>
</div>

@include('partials.modal_cart')

@include('partials.modal_login')