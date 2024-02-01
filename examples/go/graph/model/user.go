package model

import (
	"crypto/hmac"
	"crypto/md5"
	"encoding/hex"
	"fmt"
)

type User struct {
	ID             string          `json:"id" gorm:"type:uuid;default:gen_random_uuid()"`
	CreatedAt      ISO8601DateTime `json:"createdAt" gorm:"not null"`
	UpdatedAt      ISO8601DateTime `json:"updatedAt" gorm:"not null"`
	Email          string          `json:"email" gorm:"uniqueIndex;not null"`
	Name           string          `json:"name" gorm:"not null"`
	PasswordDigest string          `json:"-" gorm:"not null"`
	Posts          []*Post         `json:"posts" gorm:"foreignKey:author_id"`
	Reactions      []*Reaction     `json:"reactions"`
}

func (user *User) SetPassword(salt, password string) error {
	saltedPassword, err := saltValue(salt, password)
	if err != nil {
		return fmt.Errorf("error salting user's password: %v", err)
	}
	user.PasswordDigest = string(saltedPassword)
	return nil
}

func (user *User) CheckPassword(salt, password string) (bool, error) {
	salted, err := saltValue(salt, password)
	if err != nil {
		return false, fmt.Errorf("error salting password to check: %v", err)
	}
	return hmac.Equal(salted, []byte(user.PasswordDigest)), nil
}

func saltValue(salt, value string) ([]byte, error) {
	mac := hmac.New(md5.New, []byte(salt))
	_, err := mac.Write([]byte(value))
	if err != nil {
		return nil, fmt.Errorf("error salting value: %v", err)
	}
	return []byte(hex.EncodeToString(mac.Sum(nil))), nil
}
