package graph

import (
	"context"
	"errors"
	"log"

	"github.com/99designs/gqlgen/graphql"
	"github.com/vektah/gqlparser/v2/gqlerror"
)

func ErrorPresenter(ctx context.Context, originalErr error) *gqlerror.Error {
	// Only return error messages explicitly wrapped as user-facing.
	var userFacingError *UserFacingErrorWrapper
	if errors.As(originalErr, &userFacingError) {
		return graphql.DefaultErrorPresenter(ctx, originalErr)
	}
	var graphqlError *gqlerror.Error
	if errors.As(originalErr, &graphqlError) {
		return graphql.DefaultErrorPresenter(ctx, originalErr)
	}

	// Otherwise, just let the user know something went wrong.
	// This prevents random leaking of implementation details.
	log.Printf("\n🔴[ERROR][%T] %v\n\n", originalErr, originalErr)
	return gqlerror.Errorf("internal server error")
}

func RecoverFunc(ctx context.Context, err interface{}) error {
	log.Printf("\n🔴[PANIC] %v\n\n", err)
	return gqlerror.Errorf("internal server error")
}
