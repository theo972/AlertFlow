FROM php:8.3-cli
RUN apt-get update && apt-get install -y git unzip libpq-dev && docker-php-ext-install pdo pdo_pgsql
WORKDIR /app
COPY . .
# Composer local rapide
RUN php -r "copy('https://getcomposer.org/installer','composer-setup.php');" \
 && php composer-setup.php --install-dir=/usr/local/bin --filename=composer \
 && composer install --prefer-dist --no-interaction || true
EXPOSE 8080
CMD ["php","-S","0.0.0.0:8080","-t","public"]
