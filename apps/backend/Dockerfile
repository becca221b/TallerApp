FROM node:22-alpine

WORKDIR /app

# Copy root dependency manifests (leverages npm workspaces)
COPY package*.json ./
COPY package-lock.json* ./
COPY tsconfig.json ./

# Copy workspace manifests for better layer caching
RUN mkdir -p domain apps/backend
COPY domain/package*.json ./domain/
COPY domain/tsconfig.json ./domain/
COPY apps/backend/package*.json ./apps/backend/
COPY apps/backend/tsconfig.json ./apps/backend/

# Install all workspace dependencies
RUN npm install

# Copy full sources for domain and backend
COPY domain ./domain
COPY apps/backend ./apps/backend

# Build the shared domain package once (clean dist + build)
RUN rm -rf /app/domain/dist /app/domain/tsconfig.tsbuildinfo && npm run build:domain

# Build the backend application
WORKDIR /app/apps/backend
RUN npm run build

# Expose the application port
EXPOSE 3000

# Start the application with path aliases enabled
CMD ["node", "-r", "tsconfig-paths/register", "dist/server.js"]
