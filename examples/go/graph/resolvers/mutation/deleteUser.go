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

func DeleteUser(ctx service.ReqCtx, input model.DeleteUserInput) (*model.DeleteUserResponse, error) {
	response := &model.DeleteUserResponse{
		ClientMutationID: input.ClientMutationID,
		User:             &model.User{ID: input.ID},
	}
	if err := gqlpolicy.Authenticated(ctx); err != nil {
		return nil, err
	}

	if err := ctx.DB.First(&response.User).Error; errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, graph.UserFacingError("User not found")
	} else if err != nil {
		return nil, fmt.Errorf("error finding user for deletion: %v", err)
	}

	if err := ctx.DB.Delete(response.User).Error; err != nil {
		return nil, fmt.Errorf("error deleting user: %v", err)
	}

	return response, nil
}
