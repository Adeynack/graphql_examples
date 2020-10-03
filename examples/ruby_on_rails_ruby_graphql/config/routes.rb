# frozen_string_literal: true

Rails.application.routes.draw do
  post "/api/graphql", to: "graphql#execute", via: [:get, :post]
  mount GraphiQL::Rails::Engine, at: "/api/graphiql", graphql_path: "/api/graphql"
  mount GraphqlPlayground::Rails::Engine, at: "/api/playground", graphql_path: "/api/graphql"
end
