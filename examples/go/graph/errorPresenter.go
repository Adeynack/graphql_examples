package graph

import (
	"context"
	"errors"

	"github.com/99designs/gqlgen/graphql"
	"github.com/vektah/gqlparser/v2/gqlerror"
)

func ErrorPresenter(ctx context.Context, originalErr error) *gqlerror.Error {
	// Only return error messages explicitly wrapped as user-facing.
	var userFacingError UserFacingErrorWrapper
	if errors.As(originalErr, &userFacingError) {
		return graphql.DefaultErrorPresenter(ctx, originalErr)
	}

	// Otherwise, just let the user know something went wrong.
	// This prevents random leaking of implementation details.
	return gqlerror.Errorf("internal server error")
}

func RecoverFunc(ctx context.Context, err interface{}) error {
	return gqlerror.Errorf("internal server error")
}
