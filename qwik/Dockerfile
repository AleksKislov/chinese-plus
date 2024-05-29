# Stage 1: Build stage
FROM node:20-slim AS build
ARG VERSION
ARG BE_PORT
ARG GO_BE_PORT
WORKDIR /app
COPY . .
RUN npm config set registry http://r.cnpmjs.org
RUN npm install
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
COPY --from=build /app .
EXPOSE 3000
ENTRYPOINT ["node", "server/entry.express.js"]