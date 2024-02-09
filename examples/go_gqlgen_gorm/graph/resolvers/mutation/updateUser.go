package mutation

import (
	"errors"
	"fmt"

	"graphql_examples_go/graph"
	"graphql_examples_go/graph/model"
	"graphql_examples_go/graph/resolvers/gqlpolicy"
	"graphql_examples_go/service"

	"gorm.io/gorm"
)

func UpdateUser(ctx service.ReqCtx, input model.UpdateUserInput) (*model.UpdateUserResponse, error) {
	mutationId := "<nil>"
	if input.ClientMutationID != nil {
		mutationId = *input.ClientMutationID
	}
	fmt.Printf("\n\n🟢 Mutation UpdateUser -- Mutation ID: %s -- Input: %#v\n\n\n", mutationId, input)
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
		case "clientMutationId":
		case "id":
		case "name":
			if input.Name == nil {
				return nil, graph.UserFacingError("name cannot be null")
			}
			response.User.Name = *input.Name
		case "email":
			if input.Email == nil {
				return nil, graph.UserFacingError("email cannot be null")
			}
			response.User.Email = *input.Email
		case "birthDate":
			response.User.BirthDate = input.BirthDate
		default:
			return nil, fmt.Errorf("mutation UpdateUser: unexpected input argument %q", inputArg)
		}
	}
	if err := ctx.DB.Save(&response.User).Error; err != nil {
		return nil, fmt.Errorf("error updating user: %v", err)
	}

	return response, nil
}
