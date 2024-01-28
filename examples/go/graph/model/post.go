package model

import "github.com/google/uuid"

type Post struct {
	ID        uuid.UUID       `json:"id" gorm:"type:uuid;default:gen_random_uuid()"`
	CreatedAt ISO8601DateTime `json:"createdAt"`
	UpdatedAt ISO8601DateTime `json:"updatedAt"`
	AuthorID  string          `json:"authorId"`
	Author    *User           `json:"author" gorm:"-"`
	ParentID  string          `json:"parentId"`
	Parent    *Post           `json:"parent,omitempty" gorm:"-"`
	Text      string          `json:"text"`
	Reactions []*Reaction     `json:"reactions" gorm:"-"`
}
