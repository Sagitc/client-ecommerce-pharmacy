@extends('layouts.app')

@section('title', 'Resultados para "' . e(request('product_name')) . '" | Drogarias Camargo')

@push('styles')
    @vite('resources/css/pages/search.css')
@endpush

@section('content')

    <div id="search-info" role="region" aria-labelledby="search-info__title">
        <div class="max-width" id="search-info__content">
            <div id="search-info__heading-wrapper">
                <h1 id="search-info__title" data-query-string="{{ request('product_name') }}">Resultados para "{{ request('product_name') }}"</h1>
                <span id="search-info__count"></span>
            </div>

            <button id="mobile-filter">Filtrar</button>
        </div>
    </div>

    <section id="result" aria-label="Resultados da busca">
        <div id="result__area" class="max-width">

            <div id="result__filter-box" aria-label="Filtros de busca">
                <div class="dragIcon__filter-wrapper">
                    <div class="dragIcon__filter"></div>
                    <div class="mobile-touch"></div>
                </div>

                <div id="result__filter" class="filter-box__area">
                    <div class="result__heading">
                        <h3 class="result__heading-title" id="filter-title">Filtro</h3>
                        <button class="result__heading-btn" aria-expanded="true" aria-controls="filter__content" aria-label="Expandir filtro de relevância">
                            <img src="{{ asset('images/icon_arrow-down_secondary.svg') }}" alt="">
                            <span class="mobile-touch"></span>
                        </button>
                    </div>
                    <div id="filter__content" aria-labelledby="filter-title">
                        <select name="filter__options" id="filter__options">
                            <option value="views" selected>Mais relevantes</option>
                            <option value="price_low">Menor preço</option>
                            <option value="price_high">Maior preço</option>
                            <option value="selling">Mais vendidos</option>
                        </select>
                    </div>
                </div>

                <div id="result__laboratory" class="filter-box__area">
                    <div class="result__heading">
                        <h3 class="result__heading-title" id="laboratory-title">Laboratório</h3>
                        <button class="result__heading-btn" aria-expanded="true" aria-controls="laboratory__content" aria-label="Expandir filtro de laboratório">
                            <img src="{{ asset('images/icon_arrow-down_secondary.svg') }}" alt="">
                            <span class="mobile-touch"></span>
                        </button>
                    </div>
                    <div id="laboratory__content" aria-labelledby="laboratory-title">
                        <div class="laboratory__checkbox">
                            <input type="checkbox" id="lab1" name="lab1">
                            <label for="lab1">Laboratório 1</label>
                        </div>
                    </div>
                </div>

                <div id="result__filters-created">
                    
                </div>

                <div id="result__price" class="filter-box__area">
                    <div class="result__heading">
                        <h3 class="result__heading-title" id="price-title">Preço</h3>
                        <button class="result__heading-btn" aria-expanded="true" aria-controls="price__content" aria-label="Expandir filtro de preço">
                            <img src="{{ asset('images/icon_arrow-down_secondary.svg') }}" alt="">
                            <span class="mobile-touch"></span>
                        </button>
                    </div>
                    <div id="price__content" aria-labelledby="price-title">
                        <div class="price__input-area">
                            <label for="min-price">Mínimo</label>
                            <input type="number" class="price__input" id="min-price" name="min-price" placeholder="R$ 0,00" aria-label="Preço mínimo">
                        </div>
                        <div class="price__input-area">
                            <label for="max-price">Máximo</label>
                            <input type="number" class="price__input" id="max-price" name="max-price" placeholder="R$ 0,00" aria-label="Preço máximo">
                        </div>
                    </div>
                </div>
            </div>

            <div id="result__cards-wrapper">
                <div id="result__cards" aria-live="polite">
                    
                </div>

                <div id="result__nav" aria-label="Paginação dos resultados">
                    <button class="result__nav-btn" id="nav__prev" disabled aria-disabled="true" aria-label="Página anterior">
                        Anterior
                        <span class="mobile-touch"></span>
                    </button>
                    <div id="result__nav-pagination">
                        <!-- <button class="result__nav-page active" aria-current="page">
                            1
                            <span class="mobile-touch"></span>
                        </button> -->
                    </div>
                    <button class="result__nav-btn" id="nav__next" aria-label="Próxima página">
                        Próximo
                        <span class="mobile-touch"></span>
                    </button>
                </div>
            </div>

        </div>
    </section>


@endsection

@push('scripts')
    @vite([
        'resources/js/pages/_search.ts',
        'resources/js/components/_products_cards.ts'
    ])
@endpush