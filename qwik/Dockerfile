FROM node:slim
ARG VERSION
ARG BE_PORT
WORKDIR /app
COPY . .
RUN npm install
RUN echo "Building QWIK frontend v${VERSION} with backend on port ${BE_PORT}"
RUN echo "PUBLIC_BASE_URL=http://chin_plus_be:${BE_PORT}" >> /app/.env
RUN echo "PUBLIC_ENV=development" >> /app/.env
RUN echo "PUBLIC_VERSION=${VERSION}" >> /app/.env
RUN npm run build.client
RUN npm run build.server
ENTRYPOINT ["node", "server/entry.express.js"]
EXPOSE 3000