package main

import (
	"log"
	"net/http"
	"os"

	_ "github.com/joho/godotenv/autoload"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/adeynack/graphql_examples/examples/go/graph"
	"github.com/adeynack/graphql_examples/examples/go/graph/resolvers"
)

const defaultPort = "30301"

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}

	resolver := resolvers.InitializeResolver()
	srv := handler.NewDefaultServer(graph.NewExecutableSchema(graph.Config{Resolvers: resolver}))

	http.Handle("/", playground.Handler("GraphQL playground", "/graphql"))
	http.Handle("/graphql", srv)

	log.Printf("connect to http://localhost:%s/ for GraphQL playground", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
