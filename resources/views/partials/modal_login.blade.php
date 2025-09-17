<div id="modal-login" class="is-disabled" aria-hidden="true" role="dialog" aria-modal="true">
    <div class="modal-login__container">

        <div class="modal-login__body">
            <div class="modal-login__wrapper1 is-disabled" aria-hidden="true">
                <div class="modal-login__left l_pt1">
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

                        <input type="text" name="user" id="signIn__user" class="modal-login__input"
                            placeholder="E-mail ou CPF" required>

                        <input type="password" name="password" id="signIn__password" class="modal-login__input"
                            placeholder="Senha" required>

                        <button class="forgot-password">Esqueceu a senha?</button>

                        <button type="submit" class="form__submit">Login</button>
                    </form>

                </div>

                <div class="modal-login__right r_pt1 is-red">
                    <div class="modal-login__close">
                        <button class="modal-login__close-btn" aria-label="Fechar modal">&times;</button>
                    </div>

                    <h2 class="modal-login__title">Seja bem-vindo(a)!</h2>

                    <span>Novo(a) por aqui? É bom ter você conosco</span>
                    <span>Cadastre-se em nosso site!</span>

                    <button class="signUp__btn">Cadastrar</button>

                </div>
            </div>

            <div class="modal-login__wrapper2 is-disabled" aria-hidden="true">
                <div class="modal-login__left l_pt2 is-red">
                    <h2 class="modal-login__title">É bom te ver de novo!</h2>

                    <span>Já tem uma conta cadastrada conosco?</span>
                    <span>Faça o seu login!</span>

                    <button class="signIn__btn">LOGIN</button>

                </div>

                <div class="modal-login__right r_pt2">
                    <div class="modal-login__close">
                        <button class="modal-login__close-btn" aria-label="Fechar modal">&times;</button>
                    </div>

                    <h2 class="modal-login__title">Cadastro</h2>

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

                    <form id="signUp__form" action="" method="post">
                        @csrf

                        <input type="text" name="full_name" id="signUp__user" class="modal-login__input"
                            placeholder="Nome e sobrenome" required>

                        <div class="modal__input-wrapper">
                            <input type="password" name="password" id="signUp__password" class="modal-login__input_2"
                                placeholder="Senha" required>

                            <input type="password" name="password_confirmation" id="signUp__password_confirmation"
                                class="modal-login__input_2" placeholder="Confirmar senha" required>
                        </div>

                        <div class="modal__input-wrapper">
                            <input type="text" name="CPF" id="signUp__CPF" class="modal-login__input_2"
                                placeholder="CPF" required>

                            <input type="tel" name="Tel" id="signUp__tel" class="modal-login__input_2"
                                placeholder="Telefone" required>
                        </div>

                        <input type="text" name="email" id="signUp__email" class="modal-login__input"
                            placeholder="Email" required>

                        <button type="submit" class="form__submit">Cadastrar</button>
                    </form>

                </div>
            </div>

            <div class="modal-login__wrapper3 is-disabled" aria-hidden="true">
                <div class="modal-login__mobile">
                    <div class="modal-login__close">
                        <button class="modal-login__close-btn" aria-label="Fechar modal">&times;</button>
                    </div>

                    <div class="modal-mobile__logo"><img src="{{ asset('images/logo_red.svg') }}" alt="Logo da farmácia"></div>

                    <div class="modal-mobile__options">
                        <button class="modal-mobile__option-btn is-active" id="mobile__signIn">Login</button>
                        <button class="modal-mobile__option-btn" id="mobile__signUp">Cadastro</button>
                    </div>

                    <form id="form-signIn__mobile" action="" method="post" aria-hidden="true">
                        @csrf

                        <input type="text" name="signIn-user" id="mobile-signIn_user" class="modal-login__input"
                            placeholder="E-mail ou CPF" required>

                        <input type="password" name="signIn-password" id="mobile-signIn_password" class="modal-login__input"
                            placeholder="Senha" required>

                        <button class="forgot-password">Esqueceu a senha?</button>

                        <button type="submit" class="form__submit">Enviar</button>
                    </form>

                    <form id="form-signUp__mobile" action="" method="post" aria-hidden="true" class="is-disabled">
                        @csrf

                        <input type="text" name="mobile__signUp__user" id="mobile-signUp__user" class="modal-login__input"
                            placeholder="E-mail ou CPF" required>

                        <div class="modal__input-wrapper">
                            <input type="password" name="mobile__signUp__password" id="mobile-signUp__password" class="modal-login__input_2"
                                placeholder="Senha" required>

                            <input type="password" name="mobile__signUp__password-confirmation" id="mobile-signUp__password-confirmation" class="modal-login__input_2"
                                placeholder="Confirmar senha" required>
                        </div>

                        <div class="modal__input-wrapper">
                            <input type="text" name="mobile__signUp__CPF" id="mobile-signUp__CPF" class="modal-login__input_2"
                                placeholder="CPF" required>

                            <input type="text" name="mobile__signUp__tel" id="mobile-signUp__tel" class="modal-login__input_2"
                                placeholder="Telefone" required>
                        </div>

                        <input type="email" name="mobile__signUp__email" id="mobile-signUp__email" class="modal-login__input"
                            placeholder="Email" required>

                        <button type="submit" class="form__submit">Cadastrar</button>
                    </form>

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
                </div>

            </div>

            <div class="modal-login__wrapper4 is-disabled" aria-hidden="true">
                <div class="modal-login__forgot">
                    <div class="modal-login__close">
                        <button class="modal-login__close-btn" aria-label="Fechar modal">&times;</button>
                    </div>

                    <div class="modal-mobile__logo"><img src="{{ asset('images/logo_white.svg') }}" alt=""></div>

                    <div class="modal-login__forgot-content">
                        <h2>Se esqueceu da senha?</h2>

                        <span>Não tem problema, iremos te ajudar a <br>
                        recuperar sua conta!</span>

                        <input type="text" name="forgot__cpf-user" id="forgot__cpf-user" class="modal-login__input"
                            placeholder="Seu CPF" required>

                        <button>
                            Resetar senha
                            <span class="mobile-touch"></span>
                        </button>
                        
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>