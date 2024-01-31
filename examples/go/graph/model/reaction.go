package model

import "github.com/google/uuid"

type Reaction struct {
	ID        uuid.UUID       `json:"id" gorm:"type:uuid;default:gen_random_uuid()"`
	CreatedAt ISO8601DateTime `json:"createdAt" gorm:"not null"`
	UpdatedAt ISO8601DateTime `json:"updatedAt" gorm:"not null"`
	PostId    uuid.UUID       `json:"-" gorm:"not null"`
	Post      *Post           `json:"post"`
	UserId    uuid.UUID       `json:"-" gorm:"not null"`
	User      *User           `json:"user"`
	Emotion   Emotion         `json:"emotion" gorm:"not null"`
}

// TODO: Create and use database ENUM for `Emotion`
