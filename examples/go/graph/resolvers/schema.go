package resolvers

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.
// Code generated by github.com/99designs/gqlgen version v0.17.43

import (
	"context"
	"fmt"
	"time"

	"github.com/adeynack/graphql_examples/examples/go/graph"
	"github.com/adeynack/graphql_examples/examples/go/graph/model"
	"github.com/google/uuid"
)

// LogIn is the resolver for the logIn field.
func (r *mutationResolver) LogIn(ctx context.Context, input model.LogInInput) (*model.LogInResult, error) {
	panic(fmt.Errorf("not implemented: LogIn - logIn"))
}

// LogOut is the resolver for the logOut field.
func (r *mutationResolver) LogOut(ctx context.Context, input model.LogOutInput) (*model.LogOutResponse, error) {
	panic(fmt.Errorf("not implemented: LogOut - logOut"))
}

// CreateUser is the resolver for the createUser field.
func (r *mutationResolver) CreateUser(ctx context.Context, input model.CreateUserInput) (*model.CreateUserResponse, error) {
	panic(fmt.Errorf("not implemented: CreateUser - createUser"))
}

// UpdateUser is the resolver for the updateUser field.
func (r *mutationResolver) UpdateUser(ctx context.Context, input model.UpdateUserInput) (*model.UpdateUserResponse, error) {
	panic(fmt.Errorf("not implemented: UpdateUser - updateUser"))
}

// DeleteUser is the resolver for the deleteUser field.
func (r *mutationResolver) DeleteUser(ctx context.Context, input model.DeleteUserInput) (*model.DeleteUserResponse, error) {
	panic(fmt.Errorf("not implemented: DeleteUser - deleteUser"))
}

// Me is the resolver for the me field.
func (r *queryResolver) Me(ctx context.Context) (*model.User, error) {
	panic(fmt.Errorf("not implemented: Me - me"))
}

// Post is the resolver for the post field.
func (r *queryResolver) Post(ctx context.Context, id string) (*model.Post, error) {
	parsedId, err := uuid.Parse(id)
	if err != nil {
		return nil, nil
	}
	post := &model.Post{
		ID:        parsedId,
		AuthorID:  uuid.MustParse("e642bb00-8f89-4167-9255-4cc2671a1ee9"),
		Text:      "Commodo anim veniam et anim consectetur aliquip tempor.",
		CreatedAt: model.ISO8601DateTime(time.Now()),
	}
	return post, nil
}

// Posts is the resolver for the posts field.
func (r *queryResolver) Posts(ctx context.Context) ([]*model.Post, error) {
	panic(fmt.Errorf("not implemented: Posts - posts"))
}

// User is the resolver for the user field.
func (r *queryResolver) User(ctx context.Context, id *string, email *string) (*model.User, error) {
	panic(fmt.Errorf("not implemented: User - user"))
}

// Users is the resolver for the users field.
func (r *queryResolver) Users(ctx context.Context) ([]*model.User, error) {
	panic(fmt.Errorf("not implemented: Users - users"))
}

// Mutation returns graph.MutationResolver implementation.
func (r *Resolver) Mutation() graph.MutationResolver { return &mutationResolver{r} }

// Query returns graph.QueryResolver implementation.
func (r *Resolver) Query() graph.QueryResolver { return &queryResolver{r} }

type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
