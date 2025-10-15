@extends('layouts.app')

@section('title', 'Perfil | Drogarias Camargo')

@push('styles')
@vite('resources/css/pages/perfil.css')
@endpush

@section('content')
<div id="greeting">
    <div id="greeting__content" class="max-width">
        <div id="greeting__avatar">
            <img src="{{ asset('images/user_avatar.png') }}" alt="Avatar do Usuário">
        </div>
        <!-- Colocar nome do usuário de forma dinâmica -->
        <h1>Olá, nome do usuário!</h1>
    </div>
</div>

<div id="info">
    <div id="info__content" class="max-width">
        <div id="info__options">
            <button class="info__option-btn active">
                <img src="{{ asset('images/icons/icon_user_white.svg') }}" alt="">
                Resumo
            </button>
            <button class="info__option-btn">
                <img src="{{ asset('images/icons/icon_user_black.svg') }}" alt="">
                Perfil
            </button>
            <button class="info__option-btn">
                <img src="{{ asset('images/icons/icon_user_black.svg') }}" alt="">
                Pedidos
            </button>
            <button class="info__option-btn is-disabled">
                <img src="{{ asset('images/icons/icon_user_black.svg') }}" alt="">
                Convênios
            </button>
            <button class="info__option-btn">
                <img src="{{ asset('images/icons/icon_user_black.svg') }}" alt="">
                Favoritos
            </button>
            <button class="info__option-btn">
                <img src="{{ asset('images/icons/icon_user_black.svg') }}" alt="">
                Sair
            </button>
        </div>
        <div id="info__result">
            <div id="info__resume" class="is-disabled">
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

            <div id="info__perfil" class="is-disabled">
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

            <div id="info__favorites" class="">
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
'resources/js/pages/_search.ts',
'resources/js/components/_products_cards.ts'
])
@endpush