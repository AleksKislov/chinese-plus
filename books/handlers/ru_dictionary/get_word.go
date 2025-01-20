package ruDictionary

import (
	"books/db"
	"books/models"
	"context"
	"encoding/json"
	"io"
	"log"
	"net/http"
	"net/url"
	"os"
	"time"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type PossibleWord struct {
	Value      string `json:"value"`
	CanBeFound bool   `json:"canBeFound"`
}

type RuWordResponse struct {
	Word  *models.RuWord `json:"word"`
	Other []PossibleWord `json:"other"`
}

type CheckRuWordResponse struct {
	Matches []Match `json:"matches"`
}

type Match struct {
	Message      string        `json:"message"`
	ShortMessage string        `json:"shortMessage"`
	Replacements []Replacement `json:"replacements"`
}

type Replacement struct {
	Value string `json:"value"`
}

func GetWord(c *fiber.Ctx) error {
	db, mongoErr := db.GetMongoSingleton()
	if mongoErr != nil {
		log.Fatal("[ERR] NO DB CONNECTION")
	}

	wordParam, queryErr := url.QueryUnescape(c.Params("word"))
	if queryErr != nil {
		log.Printf("Error decoding URL-encoded string: %v", queryErr)
		return c.SendStatus(fiber.StatusInternalServerError)
	}

	ruWords := db.Database(os.Getenv("DB_NAME")).Collection("russianwords")
	filter := bson.M{"ru": wordParam}

	response := RuWordResponse{
		Word:  nil,
		Other: []PossibleWord{},
	}

	var ruWord models.RuWord
	err := ruWords.FindOne(context.Background(), filter).Decode(&ruWord)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			possibleWords, _ := checkRuWord(wordParam)
			checkWordsAndUpdate(&possibleWords, ruWords)
			response.Other = possibleWords
		}
	} else {
		response.Word = &ruWord
	}
	log.Print(response)

	jsonResponse, err := json.Marshal(response)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).SendString(err.Error())
	}

	c.Set(fiber.HeaderContentType, fiber.MIMEApplicationJSON)

	return c.Type("json").Status(fiber.StatusOK).Send(jsonResponse)
}

func checkRuWord(text string) ([]PossibleWord, error) {
	form := url.Values{}
	form.Add("text", text)
	form.Add("language", "ru-RU")
	var result = make([]PossibleWord, 10)

	resp, err := http.PostForm(os.Getenv("CHECK_WORD_API"), form)
	if err != nil {
		return result, err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return result, err
	}

	var parsed CheckRuWordResponse
	err = json.Unmarshal(body, &parsed)
	if err != nil {
		return result, err
	}

	// Limit replacements to 10 if there are more
	if len(parsed.Matches) > 0 {
		// Limit replacements to 10 if there are more
		if len(parsed.Matches[0].Replacements) > 10 {
			parsed.Matches[0].Replacements = parsed.Matches[0].Replacements[:10]
		}

		for ind, wordObj := range parsed.Matches[0].Replacements {
			result[ind].Value = wordObj.Value
			result[ind].CanBeFound = false
		}
	}

	return result, nil
}

func checkWordsAndUpdate(items *[]PossibleWord, ruWords *mongo.Collection) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Extract all values to be checked
	values := make([]string, len(*items))
	for i, item := range *items {
		values[i] = item.Value
	}

	filter := bson.M{"ru": bson.M{"$in": values}}

	cursor, err := ruWords.Find(ctx, filter)
	if err != nil {
		return err
	}
	defer cursor.Close(ctx)

	foundValues := make(map[string]bool)
	for cursor.Next(ctx) {
		var result bson.M
		if err := cursor.Decode(&result); err != nil {
			return err
		}
		if value, ok := result["ru"].(string); ok {
			foundValues[value] = true
		}
	}

	if err := cursor.Err(); err != nil {
		return err
	}

	for i := range *items {
		if _, found := foundValues[(*items)[i].Value]; found {
			(*items)[i].CanBeFound = true
		}
	}
	return nil
}
