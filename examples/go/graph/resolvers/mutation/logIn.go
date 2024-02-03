package mutation

import (
	"fmt"

	"github.com/adeynack/graphql_examples/examples/go/graph"
	"github.com/adeynack/graphql_examples/examples/go/graph/model"
	"github.com/adeynack/graphql_examples/examples/go/prj"
)

func LogIn(ctx *prj.ReqCtx, input model.LogInInput) (*model.LogInResult, error) {
	result := &model.LogInResult{ClientMutationID: input.ClientMutationID}

	// Retrieve user by email
	result.User = &model.User{Email: input.Email}
	tx := ctx.DB.Where(result.User).First(result.User)
	if tx.Error != nil {
		if tx.Error.Error() == "record not found" {
			// TODO: make the difference between `user not found` and any other error
			return result, graph.UserFacingError("User not found")
		} else {
			return result, fmt.Errorf("error retrieving user: %v", tx.Error)
		}
	}

	// Check password
	passwordOk, err := result.User.CheckPassword(ctx.ServerSalt, input.Password)
	if err != nil {
		return result, fmt.Errorf("error checking password: %v", err)
	}
	if !passwordOk {
		return result, graph.UserFacingError("Incorrect password")
	}

	return result, nil
}
