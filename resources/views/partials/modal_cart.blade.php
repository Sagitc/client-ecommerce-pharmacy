<div id="modal__container" class="is-disabled @auth logged @else not-logged @endauth" role="dialog" aria-modal="true" aria-labelledby="modal__title">
  <div class="modal" aria-describedby="Área do carrinho de compras">

    <div class="modal__header-close-btn">
      <button aria-label="Fechar" class="modal__close-btn">
        <svg aria-label="Ícone de X" fill="currentColor" viewBox="0 0 24 24" width="24" height="24">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
        </svg>
      </button>
    </div>

    @guest
      <div class="modal__guest-message">
        <span class="modal__guest-text">Para adicionar itens à cesta, faça <br>login ou crie uma conta.</span>
      </div>
    @endguest

    @auth
      <!-- MODAL'S HEADER -->
      <div class="modal__header">
        <span class="modal__title">Cesta</span>
        <span class="modal__item-count">0 itens</span>
      </div>

      <!-- MODAL'S BODY -->
      <div class="modal__body">

        

      </div>

      <!-- MODAL'S FOOTER -->
      <div class="modal__footer">

        <div class="modal__subtotal">
          <span>Subtotal:</span>
          <span class="modal__subtotal-value">R$ 3.770,00</span>
        </div>

        <button class="modal__checkout-btn">Ir para o checkout</button>

      </div>
    @endauth


  </div>
</div>