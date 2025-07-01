package mutation

import (
	"fmt"

	"graphql_examples_go/graph/model"
	"graphql_examples_go/service"
)

func LogOut(ctx service.ReqCtx, input model.LogOutInput) (*model.LogOutResponse, error) {
	response := &model.LogOutResponse{ClientMutationID: input.ClientMutationID}

	// Delete session
	if ctx.ApiSession != nil {
		err := ctx.DB.Delete(ctx.ApiSession).Error
		if err != nil {
			return nil, fmt.Errorf("error deleting ApiSession with ID %q: %v", ctx.ApiSession.ID, err)
		}
	}

	// Delete token cookie
	ctx.SetTokenCookie("")

	return response, nil
}
