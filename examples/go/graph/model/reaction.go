package model

import "github.com/google/uuid"

type Reaction struct {
	ID        uuid.UUID       `json:"id" gorm:"type:uuid;default:gen_random_uuid()"`
	CreatedAt ISO8601DateTime `json:"createdAt"`
	UpdatedAt ISO8601DateTime `json:"updatedAt"`
	Emotion   Emotion         `json:"emotion"`
	Post      *Post           `json:"post" gorm:"-"`
	User      *User           `json:"user" gorm:"-"`
}
