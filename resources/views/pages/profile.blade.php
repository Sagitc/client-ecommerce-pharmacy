@extends('layouts.app')

@section('title', 'Perfil | Drogarias Camargo')

@push('styles')
@vite('resources/css/pages/profile.css')
@endpush

@section('content')
<div id="greeting">
    <div id="greeting__content" class="max-width">
        <div id="greeting__avatar">
            <img src="{{ asset('images/user_avatar.png') }}" alt="Avatar do Usuário">
        </div>
        <!-- Colocar nome do usuário de forma dinâmica -->
        <h1>Bem-vindo(a), {{ Auth::user()->full_name }}!</h1>
    </div>
</div>

<div id="modal__resume-address" class="modal-container is-disabled" aria-hidden="true" role="dialog" aria-modal="true">
    <div class="modal__box">

        <button type="button" class="modal__close" aria-label="Fechar modal">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M18 6L6 18M6 6l12 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <span class="mobile-touch"></span>
        </button>

        <form class="modal__content">
            <div class="modal__options-checkbox">
                <input selected type="radio" name="address__option1" id="address__option1">
                <label class="modal__option-checkbox__title" for="address__option1">
                    <h4>Rua João de Carvalho, 9873</h4>
                    <span class="modal__option-checkbox__description modal__address-region">Anchieta • 00.000-000</span>
                    <span class="modal__option-checkbox__description modal__address-receiver">Eduardo de cáprio</span>
                </label>
            </div>

            <div class="modal__options-checkbox">
                <input type="radio" name="address__option1" id="address__option2">
                <label class="modal__option-checkbox__title" for="address__option2">
                    <h4>Rua João de Carvalho, 9873</h4>
                    <span class="modal__option-checkbox__description modal__address-region">Anchieta • 00.000-000</span>
                    <span class="modal__option-checkbox__description modal__address-receiver">Eduardo de cáprio</span>
                </label>
            </div>

            <div class="modal__options-checkbox">
                <input type="radio" name="address__option1" id="address__option3">
                <label class="modal__option-checkbox__title" for="address__option3">
                    <h4>Rua João de Carvalho, 9873</h4>
                    <span class="modal__option-checkbox__description modal__address-region">Anchieta • 00.000-000</span>
                    <span class="modal__option-checkbox__description modal__address-receiver">Eduardo de cáprio</span>
                </label>
            </div>
        </form>

        <div class="modal__act">
            <button id="modal__resume-address__add" class="modal__act-aux">Adicionar</button>
            <button id="modal__resume-address__save" class="modal__act-main">Salvar</button>
        </div>
    </div>
</div>

<div id="modal__resume-credit" class="modal-container is-disabled" aria-hidden="true" role="dialog" aria-modal="true">
    <div class="modal__box">
        <button type="button" class="modal__close" aria-label="Fechar modal">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M18 6L6 18M6 6l12 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <span class="mobile-touch"></span>
        </button>

        <div class="modal__content">
            <div class="modal__options-checkbox">
                <input type="radio" name="address__option1" id="address__option1">
                <label class="modal__option-checkbox__title" for="address__option1">
                    <h4>Visa, término em 9862</h4>
                    <span class="modal__option-checkbox__description modal__credit-expire">Validade: 02/2038</span>
                    <span class="modal__option-checkbox__description modal__credit-owner">Eduardo de cáprio</span>
                </label>
            </div>
        </div>

        <div class="modal__act">
            <button id="modal__resume-credit__add" class="modal__act-aux">Adicionar</button>
            <button id="modal__resume-credit__save" class="modal__act-main">Salvar</button>
        </div>
    </div>
</div>

<div id="modal__profile-password" class="modal-container is-disabled" aria-hidden="true" role="dialog" aria-modal="true">
    <div class="modal__box">
        <button type="button" class="modal__close" aria-label="Fechar modal">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M18 6L6 18M6 6l12 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <span class="mobile-touch"></span>
        </button>

        <form class="modal__content">
            <div class="modal__form-group">
                <label for="current_password">Senha atual</label>
                <input type="password" name="current_password" id="modal__profile-current_password" aria-label="Campo para digitar a senha atual">
            </div>

            <div class="modal__form-group">
                <label for="new_password">Nova senha</label>
                <input type="password" name="new_password" id="modal__profile-new_password" aria-label="Campo para digitar a nova senha">
            </div>

            <div class="modal__form-group">
                <label for="confirm_new_password">Confirmar nova senha</label>
                <input type="password" name="confirm_new_password" id="modal__profile-confirm" aria-label="Campo para confirmar a nova senha">
            </div>

            <button type="submit" class="modal__act-main">Salvar</button>
        </form>
    </div>
