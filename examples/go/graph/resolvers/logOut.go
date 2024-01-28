package resolvers

import (
	"context"
	"fmt"

	"github.com/adeynack/graphql_examples/examples/go/graph/model"
)

// LogOut is the resolver for the logOut field.
func (r *mutationResolver) LogOut(ctx context.Context, input model.LogOutInput) (*model.LogOutResponse, error) {
	panic(fmt.Errorf("not implemented: LogOut - logOut"))
}
