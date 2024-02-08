package model

import (
	"fmt"
	"testing"

	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

func DbTest(t *testing.T, testFn func(db *gorm.DB)) {
	if db := InitializeDB(); assert.NoError(t, db.Error) {
		db.Transaction(func(tx *gorm.DB) error {
			testFn(tx)
			return fmt.Errorf("rollback after test")
		})
	}
}
