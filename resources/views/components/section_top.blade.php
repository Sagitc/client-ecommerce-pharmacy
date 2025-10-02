<div class="products__top">
    <h2 class="products__section-title">{{ $section_title }}</h2>

    <div class="products__nav" role="navigation" aria-label="Navegação entre os produtos">
        <button disabled class="products__btn-nav products__btn-prev" aria-label="Botão para navegar para os produtos anteriores">
            <img src="{{ asset('images/icons/icon_arrow_secondary.svg') }}" alt="Ícone de seta para esquerda">
            <span class="mobile-touch"></span>
        </button>

        <button class="products__btn-nav products__btn-next" aria-label="Botão para navegar para os próximos produtos">
            <img src="{{ asset('images/icons/icon_arrow_secondary.svg') }}" alt="Ícone de seta para direita">
            <span class="mobile-touch"></span>
        </button>
    </div>
</div>

@vite('resources/js/components/_section-top.ts')