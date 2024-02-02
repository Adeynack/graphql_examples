package mutation

import (
	"github.com/adeynack/graphql_examples/examples/go/graph/model"
	"github.com/adeynack/graphql_examples/examples/go/prj"
	"github.com/vektah/gqlparser/v2/gqlerror"
)

func LogIn(ctx *prj.ReqCtx, input model.LogInInput) (*model.LogInResult, error) {
	result := &model.LogInResult{ClientMutationID: input.ClientMutationID}

	// Retrieve user by email
	result.User = &model.User{Email: input.Email}
	tx := ctx.DB.Where(result.User).First(result.User)
	if tx.Error != nil {
		return result, gqlerror.Errorf("User not found")
	}

	return result, nil
}
