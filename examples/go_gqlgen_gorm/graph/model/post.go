package model

import (
	"database/sql"
)

type Post struct {
	ID        string          `json:"id" gorm:"type:uuid;default:gen_random_uuid()"`
	CreatedAt ISO8601DateTime `json:"createdAt" gorm:"not null"`
	UpdatedAt ISO8601DateTime `json:"updatedAt" gorm:"not null"`
	AuthorID  string          `json:"authorId" gorm:"not null"`
	Author    *User           `json:"author" gorm:"constraint:OnDelete:CASCADE"`
	ParentID  sql.NullString  `json:"parentId"`
	Parent    *Post           `json:"parent,omitempty"`
	Comments  []*Post         `json:"comments" gorm:"foreignKey:parent_id;constraint:OnDelete:CASCADE"`
	Text      string          `json:"text" gorm:"not null"`
	Reactions []*Reaction     `json:"reactions" gorm:"constraint:OnDelete:CASCADE"`
}
