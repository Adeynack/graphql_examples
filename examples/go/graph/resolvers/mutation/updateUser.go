package mutation

import (
	"errors"
	"fmt"

	"github.com/adeynack/graphql_examples/examples/go/graph"
	"github.com/adeynack/graphql_examples/examples/go/graph/model"
	"github.com/adeynack/graphql_examples/examples/go/graph/resolvers/gqlpolicy"
	"github.com/adeynack/graphql_examples/examples/go/service"
	"gorm.io/gorm"
)

func UpdateUser(ctx service.ReqCtx, input model.UpdateUserInput) (*model.UpdateUserResponse, error) {
	response := &model.UpdateUserResponse{
		ClientMutationID: input.ClientMutationID,
		User:             &model.User{ID: input.ID},
	}
	if err := gqlpolicy.Authenticated(ctx); err != nil {
		return nil, err
	}

	if err := ctx.DB.First(&response.User).Error; errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, graph.UserFacingError("User not found")
	} else if err != nil {
		return nil, fmt.Errorf("error finding user for update: %v", err)
	}

	for _, inputArg := range graph.DefinedInputArgumentNames(ctx.Context) {
		switch inputArg {
		case "id": // NOOP: mandatory argument
		case "name":
			if input.Name != nil {
				response.User.Name = *input.Name
			}
		case "email":
			if input.Email != nil {
				response.User.Email = *input.Email
			}
		default:
			return nil, fmt.Errorf("mutation UpdateUser: unexpected input argument %q", inputArg)
		}
	}
	if err := ctx.DB.Save(&response.User).Error; err != nil {
		return nil, fmt.Errorf("error updating user: %v", err)
	}

	return response, nil
}
