FROM php:8.2-apache

# Install PDO PostgreSQL driver (since backend connects to Supabase)
RUN apt-get update && apt-get install -y libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Enable Apache rewrite module for handling .htaccess rewrites
RUN a2enmod rewrite

# Allow Apache to read and apply .htaccess rewrite overrides
RUN sed -i 's/AllowOverride None/AllowOverride All/g' /etc/apache2/apache2.conf

# Set working directory to the Apache web root
WORKDIR /var/www/html

# Copy the backend files to the container
COPY . /var/www/html/

# Grant www-data (Apache user) ownership of the files so it can read/write to the uploads folder
RUN chown -R www-data:www-data /var/www/html

# Expose port 80 for Render Web Service
EXPOSE 80
