package model

type JsonError struct {
	Status int              `json:"status"`
	Errors []JsonErrorError `json:"errors"`
}

type JsonErrorError struct {
	Message string `json:"message"`
}
