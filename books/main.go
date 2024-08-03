package main

import (
	"books/db"
	"books/routes"
	"net/http"
	"sync"

	"context"
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo"
)

func main() {
	envErr := godotenv.Load()
	if envErr != nil {
		log.Print("NO ENV VARS", envErr)
	}

	log.Print("VERSION ", os.Getenv("VERSION"))

	db, err := db.GetMongoSingleton()
	if err != nil {
		log.Fatal("[ERR] NO DB CONNECTION")
	}

	app := fiber.New()

	routes.SetupRuDictRoutes(app)

	// Channel to listen for termination signals
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)

	var wg sync.WaitGroup
	wg.Add(1)

	go gracefulShotdown(quit, app, db, &wg)

	log.Println("Starting server on :12000")
	if err := app.Listen(":12000"); err != nil && err != http.ErrServerClosed {
		log.Fatalf("Could not listen on :12000: %v", err)
	}

	wg.Wait()
	log.Println("Exiting main()")
}

func gracefulShotdown(quit <-chan os.Signal, app *fiber.App, db *mongo.Client, wg *sync.WaitGroup) {
	defer wg.Done()
	sig := <-quit
	log.Printf("Received signal: %s", sig)
	log.Println("Shutting down server...")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := app.Shutdown(); err != nil {
		log.Fatalf("Server forced to shutdown: %v", err)
	}

	if err := db.Disconnect(ctx); err != nil {
		log.Fatalf("MongoDB client forced to disconnect: %v", err)
	}

	log.Println("Server exiting")
}
