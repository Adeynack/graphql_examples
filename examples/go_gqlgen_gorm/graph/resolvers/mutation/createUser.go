package mutation

import (
	"fmt"

	"graphql_examples_go/graph"
	"graphql_examples_go/graph/model"
	"graphql_examples_go/graph/resolvers/gqlpolicy"
	"graphql_examples_go/service"
)

func CreateUser(ctx service.ReqCtx, input model.CreateUserInput) (*model.CreateUserResponse, error) {
	response := &model.CreateUserResponse{ClientMutationID: input.ClientMutationID}
	if err := gqlpolicy.Authenticated(ctx); err != nil {
		return nil, err
	}
	if err := checkForExistingUserPerEmail(ctx, input.Email); err != nil {
		return nil, err
	}

	// Creating new user
	response.User = &model.User{
		Email: input.Email,
		Name:  input.Name,
	}
	if err := response.User.SetPassword(ctx.ServerSalt, input.Password); err != nil {
		return nil, fmt.Errorf("error setting new user's password: %v", err)
	}
	if err := ctx.DB.Create(response.User).Error; err != nil {
		return nil, fmt.Errorf("error creating new user: %v", err)
	}

	return response, nil
}

func checkForExistingUserPerEmail(ctx service.ReqCtx, email string) error {
	var existingUserCount int64
	if err := ctx.DB.Model(&model.User{}).Where("lower(users.email) = lower(?)", email).Count(&existingUserCount).Error; err != nil {
		return fmt.Errorf("error checking for existing user per email: %v", err)
	}
	if existingUserCount > 0 {
		return graph.UserFacingError("Email has already been taken")
	}
	return nil
}
