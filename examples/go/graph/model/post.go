package model

import "github.com/google/uuid"

type Post struct {
	ID        uuid.UUID       `json:"id" gorm:"type:uuid;default:gen_random_uuid()"`
	CreatedAt ISO8601DateTime `json:"createdAt" gorm:"not null"`
	UpdatedAt ISO8601DateTime `json:"updatedAt" gorm:"not null"`
	AuthorID  uuid.UUID       `json:"authorId" gorm:"not null"`
	Author    *User           `json:"author" gorm:"-"`
	ParentID  *uuid.UUID      `json:"parentId"`
	Parent    *Post           `json:"parent,omitempty" gorm:"-"`
	Text      string          `json:"text" gorm:"not null"`
	Reactions []*Reaction     `json:"reactions" gorm:"-"`
}
