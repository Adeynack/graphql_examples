package resolvers

import (
	"context"
	"fmt"

	"github.com/adeynack/graphql_examples/examples/go/graph/model"
)

// LogIn is the resolver for the logIn field.
func (r *mutationResolver) LogIn(ctx context.Context, input model.LogInInput) (*model.LogInResult, error) {
	panic(fmt.Errorf("not implemented: LogIn - logIn"))
}
