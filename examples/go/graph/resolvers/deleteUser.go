package resolvers

import (
	"context"
	"fmt"

	"github.com/adeynack/graphql_examples/examples/go/graph/model"
)

// DeleteUser is the resolver for the deleteUser field.
func (r *mutationResolver) DeleteUser(ctx context.Context, input model.DeleteUserInput) (*model.DeleteUserResponse, error) {
	panic(fmt.Errorf("not implemented: DeleteUser - deleteUser"))
}
