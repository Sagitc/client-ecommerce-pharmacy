<div class="modal-login">
    <div class="modal-login__container">

        <div class="modal-login__close">
            <button id="modal-login__close-btn" aria-label="Fechar modal">&times;</button>
        </div>

        <div class="modal-login__body">
            <div class="modal-login__left">

                <h2 class="modal-login__title">Login</h2>

                <div class="modal-login__social">
                    <button class="modal-login__social__item">
                        <img src="{{ asset('images/icon_google.svg') }}" alt="Google">
                    </button>
                    <button class="modal-login__social__item">
                        <img src="{{ asset('images/icon_facebook.svg') }}" alt="Facebook">
                    </button>
                    <button class="modal-login__social__item">
                        <img src="{{ asset('images/icon_twitter.svg') }}" alt="Twitter">
                    </button>
                </div>

                <form id="signIn__form" action="" method="get">
                    @csrf

                    <span>Entre com o seu e-mail ou CPF</span>

                    <input type="text" name="email" id="signIn__user" class="modal-login__input"
                        placeholder="Email ou CPF" required>

                    <input type="password" name="password" id="signIn__password" class="modal-login__input"
                        placeholder="Senha" required>

                    <a id="signIn__forgot">Esqueceu a senha?</a>

                    <button type="submit" class="signIn__submit">Login</button>
                </form>

            </div>

            <div class="modal-login__right">
                <h2 class="modal-login__title">Seja bem-vindo(a)!</h2>

                <span>Novo(a) por aqui? É bom ter você conosco</span>
                <span>Cadastre-se em nosso site!</span>

                <button class="signIn__submit">Cadastrar</button>
            </div>
        </div>
    </div>
</div>


<!-- 

    <form method="POST" class="modal-login__form">
                @csrf
                <div class="modal-login__field">
                    <label for="email" class="modal-login__label">Email:</label>
                    <input type="email" id="email" name="email" class="modal-login__input" required>
                </div>
                <div class="modal-login__field">
                    <label for="password" class="modal-login__label">Password:</label>
                    <input type="password" id="password" name="password" class="modal-login__input" required>
                </div>
                <button type="submit" class="modal-login__submit">Login</button>
            </form>

 -->