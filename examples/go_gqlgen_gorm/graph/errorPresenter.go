package graph

import (
	"context"
	"errors"
	"log"

	"github.com/99designs/gqlgen/graphql"
	"github.com/vektah/gqlparser/v2/gqlerror"
)

func ErrorPresenter(ctx context.Context, err error) *gqlerror.Error {
	// Return error messages explicitly wrapped as user-facing.
	var userFacingError *UserFacingErrorWrapper
	if errors.As(err, &userFacingError) {
		return graphql.DefaultErrorPresenter(ctx, err)
	}

	// Otherwise, return only potential user-facing errors
	// (eg: GQL parsing error)
	if gqlError, ok := err.(*gqlerror.Error); ok {
		if gqlError.Err == nil {
			// Error caused by the GQL library. Bubble up to user.
			return graphql.DefaultErrorPresenter(ctx, gqlError)
		}
	}

	log.Printf("\n🔴[ERROR] %v\n\n", err)
	return graphql.DefaultErrorPresenter(ctx, gqlerror.Errorf("internal server error"))
}

func RecoverFunc(ctx context.Context, err interface{}) error {
	log.Printf("\n🔴[PANIC] %v\n\n", err)
	return gqlerror.Errorf("internal server error")
}
