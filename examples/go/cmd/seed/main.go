package main

import (
	"flag"
	"fmt"
	"os"
	"time"

	"github.com/google/uuid"
	_ "github.com/joho/godotenv/autoload"

	"github.com/adeynack/graphql_examples/examples/go/graph/model"
	"github.com/adeynack/graphql_examples/examples/go/graph/resolvers"
	"gopkg.in/yaml.v3"
)

func main() {
	config := ParseConfiguration()
	resolver := resolvers.InitializeResolver()

	if config.Truncate {
		truncateAllData(resolver)
	}

	users := createUsers(resolver)
	createPosts(resolver, users)
}

type Configuration struct {
	Truncate bool
}

func ParseConfiguration() *Configuration {
	config := new(Configuration)
	flag := flag.NewFlagSet("", flag.ExitOnError)

	flag.BoolVar(&config.Truncate, "truncate", false, "deletes all data from tables before seeding")

	err := flag.Parse(os.Args[1:])
	if err != nil {
		panic(err)
	}
	return config
}

func truncateAllData(r *resolvers.Resolver) {
	tx := r.DB.Exec("delete from reactions")
	if tx.Error != nil {
		panic(fmt.Errorf("failed to delete reactions: %v", tx.Error))
	}

	tx = r.DB.Exec("delete from posts")
	if tx.Error != nil {
		panic(fmt.Errorf("failed to delete posts: %v", tx.Error))
	}

	tx = r.DB.Exec("delete from users")
	if tx.Error != nil {
		panic(fmt.Errorf("failed to delete users: %v", tx.Error))
	}
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
	Email string `yaml:"email"`
	Name  string `yaml:"name"`
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
			panic(fmt.Errorf("unable to create user %q: %v", fixtureName, tx.Error))
		}

		users[fixtureName] = user
	}

	return users
}

type PostFixture struct {
	Author    string                `yaml:"author"`
	Parent    string                `yaml:"parent"`
	Text      string                `yaml:"text"`
	CreatedAt model.ISO8601DateTime `yaml:"created_at"`
	UpdatedAt model.ISO8601DateTime `yaml:"updated_at"`
}

func createPosts(
	r *resolvers.Resolver,
	users map[string]*model.User,
) map[string]*model.Post {
	var postFixtures map[string]*PostFixture
	loadYaml("posts", &postFixtures)

	posts := make(map[string]*model.Post)
	createPostsLevel(r, postFixtures, users, posts)

	return posts
}

func createPostsLevel(
	r *resolvers.Resolver,
	postFixtures map[string]*PostFixture,
	users map[string]*model.User,
	posts map[string]*model.Post,
) {
	postsCreated := false
	nextLevelPostFixtures := make(map[string]*PostFixture)

	for fixtureName, fixture := range postFixtures {
		var parentPostId *uuid.UUID
		if fixture.Parent != "" {
			if parentPost, ok := posts[fixture.Parent]; ok {
				parentPostId = &parentPost.ID
			} else {
				nextLevelPostFixtures[fixtureName] = fixture
				continue
			}
		}

		author, ok := users[fixture.Author]
		if !ok {
			panic(fmt.Errorf("could not find user fixture %q (author of post fixture %q)", fixture.Author, fixtureName))
		}

		post := &model.Post{
			CreatedAt: model.ISO8601DateTime(time.Now()), //model.ISO8601DateTime(fixture.CreatedAt),
			UpdatedAt: model.ISO8601DateTime(fixture.UpdatedAt),
			AuthorID:  author.ID,
			ParentID:  parentPostId,
			Text:      fixture.Text,
		}

		tx := r.DB.Create(post)
		if tx.Error != nil {
			panic(fmt.Errorf("unable to create post %q: %v", fixtureName, tx.Error))
		}

		postsCreated = true
		posts[fixtureName] = post
	}

	if !postsCreated {
		panic(fmt.Errorf("no post were created (maybe invalid parent reference)"))
	}

	if len(nextLevelPostFixtures) > 0 {
		createPostsLevel(r, nextLevelPostFixtures, users, posts)
	}
}
