package query

import (
	"github.com/adeynack/graphql_examples/examples/go/graph/model"
	"github.com/adeynack/graphql_examples/examples/go/service"
)

func Me(ctx service.ReqCtx) (*model.User, error) {
	return ctx.CurrentUser, nil
}
