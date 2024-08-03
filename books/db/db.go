package db

import (
	"context"
	"log"
	"os"
	"sync"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var (
	mongoClient *mongo.Client
	once        sync.Once
)

func GetMongoSingleton() (*mongo.Client, error) {
	var err error

	once.Do(func() {
		mongoClient, err = mongo.Connect(
			context.Background(),
			options.Client().ApplyURI(os.Getenv("MONGO_URI")),
		)

		if err != nil {
			log.Fatal(err)
		}

		// Check the connection
		err = mongoClient.Ping(context.Background(), nil)
		if err != nil {
			log.Fatal(err)
		}

		log.Println("Connected to MongoDB!")
	})

	return mongoClient, err
}
