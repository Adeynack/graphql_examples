package gqlpolicy

import (
	"github.com/adeynack/graphql_examples/examples/go/graph"
	"github.com/adeynack/graphql_examples/examples/go/service"
)

func Authenticated(ctx service.ReqCtx) *graph.UserFacingErrorWrapper {
	if ctx.CurrentUser == nil {
		return graph.UserFacingError("Not authorized")
	}
	return nil
}
