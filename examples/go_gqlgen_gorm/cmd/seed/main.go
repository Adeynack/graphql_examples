package main

import (
	"flag"
	"fmt"
	"os"

	_ "github.com/joho/godotenv/autoload"

	"graphql_examples_go/graph/model"
	"graphql_examples_go/graph/resolvers"
)

func main() {
	config := ParseConfiguration()
	resolver := resolvers.InitializeResolver()

	if config.Truncate {
		if err := model.TruncateAllData(resolver.DB); err != nil {
			panic(err)
		}
	}

	if err := model.SeedData(resolver.DB, resolver.ServerSalt); err != nil {
		panic(err)
	}

	fmt.Print("\nDatabase seed completed successfully\n\n")
}

type Configuration struct {
	Truncate bool
}

func ParseConfiguration() *Configuration {
	config := new(Configuration)
	flag := flag.NewFlagSet("", flag.ExitOnError)

	flag.BoolVar(&config.Truncate, "truncate", false, "deletes all data from tables before seeding")

	if err := flag.Parse(os.Args[1:]); err != nil {
		panic(err)
	}
	return config
}