</div>

<div id="modal__profile-number" class="modal-container is-disabled" aria-hidden="true" role="dialog" aria-modal="true">
    <div class="modal__box">
        <button type="button" class="modal__close" aria-label="Fechar modal">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M18 6L6 18M6 6l12 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <span class="mobile-touch"></span>
        </button>

        <form class="modal__content">
            <div class="modal__form-group">
                <label for="new_number">Novo número</label>
                <input type="text" name="new_number" id="modal__profile-new_number" aria-label="Campo para digitar o novo número de telefone">
            </div>

            <button type="submit" class="modal__act-main">Salvar</button>
        </form>
    </div>
</div>

<div id="modal__profile-email" class="modal-container is-disabled" aria-hidden="true" role="dialog" aria-modal="true"1>
    <div class="modal__box">
        <button type="button" class="modal__close" aria-label="Fechar modal">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M18 6L6 18M6 6l12 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <span class="mobile-touch"></span>
        </button>

        <form class="modal__content">
            <div class="modal__form-group">
                <label for="new_email">Novo email</label>
                <input type="email" name="new_email" id="modal__profile-new_email" aria-label="Campo para digitar o novo email">
            </div>

            <button type="submit" class="modal__act-main">Salvar</button>
        </form>
    </div>
</div>

<div id="modal__address-add" class="modal-container is-disabled" aria-hidden="true" role="dialog" aria-modal="true">
    <div class="modal__box">
        <button type="button" class="modal__close" aria-label="Fechar modal">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M18 6L6 18M6 6l12 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <span class="mobile-touch"></span>
        </button>

        <form class="modal__content">
            <div class="modal__form-group">
                <label for="address-add__zipcode">CEP</label>
                <input type="text" name="address_zipcode" id="address-add__zipcode" aria-label="Campo para digitar o CEP">
            </div>

            <div class="modal__form-group">
                <label for="address-add__street">Endereço</label>
                <input type="text" name="address_street" id="address-add__street" aria-label="Campo para digitar a rua e número">
            </div>

            <div class="modal__form-group">
                <label for="address-add__district">Bairro</label>
                <input type="text" name="address_district" id="address-add__district" aria-label="Campo para digitar o bairro">
            </div>

            <div class="modal__form-group">
                <label for="address-add__complement">Complemento</label>
                <input type="text" name="address_complement" id="address-add__complement" aria-label="Campo para digitar o complemento">
            </div>


            <div class="modal__form-group">
                <label for="address_receiver">Nome do receptor</label>
                <input type="text" name="address_receiver" id="modal__address-add-receiver" aria-label="Campo para digitar o nome do receptor">
            </div>

            <button type="submit" class="modal__act-main">Adicionar endereço</button>
        </form>
    </div>
</div>

<div id="modal__credit-add" class="modal-container is-disabled" aria-hidden="true" role="dialog" aria-modal="true">
    <div class="modal__box">
        <button type="button" class="modal__close" aria-label="Fechar modal">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M18 6L6 18M6 6l12 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <span class="mobile-touch"></span>
        </button>

        <form class="modal__content">
            <div class="modal__form-group">
                <label for="credit-add__number">Número do cartão</label>
                <input type="text" name="credit_number" id="credit-add__number" aria-label="Campo para digitar o número do cartão">
            </div>

            <div class="modal__form-group">
                <label for="credit-add__name">Nome no cartão</label>
                <input type="text" name="credit_name" id="credit-add__name" aria-label="Campo para digitar o nome no cartão">
            </div>

            <div class="modal__form-group">
                <label for="credit-add__expiry">Validade</label>
                <input type="text" name="credit_expiry" id="credit-add__expiry" aria-label="Campo para digitar a validade do cartão">
            </div>

            <div class="modal__form-group">
                <label for="credit-add__cvv">CVV</label>
                <input type="text" name="credit_cvv" id="credit-add__cvv" aria-label="Campo para digitar o CVV do cartão">
            </div>

            <button type="submit" class="modal__act-main">Adicionar cartão</button>
        </form>
    </div>
