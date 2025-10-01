@extends('layouts.app')

@section('title', 'Título do produto aqui | Drogarias Camargo')

@push('styles')
@vite('resources/css/pages/product.css')
@endpush

@section('content')
<section id="product">
    <div id="product__area" class="max-width">
        <div id="product__left">
            <div id="product__nav-area">
                <button class="product__nav-arrow up">
                    <img src="{{ asset('images/icon_arrow_secondary.svg') }}" alt="Seta para cima">
                </button>

                <div id="product__nav-imgs">
                    <button class="product__img-mini">
                        <img src="{{ asset('images/product_example.png') }}" alt="Imagem do produto">
                    </button>

                    <button class="product__img-mini">
                        <img src="{{ asset('images/product_example.png') }}" alt="Imagem do produto">
                    </button>

                    <button class="product__img-mini">
                        <img src="{{ asset('images/product_example.png') }}" alt="Imagem do produto">
                    </button>

                    <button class="product__img-mini">
                        <img src="{{ asset('images/product_example.png') }}" alt="Imagem do produto">
                    </button>
                </div>

                <button class="product__nav-arrow down">
                    <img src="{{ asset('images/icon_arrow_secondary.svg') }}" alt="Seta para baixo">
                </button>
            </div>

            <div id="product__img-area">
                <button id="products__like">
                    <img src="{{ asset('images/icon_fav_outline.svg') }}" aria-pressed="false" alt="Ícone de favoritar">
                    <span class="mobile-touch"></span>
                </button>

                <img id="product__img" src="{{ asset('images/product_example.png') }}" alt="Imagem do produto">
            </div>
        </div>

        <div id="product__right">
            <div id="product__heading">
                <h1 id="product__title">Título do Produto aqui</h1>
                <div id="product__info-area">
                    <span>MARCA | SKU: 0000 | GRAMATURA</span>
                    <div id="product__avaliation">
                        <div id="product__avaliation-stars">
                            <button>
                                <img src="{{ asset('images/icon_star_filled.svg') }}" alt="Estrela cheia">
                                <span class="mobile-touch"></span>
                            </button>
                            <button>
                                <img src="{{ asset('images/icon_star_filled.svg') }}" alt="Estrela cheia">
                                <span class="mobile-touch"></span>
                            </button>
                            <button>
                                <img src="{{ asset('images/icon_star_filled.svg') }}" alt="Estrela cheia">
                                <span class="mobile-touch"></span>
                            </button>
                            <button>
                                <img src="{{ asset('images/icon_star_outline.svg') }}" alt="Estrela vazia">
                                <span class="mobile-touch"></span>
                            </button>
                            <button>
                                <img src="{{ asset('images/icon_star_outline.svg') }}" alt="Estrela vazia">
                                <span class="mobile-touch"></span>
                            </button>
                        </div>
                        <span>(123 avaliações)</span>
                    </div>
                </div>
            </div>

            <div id="product__action">
                <div id="product__buy">
                    <div id="product__numbers">
                        <span id="product__price">R$ 12,90</span>

                        <input type="text" id="quantity__input" value="1" aria-label="Quantidade do produto">
                    </div>

                    <button id="product__btn-buy">
                        Comprar
                        <span class="mobile-touch"></span>
                    </button>
                </div>

                <div id="product__address">
                    <div id="address__info">
                        <label for="address__cep">Insira o seu cep:</label>
                        <input type="text" name="address__cep" id="address__cep" placeholder="00.000-000" aria-label="Campo para digitar o CEP">
                    </div>

                </div>
            </div>

            <div id="product__description">
                <span id="product__supplier">Venda e entrega por: Drogarias Camargo</span>

            </div>

        </div>
    </div>
</section>
@endsection

@push('scripts')
@vite('resources/js/pages/_product.ts')
@endpush