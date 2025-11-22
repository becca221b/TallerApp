FROM node:22-alpine AS builder

# Set working directory
WORKDIR /app

# Copy root dependency manifests (npm workspaces)
COPY package*.json ./
COPY package-lock.json* ./
COPY tsconfig.json ./

# Copy workspace manifests for caching
RUN mkdir -p domain apps/frontend
COPY domain/package*.json ./domain/
COPY domain/tsconfig.json ./domain/
COPY apps/frontend/package*.json ./apps/frontend/
COPY apps/frontend/tsconfig.json ./apps/frontend/

# Install all workspace dependencies
RUN npm install

# Copy full sources
COPY domain ./domain
COPY apps/frontend ./apps/frontend

# Build shared domain first
RUN npm run build:domain

# Build the frontend
WORKDIR /app/apps/frontend
RUN npm run build

# Production stage
FROM nginx:alpine
COPY apps/frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/apps/frontend/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]