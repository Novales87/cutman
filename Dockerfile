# Etapa de construcción
FROM node:18 AS builder

WORKDIR /app

# Copiar archivos de dependencias y instalar
COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile

# Copiar el código fuente y construir la aplicación
COPY . .
RUN npm run build

# Etapa de producción con Nginx
FROM nginx:alpine

# Copiar configuración de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar los archivos generados en la build
COPY --from=builder /app/dist /usr/share/nginx/html

# Exponer el puerto 80
EXPOSE 80

# Iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
