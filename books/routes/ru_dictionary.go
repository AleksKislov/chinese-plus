package routes

import (
	ruDictionary "books/handlers/ru_dictionary"

	"github.com/gofiber/fiber/v2"
)

// SetupHomeRoutes sets up routes for the home page
func SetupRuDictRoutes(app *fiber.App) {
	app.Get("/api/ru_word/:word", ruDictionary.GetWord)
}
