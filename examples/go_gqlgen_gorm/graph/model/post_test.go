package model

import (
	"testing"

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
		assert.Equal(t, "", post.ID) // no ID set before creation
		tx := db.Create(post)
		if !assert.NoError(t, tx.Error) {
			return
		}
		assert.NotEmpty(t, post.ID) // creating did assign an ID to the object
		assert.Equal(t, anton.ID, post.AuthorID)

		_ = test_Post_DoNotPreloadAuthorByDefault(t, db, post, anton) &&
			test_Post_PreloadAuthorWhenExplicit(t, db, post, anton)
	})
}

func test_Post_DoNotPreloadAuthorByDefault(t *testing.T, db *gorm.DB, originalPost *Post, anton *User) bool {
	// Retrieving that post by ID should not preload the author when not explicitly requested.
	post := Post{ID: originalPost.ID}
	tx := db.First(&post)
	if !assert.NoError(t, tx.Error) {
		return false
	}
	assert.Equal(t, anton.ID, post.AuthorID)
	assert.Nil(t, post.Author)
	return true
}

func test_Post_PreloadAuthorWhenExplicit(t *testing.T, db *gorm.DB, originalPost *Post, anton *User) bool {
	// Retrieving that post by ID preloading its author should fill both AuthorID and Author.
	post := Post{ID: originalPost.ID}
	tx := db.Preload("Author").First(&post)
	if !assert.NoError(t, tx.Error) {
		return false
	}
	assert.Equal(t, anton.ID, post.AuthorID)
	assert.NotNil(t, post.Author)
	assert.Equal(t, anton.ID, post.Author.ID)
	assert.Equal(t, anton, post.Author)
	return true
}
