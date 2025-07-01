package gqlpolicy

import (
	"graphql_examples_go/graph"
	"graphql_examples_go/service"
)

func Authenticated(ctx service.ReqCtx) *graph.UserFacingErrorWrapper {
	if ctx.CurrentUser == nil {
		return graph.UserFacingError("Not authorized")
	}
	return nil
}
