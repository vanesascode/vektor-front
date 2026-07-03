# --- Stage 1: build de Angular ---
FROM node:22-alpine AS build
WORKDIR /app

# pnpm vía corepack (fijado por el campo "packageManager" de package.json).
RUN corepack enable

# Capa de dependencias cacheable: solo se invalida si cambian los lockfiles.
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build --configuration production

# --- Stage 2: runtime Nginx (unprivileged, escucha en 8080) ---
FROM nginxinc/nginx-unprivileged:alpine

# La imagen oficial procesa /etc/nginx/templates/*.template con envsubst
# al arrancar; así BACKEND_URL se resuelve en runtime, no en build.
COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template

COPY --from=build /app/dist/vektor-front/browser /usr/share/nginx/html

# Valor por defecto para ejecución local con docker compose / docker run.
ENV BACKEND_URL=http://localhost:8000

EXPOSE 8080
