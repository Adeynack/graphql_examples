package gqlpolicy

import (
	"github.com/adeynack/graphql_examples/examples/go/graph"
	"github.com/adeynack/graphql_examples/examples/go/service"
)

func Authenticated[Response any](
	ctx service.ReqCtx,
	response Response,
	fn func(ctx service.ReqCtx, response Response) (Response, error),
) (Response, error) {
	if ctx.CurrentUser == nil {
		return response, graph.UserFacingError("Not authorized")
	}
	return fn(ctx, response)
}
