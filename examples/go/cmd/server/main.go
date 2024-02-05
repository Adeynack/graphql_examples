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
	"github.com/adeynack/graphql_examples/examples/go/service"
	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
)

const defaultPort = "30301"

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}

	resolver := resolvers.InitializeResolver()
	srv := handler.NewDefaultServer(graph.NewExecutableSchema(graph.Config{Resolvers: resolver}))
	srv.SetErrorPresenter(graph.ErrorPresenter)
	srv.SetRecoverFunc(graph.RecoverFunc)

	router := chi.NewRouter()
	router.Use(middleware.Logger)
	router.Use(service.AuthenticationMiddleware(resolver.DB))
	router.Handle("/", playground.Handler("GraphQL playground", "/graphql"))
	router.Handle("/graphql", srv)
	router.Post("/data_resets", service.DataResetHandler(resolver.DB, resolver.ServerSalt))

	log.Printf("connect to http://localhost:%s/ for GraphQL playground", port)
	log.Fatal(http.ListenAndServe(":"+port, router))
}
