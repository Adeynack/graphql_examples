package model

import "database/sql"

type Post struct {
	ID        string          `json:"id" gorm:"type:uuid;default:gen_random_uuid()"`
	CreatedAt ISO8601DateTime `json:"createdAt" gorm:"not null"`
	UpdatedAt ISO8601DateTime `json:"updatedAt" gorm:"not null"`
	AuthorID  string          `json:"authorId" gorm:"not null"`
	Author    *User           `json:"author"`
	ParentID  sql.NullString  `json:"parentId"`
	Parent    *Post           `json:"parent,omitempty"`
	Text      string          `json:"text" gorm:"not null"`
	Reactions []*Reaction     `json:"reactions"`
}
