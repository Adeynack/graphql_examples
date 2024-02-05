package mutation

import (
	"github.com/adeynack/graphql_examples/examples/go/graph/model"
	"github.com/adeynack/graphql_examples/examples/go/graph/resolvers/gqlpolicy"
	"github.com/adeynack/graphql_examples/examples/go/service"
)

func DeleteUser(ctx service.ReqCtx, input model.DeleteUserInput) (*model.DeleteUserResponse, error) {
	response := &model.DeleteUserResponse{ClientMutationID: input.ClientMutationID}
	if err := gqlpolicy.Authenticated(ctx); err != nil {
		return response, err
	}

	return response, nil
}
