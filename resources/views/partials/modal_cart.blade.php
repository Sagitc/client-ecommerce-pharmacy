<div class="modal__container">
  <div class="modal">
    <div class="modal__header-close-btn">
      <button aria-label="Fechar" class="modal__close-btn">
        <svg aria-label="Ícone de X" fill="currentColor" viewBox="0 0 24 24" width="24" height="24">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
        </svg>
        <span class="mobile-touch"></span>
      </button>
    </div>
    <div class="modal__header">
      <span class="modal__title"><strong>Cesta</strong></span>
      <span class="modal__item-count">0 itens</span>
    </div>
    <div class="modal__body">
      <div class="modal__item-card">
        <div class="item-card__image-wrapper">
          <img src="{{ asset('images/item.png') }}" alt="Transmissor Medtronic" class="item-card__image">
        </div>
        <div class="item-card__details">
          <div class="item-card__info">
            <span class="item-card__name">Transmissor Medtronic Guardian Link 3 BLE-...</span>
            <span class="item-card__brand">Medtronic</span>
          </div>
          <button aria-label="Remover item" class="item-card__delete-btn">
            <svg fill="currentColor" viewBox="0 0 24 24" width="24" height="24">
              <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zm2.46-7.12l1.41-1.41L12 12.59l2.12-2.12 1.41 1.41L13.41 14l2.12 2.12-1.41 1.41L12 15.41l-2.12 2.12-1.41-1.41L10.59 14l-2.13-2.12zM15.5 4l-1-1h-3l-1 1H5v2h14V4z" />
            </svg>
          </button>
        </div>
        <div class="item-card__bottom">
          <span class="item-card__price">R$ 3770,00</span>
          <div class="item-card__quantity">
            <input type="number" value="1" min="1">
            <svg class="quantity__icon" fill="currentColor" viewBox="0 0 24 24" width="24" height="24">
              <path d="M7 10l5 5 5-5z" />
            </svg>
          </div>
        </div>
      </div>
      <p>Seu carrinho está vazio.</p>
    </div>
    <div class="modal__footer">
      <button class="modal__checkout-btn">Finalizar Compra</button>
    </div>
  </div>
</div>