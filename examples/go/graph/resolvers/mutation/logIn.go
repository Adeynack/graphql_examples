package mutation

import (
	"errors"
	"fmt"

	"github.com/adeynack/graphql_examples/examples/go/graph"
	"github.com/adeynack/graphql_examples/examples/go/graph/model"
	"github.com/adeynack/graphql_examples/examples/go/service"
	"gorm.io/gorm"
)

func LogIn(ctx service.ReqCtx, input model.LogInInput) (*model.LogInResponse, error) {
	response := &model.LogInResponse{ClientMutationID: input.ClientMutationID}

	// Retrieve user by email
	response.User = &model.User{Email: input.Email}
	if err := ctx.DB.Where(response.User).First(response.User).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, graph.UserFacingError("User not found")
		} else {
			return nil, fmt.Errorf("error retrieving user: %v", err)
		}
	}

	// Check password
	if passwordOk, err := response.User.CheckPassword(ctx.ServerSalt, input.Password); err != nil {
		return nil, fmt.Errorf("error checking password: %v", err)
	} else if !passwordOk {
		return nil, graph.UserFacingError("Incorrect password")
	}

	// Check if current session is of the user logging in.
	if ctx.CurrentUser != nil && ctx.CurrentUser.ID == response.User.ID {
		response.Token = ctx.ApiSession.Token
		return response, nil
	}

	// Create Session
	session := &model.ApiSession{User: response.User}
	if err := session.EnsureToken(); err != nil {
		return nil, fmt.Errorf("error creating token: %v", err)
	}
	if err := ctx.DB.Create(session).Error; err != nil {
		return nil, fmt.Errorf("error creating session record: %v", err)
	}
	response.Token = session.Token
	ctx.SetTokenCookie(session.Token)

	return response, nil
}
