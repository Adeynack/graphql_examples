package resolvers

import "github.com/adeynack/graphql_examples/examples/go/graph/model"

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require here.

type Resolver struct {
	users []*model.User
	posts []*model.Post
}
