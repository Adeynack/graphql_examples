package query

import (
	"graphql_examples_go/graph/model"
	"graphql_examples_go/service"
)

func Me(ctx service.ReqCtx) (*model.User, error) {
	return ctx.CurrentUser, nil
}
