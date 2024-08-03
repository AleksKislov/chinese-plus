package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type RuWord struct {
	ID primitive.ObjectID `bson:"_id,omitempty" json:"_id,omitempty"`
	CN string `bson:"cn" json:"cn"`
	RU string `bson:"ru" json:"ru"`
}