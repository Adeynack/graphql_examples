package service

import (
	"encoding/json"
	"log"
	"net/http"

	"graphql_examples_go/graph/model"
)

func respondWithJsonError(w http.ResponseWriter, code int, errorMessages ...string) {
	errors := make([]model.JsonErrorError, len(errorMessages))
	for i, errorMessage := range errorMessages {
		errors[i] = model.JsonErrorError{Message: errorMessage}
	}
	jsonError := model.JsonError{Status: code, Errors: errors}

	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(code)
	if err := json.NewEncoder(w).Encode(jsonError); err != nil {
		log.Printf("[error] failed to marshal JSON Error: %v", err)
	}
}
