package mutation

import (
	"errors"
	"fmt"

	"github.com/adeynack/graphql_examples/examples/go/graph"
	"github.com/adeynack/graphql_examples/examples/go/graph/model"
	"github.com/adeynack/graphql_examples/examples/go/service"
	"gorm.io/gorm"
)

func LogIn(ctx *service.ReqCtx, input model.LogInInput) (*model.LogInResult, error) {
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

	// Check if current session is of the user logging in.
	if ctx.CurrentUser != nil && ctx.CurrentUser.ID == result.User.ID {
		result.Token = ctx.ApiSession.Token
		return result, nil
	}

	// Create Session
	session := &model.ApiSession{User: result.User}
	if err := session.EnsureToken(); err != nil {
		return result, fmt.Errorf("error creating token: %v", err)
	}
	if err := ctx.DB.Create(session).Error; err != nil {
		return result, fmt.Errorf("error creating session record: %v", err)
	}
	result.Token = session.Token
	ctx.SetTokenCookie(session.Token)

	return result, nil
}
