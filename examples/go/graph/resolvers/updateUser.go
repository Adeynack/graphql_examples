package resolvers

import (
	"context"
	"fmt"

	"github.com/adeynack/graphql_examples/examples/go/graph/model"
)

// UpdateUser is the resolver for the updateUser field.
func (r *mutationResolver) UpdateUser(ctx context.Context, input model.UpdateUserInput) (*model.UpdateUserResponse, error) {
	panic(fmt.Errorf("not implemented: UpdateUser - updateUser"))
}
