package resolvers

import (
	"context"
	"fmt"
	"os"

	"github.com/adeynack/graphql_examples/examples/go/graph/model"
	"github.com/adeynack/graphql_examples/examples/go/service"
	"gorm.io/gorm"
)

//go:generate go run github.com/99designs/gqlgen generate

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require here.

type Resolver struct {
	DB         *gorm.DB
	ServerSalt string
}

func InitializeResolver() *Resolver {
	database := model.InitializeDB()

	serverSalt := os.Getenv("SERVER_SALT")
	if serverSalt == "" {
		panic(fmt.Errorf("env SERVER_SALT is required"))
	}

	return &Resolver{
		DB:         database,
		ServerSalt: serverSalt,
	}
}

func (r *Resolver) ToRequestContext(ctx context.Context) service.ReqCtx {
	c := service.ReqCtx{
		Context:    ctx,
		DB:         r.DB.WithContext(ctx),
		ServerSalt: r.ServerSalt,
	}
	c.ExtractCtxInformation()
	return c
}
