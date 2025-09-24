@extends('layouts.app')

@section('title', 'Drogarias Camargo | Home')

@push('styles')
    <link rel="stylesheet" href="{{ Vite::asset('resources/css/pages/home.css') }}">
@endpush

@section('content')
    <section id="main-banner" class="banner1 max-width">
        <div class="banner1__area"></div>
    </section>

    <section id="benefits" class="benefits">
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

    @include('partials.products_cards')

    

@endsection

@section('footer')
    @include('partials.footer')
@endsection
