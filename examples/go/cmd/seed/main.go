package main

import (
	"fmt"
	"os"

	_ "github.com/joho/godotenv/autoload"

	"github.com/adeynack/graphql_examples/examples/go/graph/model"
	"github.com/adeynack/graphql_examples/examples/go/graph/resolvers"
	"gopkg.in/yaml.v3"
)

func main() {
	resolver := resolvers.InitializeResolver()
	createUsers(resolver)
}

func loadYaml(configurationFile string, into interface{}) {
	path := fmt.Sprintf(
		"../rails/test/fixtures/%s.yml",
		configurationFile,
	)
	content, err := os.ReadFile(path)
	if err != nil {
		panic(fmt.Errorf("could not open seed input file %q: %v", configurationFile, err))
	}
	if err = yaml.Unmarshal(content, into); err != nil {
		panic(fmt.Errorf("could not parse seed input file %q: %v", configurationFile, err))
	}
}

type UserFixture struct {
	Email string `json:"email"`
	Name  string `json:"name"`
}

func createUsers(r *resolvers.Resolver) map[string]*model.User {
	var userFixtures map[string]*UserFixture
	loadYaml("users", &userFixtures)

	users := make(map[string]*model.User)
	for fixtureName, fixture := range userFixtures {
		user := &model.User{
			Name:  fixture.Name,
			Email: fixture.Email,
		}
		err := user.SetPassword(r.ServerSalt, fixtureName)
		if err != nil {
			panic(fmt.Errorf("unable to set password to user fixture %q", fixtureName))
		}

		tx := r.DB.Create(user)
		if tx.Error != nil {
			panic(fmt.Errorf("unable to create users: %v", tx.Error))
		}

		users[fixtureName] = user
	}

	return users
}
