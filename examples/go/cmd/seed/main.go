package main

import (
	"flag"
	"fmt"
	"os"

	_ "github.com/joho/godotenv/autoload"

	"github.com/adeynack/graphql_examples/examples/go/database/seed"
	"github.com/adeynack/graphql_examples/examples/go/graph/resolvers"
)

func main() {
	config := ParseConfiguration()
	resolver := resolvers.InitializeResolver()

	if config.Truncate {
		if err := seed.TruncateAllData(resolver); err != nil {
			panic(err)
		}
	}

	if err := seed.SeedData(resolver); err != nil {
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
