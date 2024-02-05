package query

import (
	"github.com/adeynack/graphql_examples/examples/go/graph/model"
	"github.com/adeynack/graphql_examples/examples/go/graph/resolvers/gqlpolicy"
	"github.com/adeynack/graphql_examples/examples/go/service"
)

func Users(ctx service.ReqCtx) ([]*model.User, error) {
	var response []*model.User
	if err := gqlpolicy.Authenticated(ctx); err != nil {
		return response, err
	}

	return response, nil
}
