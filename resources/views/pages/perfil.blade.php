@extends('layouts.app')

@section('title', 'Meu Perfil | Drogarias Camargo')

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
            <button class="info__option-btn">
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
            <div id="info__resume">
                <div id="resume__latest" class="box">

                </div>
                <div id="resume__right">
                    <div id="resume__address" class="box">

                    </div>

                    <div id="resume__credit" class="box">

                    </div>
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