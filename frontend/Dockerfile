# Stage 1: Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency configs first for isolated container caching
COPY package*.json ./
RUN npm install

# Copy source files and build
COPY . .
RUN npm run build

# Stage 2: Serve stage
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]