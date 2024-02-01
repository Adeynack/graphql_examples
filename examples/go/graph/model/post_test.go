package model

import (
	"testing"

	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

func Test_Post_AuthorAssociation(t *testing.T) {
	DbTest(t, func(db *gorm.DB) {
		anton, err := createAnton(db)
		if !assert.NoError(t, err) {
			return
		}

		// Setting the author by object should set its author ID automatically when creating.
		post := &Post{Author: anton, Text: "Bla"}
		assert.Equal(t, uuid.Nil, post.ID) // no ID set before creation
		tx := db.Create(post)
		if !assert.NoError(t, tx.Error) {
			return
		}
		assert.NotEmpty(t, post.ID) // creating did assign an ID to the object
		assert.Equal(t, anton.ID, post.AuthorID)

		// Retrieving that post by ID should not preload the author when not explicitly requested.
		var post1 *Post
		tx = db.First(&post1, post.ID)
		if !assert.NoError(t, tx.Error) {
			return
		}
		assert.Equal(t, anton.ID, post1.AuthorID)
		assert.Nil(t, post1.Author)

		// Retrieving that post by ID preloading its author should fill both AuthorID and Author.
		var post2 *Post
		tx = db.Preload("Author").First(&post2, post.ID)
		if !assert.NoError(t, tx.Error) {
			return
		}
		assert.Equal(t, anton.ID, post2.AuthorID)
		assert.NotNil(t, post2.Author)
		assert.Equal(t, anton.ID, post2.Author.ID)
		assert.Equal(t, anton, post2.Author)
	})
}

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
	err = db.First(&user, user.ID).Error
	return
}
