<div class="modal__container" role="dialog" aria-modal="true" aria-labelledby="modal__title">
  <div class="modal" aria-describedby="Área do carrinho de compras">

    <div class="modal__header-close-btn">
      <button aria-label="Fechar" class="modal__close-btn">
        <svg aria-label="Ícone de X" fill="currentColor" viewBox="0 0 24 24" width="24" height="24">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
        </svg>
      </button>
    </div>

    <!-- MODAL'S HEADER -->
    <div class="modal__header">
      <span class="modal__title">Cesta</span>
      <span class="modal__item-count">0 itens</span>
    </div>

    <!-- MODAL'S BODY -->
    <div class="modal__body">

      <div class="modal__item-card">

        <!-- ITEM'S CONTENT -->
        <div class="item-card__details">

          <div class="item-card__image-wrapper">
            <img src="{{ asset('images/product_example.png') }}" alt="Transmissor Medtronic" class="item-card__image">
          </div>

          <div class="item-card__info">
            <span class="item-card__name">Algum produto comprado de exemplo...</span>
            <span class="item-card__brand">CIMED</span>
          </div>

          <button aria-label="Remover item" class="item-card__delete-btn">
            <img src="{{ asset('images/icon_trash_black.svg') }}" alt="Ícone de remover item">
          </button>

        </div>


        <!-- ITEM'S BOTTOM -->
        <div class="item-card__bottom">

          <span class="item-card__price">R$ 3.770,00</span>
          <div class="item-card__quantity" role="button">
            <span class="quantity__value">1</span>
            <svg aria-label="Ícone de quantidade" class="quantity__icon" fill="currentColor" viewBox="0 0 24 24" width="24" height="24">
              <path d="M7 10l5 5 5-5z" />
            </svg>
          </div>

        </div>
      </div>

      <!-- <p>Seu carrinho está vazio.</p> -->

    </div>

    <!-- MODAL'S FOOTER -->
    <div class="modal__footer">

      <div class="modal__subtotal">
        <span>Subtotal:</span>
        <span class="modal__subtotal-value">R$ 3.770,00</span>
      </div>

      <button class="modal__checkout-btn">Conferir cesta</button>
      
    </div>
  </div>
</div>