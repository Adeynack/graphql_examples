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

	return response, nil
}
