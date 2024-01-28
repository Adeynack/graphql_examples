# Go

## Stack

| Topic   | Library                                       |
| ------- | --------------------------------------------- |
| GraphQL | [gqlgen](https://gqlgen.com/getting-started/) |
| ORM     | ?? gorm                                       |

## Project Structure

Adapted from _[Building the server](https://gqlgen.com/getting-started/#building-the-server)_.

```
├── go.mod
├── go.sum
├── gqlgen.yml               - The gqlgen config file, knobs for controlling the generated code.
├── graph
│   ├── generated            - A package that only contains the generated runtime
│   │   └── generated.go
│   ├── model                - A package for all your graph models, generated or otherwise
│   │   └── models_gen.go
│   ├── resolver.go          - The root graph resolver type. This file wont get regenerated
│   ├── schema.graphqls      - Some schema. You can split the schema into as many graphql files as you like
│   └── schema.resolvers.go  - the resolver implementation for schema.graphql
└── server.go                - The entry point to your app. Customize it however you see fit
```

## Notes

### Partial patch

Look at this option in `gqlgen.yml`.

```yaml
# Optional: wrap nullable input fields with Omittable
# nullable_input_omittable: true
```
