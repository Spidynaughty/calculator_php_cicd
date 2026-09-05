# Use official PHP image with Apache built in
FROM php:8.2-apache

# Enable Apache mod_rewrite (handy if you add routing later)
RUN a2enmod rewrite

# Copy project files into Apache's web root
COPY . /var/www/html/

# Set proper ownership and permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html

# Apache listens on port 80 by default
EXPOSE 80

# Default command already starts Apache in the base image
CMD ["apache2-foreground"]