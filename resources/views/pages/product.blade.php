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
                    <img src="{{ asset('images/icons/icon_arrow_secondary.svg') }}" alt="Seta para cima">
                    <span class="mobile-touch"></span>
                </button>

                <div id="product__nav-imgs">
                    <button class="product__img-mini active">
                        <img src="{{ asset('images/products/product_example.png') }}" alt="Imagem do produto">
                        <span class="mobile-touch"></span>
                    </button>

                    <button class="product__img-mini">
                        <img src="{{ asset('images/products/product_example2.webp') }}" alt="Imagem do produto">
                        <span class="mobile-touch"></span>
                    </button>

                    <button class="product__img-mini">
                        <img src="{{ asset('images/products/product_example.png') }}" alt="Imagem do produto">
                        <span class="mobile-touch"></span>
                    </button>

                    <button class="product__img-mini">
                        <img src="{{ asset('images/products/product_example.png') }}" alt="Imagem do produto">
                        <span class="mobile-touch"></span>
                    </button>
                </div>

                <button class="product__nav-arrow down">
                    <img src="{{ asset('images/icons/icon_arrow_secondary.svg') }}" alt="Seta para baixo">
                    <span class="mobile-touch"></span>
                </button>
            </div>

            <div id="product__img-area">
                <button id="products__like">
                    <img src="{{ asset('images/icons/icon_fav_outline.svg') }}" aria-pressed="false" alt="Ícone de favoritar">
                    <span class="mobile-touch"></span>
                </button>

                <img id="product__img" src="{{ asset('images/products/product_example.png') }}" alt="Imagem do produto">
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
                                <img src="{{ asset('images/icons/icon_star_filled.svg') }}" alt="Estrela cheia">
                                <span class="mobile-touch"></span>
                            </button>
                            <button>
                                <img src="{{ asset('images/icons/icon_star_filled.svg') }}" alt="Estrela cheia">
                                <span class="mobile-touch"></span>
                            </button>
                            <button>
                                <img src="{{ asset('images/icons/icon_star_filled.svg') }}" alt="Estrela cheia">
                                <span class="mobile-touch"></span>
                            </button>
                            <button>
                                <img src="{{ asset('images/icons/icon_star_outline.svg') }}" alt="Estrela vazia">
                                <span class="mobile-touch"></span>
                            </button>
                            <button>
                                <img src="{{ asset('images/icons/icon_star_outline.svg') }}" alt="Estrela vazia">
                                <span class="mobile-touch"></span>
                            </button>
                        </div>
                        <span id="product__reviews">(123)</span>
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
                        <span id="frete__valor">Frete: R$ 5,00</span>
                    </div>

                </div>
            </div>

            <div id="product__description">
                <span id="product__supplier">Venda e entrega por: Drogarias Camargo</span><br><br>


                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras eu elit metus. Donec vitae dapibus mauris, aliquet euismod sapien. Donec ut velit dapibus, imperdiet nulla molestie, gravida odio. Sed bibendum odio vel nisl sollicitudin scelerisque. Pellentesque varius sapien nec vulputate gravida. Curabitur vitae quam auctor, gravida metus eget, malesuada urna. Donec urna tortor, tincidunt a lectus laoreet, euismod faucibus sapien. Donec molestie augue fermentum felis commodo rhoncus. Nullam auctor tortor sapien, a aliquam mi sagittis vitae. Nunc pellentesque consequat sapien eu gravida. Donec viverra laoreet auctor. Integer sem augue, mollis sit amet venenatis vel, laoreet sit amet ipsum. Etiam gravida justo eu lectus suscipit auctor.

                Curabitur tempus ut tortor vitae vehicula. Morbi ac metus ut turpis pulvinar convallis. Donec sagittis est nec turpis suscipit, non sagittis sem rhoncus. Ut lacinia felis at aliquet aliquet. Nunc porttitor orci sed tellus convallis, non tristique tellus convallis. Sed sollicitudin dignissim luctus. Sed non nisi enim. Mauris enim eros, condimentum vitae malesuada ac, blandit et est. Nam ac tellus vel libero rutrum mollis. Mauris mollis feugiat velit. Integer convallis, ipsum sit amet sollicitudin interdum, tortor purus congue magna, et pretium nisl tellus nec enim. Proin dignissim posuere diam ac consequat.

                Quisque feugiat justo efficitur, imperdiet purus vel, fringilla sapien. In quis malesuada diam. Maecenas suscipit, turpis ac posuere elementum, lacus dui dignissim justo, et elementum est orci nec dolor. Donec congue eu ante eget finibus. Suspendisse elementum faucibus orci. Nunc commodo diam tristique dolor accumsan, a feugiat metus dapibus. Aliquam ut tellus auctor urna convallis scelerisque. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Praesent suscipit malesuada ultricies. Curabitur augue felis, tincidunt blandit dolor id, fringilla lacinia libero. Nulla sit amet auctor neque. Quisque ultrices nunc quis odio feugiat, non hendrerit arcu gravida. Cras sit amet mattis purus. Sed maximus commodo turpis, eu aliquet sapien ornare iaculis. Nam condimentum ullamcorper ante, id feugiat ipsum aliquet eget.
            </div>

        </div>
    </div>
</section>

<section id="related">
    <div id="related__area" class="max-width">
        @include('components.section_top', ['section_title' => 'Produtos semelhantes'])
        <div id="related__content">
            @include('components.products_cards')
        </div>
    </div>
</section>
@endsection

@push('scripts')
@vite(['resources/js/pages/_product.ts', 'resources/js/components/_products_cards.ts'])
@endpush