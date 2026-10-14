FROM node:20-bookworm-slim

ENV NODE_ENV=development
WORKDIR /app

ARG USER_ID=1000
ARG GROUP_ID=1000

# 1. Modify node user/group IDs while still root
RUN usermod -u $USER_ID node && groupmod -g $GROUP_ID node

# 2. Install system packages as root (openssl is required by Prisma)
RUN apt-get update -y \
 && apt-get install -y --no-install-recommends openssl ca-certificates \
 && rm -rf /var/lib/apt/lists/*

# 3. ENSURE the /app directory belongs to the 'node' user before switching
RUN mkdir -p /app && chown -R node:node /app

# 4. NOW switch to the non-root 'node' user
USER node

# 5. Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# 6. Setup Prisma and rest of the application
COPY prisma ./prisma
RUN npx prisma generate

COPY . .

EXPOSE 3000
CMD ["npm", "run", "dev"]