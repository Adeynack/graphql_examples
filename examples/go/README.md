# Go

## Stack

| Topic   | Library                                       |
| ------- | --------------------------------------------- |
| GraphQL | [gqlgen](https://gqlgen.com/getting-started/) |
| ORM     | [gorm](https://gorm.io/docs/)                 |

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

## Technical Decisions

### Use `string` instead of `uuid` in Go

By starting using `uuid.Uuid` for `ID` columns, I realized while debugging that the database driver communicates `UUID`s as strings (put a breakpoint in `uuid.Parse` and load any model from `Gorm` to observe it does). Since this API is mainly loading from the database and serving the data, leaving it as `string` makes perfect sense, instead of parsing from `string` to `uuid.Uuid`, only to then marshal it back to `string` in the GraphQL layer. Those 2 operations can simply be avoided by managing the whole thing as a string.

If the database protocol and/or driver would have communicated the whole thing as bytes, then it would have been worth to manage it as `uuid.Uuid` in the code and marshal it to `string` at the very end (in the GraphQL layer); but since it's not the case, the decision was made to simply drop the `uuid.Uuid` type in the model layer and keep IDs as strings.

## Developper Notes

### Partial patch

Look at this option in `gqlgen.yml`.

```yaml
# Optional: wrap nullable input fields with Omittable
# nullable_input_omittable: true
```
