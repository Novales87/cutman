#!/bin/sh

echo "Generando env-config.js..."

# Generar el archivo env-config.js con las variables de entorno
echo "window.env = {" > /app/dist/env-config.js
for var in $(env | grep VITE_); do
  name=$(echo "$var" | cut -d '=' -f 1)
  value=$(echo "$var" | cut -d '=' -f 2-)
  echo "  $name: \"$value\"," >> /app/dist/env-config.js
done
echo "};" >> /app/dist/env-config.js

echo "Contenido de env-config.js:"
cat /app/dist/env-config.js

echo "Iniciando la aplicación con serve..."
# Iniciar serve
exec serve -s dist
