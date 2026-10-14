# ── base ─────────────────────────────────────────────
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm install

# ── dev (docker compose target) ──────────────────────
FROM base AS dev
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]

# ── build ────────────────────────────────────────────
FROM base AS build
COPY . .
RUN npm run build

# ── prod (used by docker-compose.prod.yml in Phase 10) ─
FROM nginx:1.27-alpine AS prod
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.spa.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]