package mutation

import (
	"fmt"

	"github.com/adeynack/graphql_examples/examples/go/graph/model"
	"github.com/adeynack/graphql_examples/examples/go/graph/resolvers/gqlpolicy"
	"github.com/adeynack/graphql_examples/examples/go/service"
)

func CreateUser(ctx service.ReqCtx, input model.CreateUserInput) (*model.CreateUserResponse, error) {
	return gqlpolicy.Authenticated(ctx, &model.CreateUserResponse{ClientMutationID: input.ClientMutationID}, func(ctx service.ReqCtx, response *model.CreateUserResponse) (*model.CreateUserResponse, error) {
		response.User = &model.User{
			Email: input.Email,
			Name:  input.Name,
		}
		if err := response.User.SetPassword(ctx.ServerSalt, input.Password); err != nil {
			return response, fmt.Errorf("error setting new user's password: %v", err)
		}
		if err := ctx.DB.Create(response.User).Error; err != nil {
			return response, fmt.Errorf("error creating new user: %v", err)
		}
		return response, nil
	})
}
