package model

import (
	"crypto/rand"
	"encoding/hex"
	"fmt"
)

type ApiSession struct {
	ID        string          `gorm:"type:uuid;default:gen_random_uuid()"`
	CreatedAt ISO8601DateTime `gorm:"not null"`
	UpdatedAt ISO8601DateTime `gorm:"not null"`
	UserID    string          `gorm:"not null"`
	User      *User           ``
	Token     string          `gorm:"not null"`
}

const (
	API_SESSION_TOKEN_LEN = 32
)

func (s *ApiSession) EnsureToken() error {
	if len(s.Token) > 0 {
		return nil
	}
	bytes := make([]byte, API_SESSION_TOKEN_LEN)
	if _, err := rand.Read(bytes); err != nil {
		return fmt.Errorf("error generating random bytes for session's token: %v", err)
	}
	s.Token = hex.EncodeToString(bytes)
	return nil
}
