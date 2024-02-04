package mutation

import (
	"errors"
	"fmt"

	"github.com/adeynack/graphql_examples/examples/go/graph"
	"github.com/adeynack/graphql_examples/examples/go/graph/model"
	"github.com/adeynack/graphql_examples/examples/go/prj"
	"gorm.io/gorm"
)

func LogIn(ctx *prj.ReqCtx, input model.LogInInput) (*model.LogInResult, error) {
	result := &model.LogInResult{ClientMutationID: input.ClientMutationID}

	// Retrieve user by email
	result.User = &model.User{Email: input.Email}
	if err := ctx.DB.Where(result.User).First(result.User).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return result, graph.UserFacingError("User not found")
		} else {
			return result, fmt.Errorf("error retrieving user: %v", err)
		}
	}

	// Check password
	if passwordOk, err := result.User.CheckPassword(ctx.ServerSalt, input.Password); err != nil {
		return result, fmt.Errorf("error checking password: %v", err)
	} else if !passwordOk {
		return result, graph.UserFacingError("Incorrect password")
	}

	// Create Session
	session := model.ApiSession{User: result.User}
	if err := session.EnsureToken(); err != nil {
		return result, fmt.Errorf("error creating token: %v", err)
	}
	result.Token = session.Token

	return result, nil
}
