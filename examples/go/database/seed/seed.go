package seed

import (
	"fmt"
	"os"
	"strings"
	"time"

	"github.com/adeynack/graphql_examples/examples/go/graph/model"
	"github.com/adeynack/graphql_examples/examples/go/graph/resolvers"
	"github.com/google/uuid"
	"gopkg.in/yaml.v3"
)

func SeedData(r *resolvers.Resolver) error {
	users, err := createUsers(r)
	if err != nil {
		return err
	}
	posts, err := createPosts(r, users)
	if err != nil {
		return err
	}
	err = createReactions(r, users, posts)
	if err != nil {
		return err
	}

	return nil
}

func TruncateAllData(r *resolvers.Resolver) error {
	if tx := r.DB.Exec("delete from reactions"); tx.Error != nil {
		return fmt.Errorf("failed to delete reactions: %v", tx.Error)
	}
	if tx := r.DB.Exec("delete from posts"); tx.Error != nil {
		return fmt.Errorf("failed to delete posts: %v", tx.Error)
	}
	if tx := r.DB.Exec("delete from users"); tx.Error != nil {
		return fmt.Errorf("failed to delete users: %v", tx.Error)
	}
	return nil
}

func loadFixtures(configurationFile string, into interface{}) error {
	path := fmt.Sprintf(
		"../rails/test/fixtures/%s.yml",
		configurationFile,
	)
	content, err := os.ReadFile(path)
	if err != nil {
		return fmt.Errorf("could not open seed input file %q: %v", configurationFile, err)
	}
	if err = yaml.Unmarshal(content, into); err != nil {
		return fmt.Errorf("could not parse seed input file %q: %v", configurationFile, err)
	}

	return nil
}

type UserFixture struct {
	Email string `yaml:"email"`
	Name  string `yaml:"name"`
}

func createUsers(r *resolvers.Resolver) (map[string]*model.User, error) {
	var userFixtures map[string]*UserFixture
	loadFixtures("users", &userFixtures)

	users := make(map[string]*model.User)
	for fixtureName, fixture := range userFixtures {
		user := &model.User{
			Name:  fixture.Name,
			Email: fixture.Email,
		}
		err := user.SetPassword(r.ServerSalt, fixtureName)
		if err != nil {
			return nil, fmt.Errorf("unable to set password to user fixture %q", fixtureName)
		}

		if tx := r.DB.Create(user); tx.Error != nil {
			return nil, fmt.Errorf("unable to create user from fixture %q: %v", fixtureName, tx.Error)
		}

		users[fixtureName] = user
	}

	return users, nil
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
) (map[string]*model.Post, error) {
	var postFixtures map[string]*PostFixture
	loadFixtures("posts", &postFixtures)

	posts := make(map[string]*model.Post)
	createPostsLevel(r, postFixtures, users, posts)

	return posts, nil
}

func createPostsLevel(
	r *resolvers.Resolver,
	postFixtures map[string]*PostFixture,
	users map[string]*model.User,
	posts map[string]*model.Post,
) error {
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
			return fmt.Errorf("could not find user fixture %q (author of post fixture %q)", fixture.Author, fixtureName)
		}

		post := &model.Post{
			CreatedAt: model.ISO8601DateTime(time.Now()), //model.ISO8601DateTime(fixture.CreatedAt),
			UpdatedAt: model.ISO8601DateTime(fixture.UpdatedAt),
			AuthorID:  author.ID,
			ParentID:  parentPostId,
			Text:      fixture.Text,
		}

		if tx := r.DB.Create(post); tx.Error != nil {
			return fmt.Errorf("unable to create post from fixture %q: %v", fixtureName, tx.Error)
		}

		postsCreated = true
		posts[fixtureName] = post
	}

	if !postsCreated {
		return fmt.Errorf("no post were created (maybe invalid parent reference)")
	}

	if len(nextLevelPostFixtures) > 0 {
		createPostsLevel(r, nextLevelPostFixtures, users, posts)
	}

	return nil
}

type ReactionFixture struct {
	User    string `yaml:"user"`
	Post    string `yaml:"post"`
	Emotion string `yaml:"emotion"`
}

func createReactions(
	r *resolvers.Resolver,
	users map[string]*model.User,
	posts map[string]*model.Post,
) error {
	var emotionFixtures map[string]*ReactionFixture
	loadFixtures("reactions", &emotionFixtures)

	for fixtureName, fixture := range emotionFixtures {
		user, ok := users[fixture.User]
		if !ok {
			return fmt.Errorf("could not find user fixture %q (user of reaction fixture %q)", fixture.User, fixtureName)
		}

		post, ok := posts[fixture.Post]
		if !ok {
			return fmt.Errorf("could not find post fixture %q (post of reaction fixture %q)", fixture.Post, fixtureName)
		}

		var emotion model.Emotion
		if err := emotion.UnmarshalGQL(strings.ToUpper(fixture.Emotion)); err != nil {
			return fmt.Errorf("invalid emotion %q (emotion of reaction fixture %q)", fixture.Emotion, fixtureName)
		}

		reaction := &model.Reaction{
			UserId:  user.ID,
			PostId:  post.ID,
			Emotion: emotion,
		}

		if tx := r.DB.Create(reaction); tx.Error != nil {
			return fmt.Errorf("unable to create reaction from fixture %q: %v", fixtureName, tx.Error)
		}
	}

	return nil
}
