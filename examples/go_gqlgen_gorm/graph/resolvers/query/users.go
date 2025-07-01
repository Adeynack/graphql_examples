package query

import (
	"fmt"

	"graphql_examples_go/graph/model"
	"graphql_examples_go/graph/resolvers/gqlpolicy"
	"graphql_examples_go/service"
)

func Users(ctx service.ReqCtx) ([]*model.User, error) {
	var response []*model.User
	if err := gqlpolicy.Authenticated(ctx); err != nil {
		return nil, err
	}
	if err := ctx.DB.Order("users.name").Find(&response).Error; err != nil {
		return nil, fmt.Errorf("error selecting users: %v", err)
	}
	return response, nil
}