</div>

<div id="info">
    <div id="info__content" class="max-width">
        <div id="info__options">
            <button data-option="resume" class="info__option-btn active">
                <img src="{{ asset('images/icons/icon_user_white.svg') }}" alt="">
                Resumo
            </button>
            <button data-option="profile" class="info__option-btn">
                <img src="{{ asset('images/icons/icon_user_black.svg') }}" alt="">
                Perfil
            </button>
            <button data-option="orders" class="info__option-btn">
                <img src="{{ asset('images/icons/icon_user_black.svg') }}" alt="">
                Pedidos
            </button>
            <button data-option="covenant" class="info__option-btn is-disabled">
                <img src="{{ asset('images/icons/icon_user_black.svg') }}" alt="">
                Convênios
            </button>
            <button data-option="favorites" class="info__option-btn">
                <img src="{{ asset('images/icons/icon_user_black.svg') }}" alt="">
                Favoritos
            </button>
            <button data-option="sair" class="info__option-btn" onclick="event.preventDefault(); document.getElementById('profile__logout-btn').submit();">
                <img src="{{ asset('images/icons/icon_user_black.svg') }}" alt="">
                Sair
                <form action="{{ route('logout') }}" method="post" id="profile__logout-btn" style="display: none;">
                    @csrf
                </form>
            </button>
        </div>

        <div id="info__result">
            <div id="info__resume" class="">
                <div id="resume__latest" class="box">
                    <h3>Últimos Pedidos</h3>
                    <div id="latest__content">
                        <a href="#" class="latest__box">
                            <div class="latest__img">
                                <img src="{{ asset('images/products/product_example.png') }}" alt="Imagem do produto">
                            </div>
                            <div class="latest__info">
                                <span class="latest__name">Nome do Produto</span>
                                <span class="latest__date">12 Out. 2025</span>
                            </div>
                            <div class="latest__act">
                                <button class="latest__buy">Comprar novamente</button>
                                <button class="latest__feedback">Avaliar</button>
                            </div>
                        </a>

                        <a href="#" class="latest__box">
                            <div class="latest__img">
                                <img src="{{ asset('images/products/product_example.png') }}" alt="Imagem do produto">
                            </div>
                            <div class="latest__info">
                                <span class="latest__name">Nome do Produto</span>
                                <span class="latest__date">12 Out. 2025</span>
                            </div>
                            <div class="latest__act">
                                <button class="latest__buy">Comprar novamente</button>
                                <button class="latest__feedback">Avaliar</button>
                            </div>
                        </a>

                        <a href="#" class="latest__box">
                            <div class="latest__img">
                                <img src="{{ asset('images/products/product_example.png') }}" alt="Imagem do produto">
                            </div>
                            <div class="latest__info">
                                <span class="latest__name">Nome do Produto</span>
                                <span class="latest__date">12 Out. 2025</span>
                            </div>
                            <div class="latest__act">
                                <button class="latest__buy">Comprar novamente</button>
                                <button class="latest__feedback">Avaliar</button>
                            </div>
                        </a>
                    </div>
                </div>
                <div id="resume__right">
                    <div id="resume__address" class="box">
                        <h3>Endereço padrão</h3>
                        <div id="address__main">
                            <span id="address__street">Rua Coronel Silveiro, 0928 (Trabalho)</span>
                            <span id="address__complements">CEP 00.000-00 • Anchieta • RJ</span>
                            <span id="address__contact">Cauã de Souza • (21) 99999-9999</span>
                        </div>

                        <button id="address__change">Alterar endereço</button>
                    </div>

                    <div id="resume__credit" class="box">
                        <h3>Cartão padrão</h3>
                        <div id="credit__main">
                            <div id="credit__img">
                                <img src="{{ asset('images/icons/icon_mastercard.svg') }}" alt="Cartão de crédito">
                            </div>
                            <div id="credit__info">
                                <span id="credit__number">**** **** **** 1234</span>
                                <span id="credit__validity">12/25</span>
                            </div>
                        </div>

                        <button id="credit__change">Alterar cartão</button>
                    </div>
                </div>
            </div>

            <div id="info__profile" class="is-disabled">
                <div id="perfil__name" class="box">
                    <h3>Nome</h3>
                    <span id="perfil__name-value">Cauã de Souza Santos</span>
                </div>
                <div id="perfil__cpf" class="box">
                    <h3>CPF</h3>
                    <span id="perfil__cpf-value">123.456.789-00</span>
                </div>
                <div id="perfil__gender" class="box">
                    <h3>Gênero</h3>
                    <span id="perfil__gender-value">Masculino</span>
                </div>
                <div id="perfil__password" class="box">
                    <h3>Senha</h3>
                    <div class="perfil__wrapper">
                        <span id="perfil__password-value">********</span>
                        <button class="perfil__change">Alterar</button>
                    </div>
                </div>
                <div id="perfil__birthday" class="box">
                    <h3>Data de Nascimento</h3>
                    <span id="perfil__birthday-value">01/01/2000</span>
                </div>
                <div id="perfil__number" class="box">
                    <h3>Telefone</h3>
                    <div class="perfil__wrapper">
                        <span id="perfil__number-value">(21) 99999-9999</span>
                        <button class="perfil__change">Alterar</button>
                    </div>
                </div>
                <div id="perfil__email" class="box">
                    <h3>Email</h3>
                    <div class="perfil__wrapper">
                        <span id="perfil__email-value">caua@example.com</span>
                        <button class="perfil__change">Alterar</button>
                    </div>
                </div>
            </div>

            <div id="info__requests" class="is-disabled">
                <div class="requests__box">
                    <div class="requests__header">
                        <div class="requests__header-wrapper">
                            <div class="requests__header-info requests__date">
                                <h4>Data do pedido</h4>
                                <span class="requests__header-date">04 Jun. 2024</span>
                            </div>

                            <div class="requests__header-info requests__total">
                                <h4>Total</h4>
                                <span class="requests__header-price">R$ 100,00</span>
                            </div>

                            <div class="requests__header-info requests__address">
                                <h4>Endereço</h4>
                                <span class="requests__header-address">Rua Exemplo, 123</span>
                            </div>

                            <div class="requests__header-info requests__id">
                                <h4>Pedido</h4>
                                <span class="requests__header-order">Nº 123456</span>
                            </div>
                        </div>
                        <a href="http://google.com" target="_blank" class="requests__header-receipt">Recibo</a>
                    </div>
                    <div class="requests__content">
                        <div class="request__product">
                            <div class="request__product-img">
                                <img src="{{ asset('images/products/product_example.png') }}" alt="">
                            </div>
                            <div class="request__product-info">
                                <h3>Exemplo de produto 100mg 30cpr</h3>
                                <span class="request__product-laboratory">Laboratório</span>
                                <span class="request__product-quantity">1un</span>
                            </div>
                        </div>

                        <div class="request__date">
                            <span class="request__date-time">Entregue em 04 Junho</span>
                            <span class="request__date-receptor">Fulano recebeu o pedido</span>
                        </div>

                        <div class="request__act">
                            <button class="request__act-buy">Comprar novamente</button>
                            <button class="request__act-feedback">Avaliar produto</button>
                        </div>
                    </div>
                </div>
                <div id="requests__nav">
                    <button id="requests__nav-left">
                        <img src="{{ asset('images/icons/icon_arrow_secondary.svg') }}" alt="Seta para esquerda">
                    </button>
                    <div id="requests__nav-pages">
                        <button class="requests__nav-page active">1</button>
                        <button class="requests__nav-page">2</button>
                        <button class="requests__nav-page">3</button>
                        <button class="requests__nav-page">4</button>
                        <button class="requests__nav-page">5</button>
                    </div>
                    <button id="requests__nav-right">
                        <img src="{{ asset('images/icons/icon_arrow_secondary.svg') }}" alt="Seta para direita">
                    </button>
                </div>
            </div>

            <div id="info__covenant" class="is-disabled">
                <div id="covenant__content">
                    <h2>Convênios</h2>
                    <p>Em breve você poderá adicionar convênios ao seu perfil!</p>
                </div>
            </div>

            <div id="info__favorites" class="is-disabled">
                <div id="favorites__content">
                    @include('components.products_cards')
                </div>
            </div>
        </div>
    </div>
</div>

@endsection

@push('scripts')
@vite([
'resources/js/pages/_profile.ts',
'resources/js/components/_products_cards.ts'
])
@endpush