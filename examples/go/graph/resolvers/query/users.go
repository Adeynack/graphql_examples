package query

import (
	"fmt"

	"github.com/adeynack/graphql_examples/examples/go/graph/model"
	"github.com/adeynack/graphql_examples/examples/go/graph/resolvers/gqlpolicy"
	"github.com/adeynack/graphql_examples/examples/go/service"
)

func Users(ctx service.ReqCtx) ([]*model.User, error) {
	var response []*model.User
	if err := gqlpolicy.Authenticated(ctx); err != nil {
		return response, err
	}
	if err := ctx.DB.Find(&response).Error; err != nil {
		return response, fmt.Errorf("error selecting users: %v", err)
	}
	return response, nil
}
