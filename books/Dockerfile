# 1st stage
FROM golang:1.22-alpine AS build
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN go build -o main .

# 2nd stage
FROM alpine:latest
ARG MONGO_URI
ARG DB_NAME
ARG CHECK_WORD_API
ARG VERSION
COPY --from=build /app/main /app/main
EXPOSE 12000
ENTRYPOINT ["/app/main"]
