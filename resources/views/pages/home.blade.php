@extends('layouts.app')

@section('title', 'Drogarias Camargo | Home')

@push('styles')
    @vite('resources/css/pages/home.css')
@endpush

@section('content')

<section id="main-banner">
    <div class="banner1__area max-width">
        <div id="banner1__img"></div>
    </div>
</section>

<section id="benefits">
    <div class="benefits__content max-width">
        <div class="benefits__card">
            <figure class="benefits__img">
                <img src="{{ asset('images/icon_cardPayment_white.svg') }}" alt="Benefício 1">
            </figure>

            <div class="benefits__text">
                <h3 class="benefits__title">Parcelamento</h3>
                <p class="benefits__description">Parcelamos suas compras em até 6x sem juros no cartão.</p>
            </div>
        </div>

        <div class="benefits__card">
            <figure class="benefits__img">
                <img src="{{ asset('images/icon_delivery_white.svg') }}" alt="Benefício 1">
            </figure>

            <div class="benefits__text">
                <h3 class="benefits__title">Frete grátis</h3>
                <p class="benefits__description">Oferecemos frete grátis para compras acima de R$ 100,00.</p>
            </div>
        </div>

        <div class="benefits__card">
            <figure class="benefits__img">
                <img src="{{ asset('images/icon_offer_white.svg') }}" alt="Benefício 1">
            </figure>

            <div class="benefits__text">
                <h3 class="benefits__title">Cobrimos ofertas</h3>
                <p class="benefits__description">Encontrou um preço melhor? Nós cobrimos!</p>
            </div>
        </div>

        <div class="benefits__card">
            <figure class="benefits__img">
                <img src="{{ asset('images/icon_retrieve_white.svg') }}" alt="Benefício 1">
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
        <div class="products__content">
            @include('components.products_cards')
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
                Dor de cabeça
                <span class="mobile-touch"></span>
            </button>
            <button class="catalog__option">
                Dor muscular
                <span class="mobile-touch"></span>
            </button>
            <button class="catalog__option">
                Cólica
                <span class="mobile-touch"></span>
            </button>
            <button class="catalog__option">
                Gripe e catarro
                <span class="mobile-touch"></span>
            </button>
            <button class="catalog__option">
                Febre
                <span class="mobile-touch"></span>
            </button>
            <button class="catalog__option">
                Dor na garganta
                <span class="mobile-touch"></span>
            </button>
        </div>

        <div class="catalog__product-content">
            @include('components.products_cards')
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
        <div class="daily__content">
            @include('components.products_cards')
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