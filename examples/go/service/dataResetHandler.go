package service

import (
	"log"
	"net/http"

	"github.com/adeynack/graphql_examples/examples/go/graph/model"
	"gorm.io/gorm"
)

func DataResetHandler(db *gorm.DB, serverSalt string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
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
