<div class="l-header">
    <div class="header__content max-width">
        <a href="/" class="header__logo">
            <img src="{{ asset('images/logo_light.svg') }}" alt="Logo da Farmácia">
        </a>

        <div id="header__search">
            <input aria-label="O que está procurando?" type="text" name="search" id="header__search_input" placeholder="O que está procurando?">
            <svg aria-label="Ícone de busca" class="search-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
        </div>

        <div class="header__actions">
            <div class="header__cart">
                <span class="cart__icon"><img src="{{ asset('images/icon_cart.svg') }}" alt="Ícone de carrinho de compra"></span>
                <span>
                    Carrinho<br>
                    <span id="cart__count"><strong>0,00</strong></span>
                </span>
                <span class="mobile-touch"></span>
            </div>
            <div class="header__user">
                <span class="user__icon"><img src="{{ asset('images/icon_user.svg') }}" alt="Ícone de usuário"></span>
                <span>Login <br>ou <strong>Cadastro</strong></span>
                <span class="mobile-touch"></span>
            </div>
        </div>
    </div>
</div>

@include('partials.modal_cart')