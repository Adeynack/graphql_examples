package model

type JsonError struct {
	Status uint             `json:"status"`
	Errors []JsonErrorError `json:"errors"`
}

type JsonErrorError struct {
	Message string `json:"message"`
}
