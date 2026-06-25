FROM php:8.3-cli-alpine

# Instala dependências do sistema necessárias para extensões PHP e ferramentas comuns
RUN apk add --no-cache \
    git \
    unzip \
    bash \
    libpng-dev \
    libzip-dev \
    oniguruma-dev \
    curl-dev

# Instala extensões do PHP necessárias para o Laravel e MySQL
RUN docker-php-ext-install pdo_mysql bcmath zip gd mbstring

# Copia o Composer oficial para dentro da imagem
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Define o diretório de trabalho dentro do container
WORKDIR /var/www

# Expõe a porta padrão que o 'artisan serve' vai usar
EXPOSE 8000

# Comando padrão para iniciar o servidor de desenvolvimento do Laravel
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]