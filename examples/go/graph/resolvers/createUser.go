package resolvers

import (
	"context"

	"github.com/adeynack/graphql_examples/examples/go/graph/model"
)

// CreateUser implements graph.MutationResolver.
func (*mutationResolver) CreateUser(ctx context.Context, input model.CreateUserInput) (*model.CreateUserResponse, error) {
	panic("unimplemented")
}
