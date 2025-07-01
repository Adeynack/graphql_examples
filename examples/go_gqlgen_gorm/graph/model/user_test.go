package model

import (
	"gorm.io/gorm"
)

func createAnton(db *gorm.DB) (user *User, err error) {
	user = &User{
		Email: "anton@example.com",
		Name:  "Anton",
	}
	user.SetPassword("password-for-anton", "salt")
	err = db.Create(user).Error
	if err != nil {
		return
	}
	// Reloading, since timestamps obtained on select are millisecond-truncated vs those set at create in-memory
	user = &User{ID: user.ID}
	err = db.First(&user).Error
	return
}
