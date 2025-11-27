@extends('layouts.app')

@section('title', 'Drogarias Camargo | Home')

@push('styles')
@vite('resources/css/pages/home.css')
@endpush

@section('content')

<section id="main-banner">
    <div id="banner1__area" class="max-width">

        <button class="banner1__arrow arrow-left">
            <img src="{{ asset('images/icons/icon_arrow_secondary.svg') }}" alt="Ícone de seta para direita">
        </button>

        <div id="banner1__slides-area">
            <div data-slide="0" class="banner1__images active"></div>
            <div data-slide="1" class="banner1__images"></div>
        </div>

        <button class="banner1__arrow arrow-right">
            <img src="{{ asset('images/icons/icon_arrow_secondary.svg') }}" alt="Ícone de seta para direita">
        </button>

        <div id="banner1__dots">
        </div>
    </div>

    @vite('resources/js/components/_carrosel-home.ts')

</section>

<section id="benefits">
    <div class="benefits__content max-width">
        <div class="benefits__card">
            <figure class="benefits__img">
                <img src="{{ asset('images/icons/icon_cardPayment_white.svg') }}" alt="Benefício 1">
            </figure>

            <div class="benefits__text">
                <h3 class="benefits__title">Parcelamento</h3>
                <p class="benefits__description">Parcelamos suas compras em até 6x sem juros no cartão.</p>
            </div>
        </div>

        <div class="benefits__card">
            <figure class="benefits__img">
                <img src="{{ asset('images/icons/icon_delivery_white.svg') }}" alt="Benefício 1">
            </figure>

            <div class="benefits__text">
                <h3 class="benefits__title">Frete grátis</h3>
                <p class="benefits__description">Oferecemos frete grátis para compras acima de R$ 100,00.</p>
            </div>
        </div>

        <div class="benefits__card">
            <figure class="benefits__img">
                <img src="{{ asset('images/icons/icon_offer_white.svg') }}" alt="Benefício 1">
            </figure>

            <div class="benefits__text">
                <h3 class="benefits__title">Cobrimos ofertas</h3>
                <p class="benefits__description">Encontrou um preço melhor? Nós cobrimos!</p>
            </div>
        </div>

        <div class="benefits__card">
            <figure class="benefits__img">
                <img src="{{ asset('images/icons/icon_retrieve_white.svg') }}" alt="Benefício 1">
            </figure>

            <div class="benefits__text">
                <h3 class="benefits__title">Retire na loja</h3>
                <p class="benefits__description">Retire seu pedido na loja e evite o frete.</p>
            </div>
        </div>
    </div>
</section>

<section id="products-cards" class="products">
    <div class="products__area max-width">
        @include('components.section_top', ['section_title' => 'Produtos em destaque'])
        <div id="products__content">

        </div>
    </div>
</section>

<section id="banner2">
    <div class="banner2__area max-width">
        <div id="banner2__img"></div>
    </div>
</section>

<section id="catalog">
    <div class="catalog__area max-width">
        <h2 class="catalog__title">Compre por categoria</h2>

        <div class="catalog__btn-options">
            <button class="catalog__option active">
                Vitaminas e Suplementos
                <span class="mobile-touch"></span>
            </button>
            <button class="catalog__option">
                Anticoncepcionais
                <!-- FIltrar medicamentos de cólica também -->
                <span class="mobile-touch"></span>
            </button>
            <button class="catalog__option">
                Higiene pessoal
                <span class="mobile-touch"></span>
            </button>
            <button class="catalog__option">
                Mundo infatil
                <!-- Fralda, lenço, leite, xpe -->
                <span class="mobile-touch"></span>
            </button>
            <button class="catalog__option">
                Lançamentos
                <span class="mobile-touch"></span>
            </button>
        </div>

        <div id="catalog__product-content">
            
        </div>
    </div>
</section>

<section id="banner3">
    <div class="banner3__area max-width">
        <div class="banner3__img"></div>
        <div class="banner3__img"></div>
    </div>
</section>

<section id="daily-products" class="daily">
    <div class="daily__area max-width">
        @include('components.section_top', ['section_title' => 'Promoções diárias'])
        <div id="daily__content">
            
        </div>
    </div>
</section>

@endsection

@push('scripts')
@vite([
'resources/js/pages/_home.ts',
'resources/js/components/_products_cards.ts'
])
@endpush