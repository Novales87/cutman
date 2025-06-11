#!/bin/sh

echo "Generando env-config.js..."

# Generar el archivo env-config.js con las variables de entorno
echo "window.env = {" > /usr/share/nginx/html/env-config.js
for var in $(env | grep VITE_); do
  name=$(echo "$var" | cut -d '=' -f 1)
  value=$(echo "$var" | cut -d '=' -f 2-)
  echo "  $name: \"$value\"," >> /usr/share/nginx/html/env-config.js
done
echo "};" >> /usr/share/nginx/html/env-config.js

echo "Contenido de env-config.js:"
cat /usr/share/nginx/html/env-config.js

echo "Iniciando Nginx..."
# Iniciar Nginx
exec nginx -g "daemon off;"
