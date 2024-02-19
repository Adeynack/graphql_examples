package model

import (
	"database/sql"
	"fmt"
	"os"
	"strings"

	"gopkg.in/yaml.v3"
	"gorm.io/gorm"
)

func SeedData(db *gorm.DB, serverSalt string) error {
	users, err := createUsers(db, serverSalt)
	if err != nil {
		return err
	}
	posts, err := createPosts(db, users)
	if err != nil {
		return err
	}
	err = createReactions(db, users, posts)
	if err != nil {
		return err
	}

	return nil
}

func TruncateAllData(db *gorm.DB) error {
	if tx := db.Exec("delete from reactions"); tx.Error != nil {
		return fmt.Errorf("failed to delete reactions: %v", tx.Error)
	}
	if tx := db.Exec("delete from posts"); tx.Error != nil {
		return fmt.Errorf("failed to delete posts: %v", tx.Error)
	}
	if tx := db.Exec("delete from api_sessions"); tx.Error != nil {
		return fmt.Errorf("failed to delete API sessions: %v", tx.Error)
	}
	if tx := db.Exec("delete from users"); tx.Error != nil {
		return fmt.Errorf("failed to delete users: %v", tx.Error)
	}
	return nil
}

func loadFixtures(configurationFile string, into any) error {
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
	Email     string           `yaml:"email"`
	Name      string           `yaml:"name"`
	BirthDate *ISO8601DateTime `yaml:"birth_date"`
}

func createUsers(db *gorm.DB, serverSalt string) (map[string]*User, error) {
	var userFixtures map[string]*UserFixture
	loadFixtures("users", &userFixtures)

	users := make(map[string]*User)
	for fixtureName, fixture := range userFixtures {
		user := &User{
			Name:      fixture.Name,
			Email:     fixture.Email,
			BirthDate: fixture.BirthDate,
		}
		err := user.SetPassword(serverSalt, fixtureName)
		if err != nil {
			return nil, fmt.Errorf("unable to set password to user fixture %q", fixtureName)
		}

		if tx := db.Create(user); tx.Error != nil {
			return nil, fmt.Errorf("unable to create user from fixture %q: %v", fixtureName, tx.Error)
		}

		users[fixtureName] = user
	}

	return users, nil
}

type PostFixture struct {
	Author    string          `yaml:"author"`
	Parent    string          `yaml:"parent"`
	Text      string          `yaml:"text"`
	CreatedAt ISO8601DateTime `yaml:"created_at"`
	UpdatedAt ISO8601DateTime `yaml:"updated_at"`
}

func createPosts(
	db *gorm.DB,
	users map[string]*User,
) (posts map[string]*Post, err error) {
	var postFixtures map[string]*PostFixture
	loadFixtures("posts", &postFixtures)

	posts = make(map[string]*Post)
	err = createPostsLevel(db, postFixtures, users, posts)
	return
}

func createPostsLevel(
	db *gorm.DB,
	postFixtures map[string]*PostFixture,
	users map[string]*User,
	posts map[string]*Post,
) error {
	postsCreated := false
	nextLevelPostFixtures := make(map[string]*PostFixture)

	for fixtureName, fixture := range postFixtures {
		var parentPostId sql.NullString
		if fixture.Parent != "" {
			if parentPost, ok := posts[fixture.Parent]; ok {
				parentPostId.Valid = true
				parentPostId.String = parentPost.ID
			} else {
				nextLevelPostFixtures[fixtureName] = fixture
				continue
			}
		}

		author, ok := users[fixture.Author]
		if !ok {
			return fmt.Errorf("could not find user fixture %q (author of post fixture %q)", fixture.Author, fixtureName)
		}

		post := &Post{
			CreatedAt: ISO8601DateTime(fixture.CreatedAt),
			UpdatedAt: ISO8601DateTime(fixture.UpdatedAt),
			AuthorID:  author.ID,
			ParentID:  parentPostId,
			Text:      fixture.Text,
		}

		if tx := db.Create(post); tx.Error != nil {
			return fmt.Errorf("unable to create post from fixture %q: %v", fixtureName, tx.Error)
		}

		postsCreated = true
		posts[fixtureName] = post
	}

	if !postsCreated {
		return fmt.Errorf("no post were created (maybe invalid parent reference)")
	}

	if len(nextLevelPostFixtures) > 0 {
		createPostsLevel(db, nextLevelPostFixtures, users, posts)
	}

	return nil
}

type ReactionFixture struct {
	User    string `yaml:"user"`
	Post    string `yaml:"post"`
	Emotion string `yaml:"emotion"`
}

func createReactions(
	db *gorm.DB,
	users map[string]*User,
	posts map[string]*Post,
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

		var emotion Emotion
		if err := emotion.UnmarshalGQL(strings.ToUpper(fixture.Emotion)); err != nil {
			return fmt.Errorf("invalid emotion %q (emotion of reaction fixture %q)", fixture.Emotion, fixtureName)
		}

		reaction := &Reaction{
			UserId:  user.ID,
			PostId:  post.ID,
			Emotion: emotion,
		}

		if tx := db.Create(reaction); tx.Error != nil {
			return fmt.Errorf("unable to create reaction from fixture %q: %v", fixtureName, tx.Error)
		}
	}

	return nil
}
