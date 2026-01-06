# Stage 0: deps stage
FROM node:20-slim AS deps
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Stage 1: Build stage
FROM node:20-slim AS build
ARG VERSION
ARG BE_PORT
ARG GO_BE_PORT
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN echo "Building QWIK frontend v${VERSION} with backend on port ${BE_PORT}"
RUN echo "PUBLIC_BASE_URL=http://chin_plus_be:${BE_PORT}" >> /app/.env
RUN echo "PUBLIC_GO_BASE_URL=http://chin_plus_go_be:${GO_BE_PORT}" >> /app/.env
RUN echo "PUBLIC_ENV=development" >> /app/.env
RUN echo "PUBLIC_VERSION=${VERSION}" >> /app/.env

RUN npm run build.client
RUN npm run build.server

# Stage 2: Production stage
FROM node:20-slim
WORKDIR /app
# COPY --from=build /app .
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=build /app/server ./server
COPY --from=build /app/dist ./dist
COPY --from=build /app/public ./public
COPY --from=build /app/.env ./.env

EXPOSE 3000
ENTRYPOINT ["node", "server/entry.express.js"]