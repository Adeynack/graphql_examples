package service

import (
	"log"
	"net/http"

	"github.com/adeynack/graphql_examples/examples/go/graph/model"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func DataResetHandler(db *gorm.DB, serverSalt string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Temporary disable database logging (helps debugging)
		previousLogger := db.Config.Logger
		defer func() { db.Config.Logger = previousLogger }()
		db.Config.Logger = db.Config.Logger.LogMode(logger.Error)

		if err := model.TruncateAllData(db); err != nil {
			log.Printf("[error] truncating data: %v", err)
			failWithJson(w, http.StatusInternalServerError, "failed to truncate data")
		}
		if err := model.SeedData(db, serverSalt); err != nil {
			log.Printf("[error] seeding data: %v", err)
			failWithJson(w, http.StatusInternalServerError, "failed to seed data")
		}
	}
}
