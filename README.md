# graphql_examples

Compare different implementations of GraphQL on the server side. A bit like TodoMVC, but
with a different example, showing features of GraphQL and how to implement them in various
languages and frameworks.

- [graphql\_examples](#graphql_examples)
  - [Where to find implementations?](#where-to-find-implementations)
  - [Application to build](#application-to-build)
    - [Data Model](#data-model)
    - [GraphQL Schema](#graphql-schema)
      - [Query Object](#query-object)
      - [Mutations](#mutations)
    - [Goals](#goals)
      - [Avoid N+1 Queries to the Database](#avoid-n1-queries-to-the-database)
  - [Tests](#tests)
  - [Development](#development)
    - [Generate PlantUML Diagrams as Images](#generate-plantuml-diagrams-as-images)
  - [Service Dependencies and Development Container](#service-dependencies-and-development-container)
    - [Don't want to use vscode?](#dont-want-to-use-vscode)
  - [Ideas for the future](#ideas-for-the-future)

## Where to find implementations?

In the `examples` folder of this repository, named by convention `language_framework_library`
(examples: `rails`, `ts_apollo`).

## Application to build

A minimalist post system, à la Facebook, with users, posts, comments and a possibility
to _like_ the posts.

### Data Model

![Data model](out/model/Models.svg)

A post

- belongs to a user
- has many likes
- may belong to a parent post, if its a comment

A like

- belongs to a post
- belongs to a user

A user

- has many posts
- has many likes

### GraphQL Schema

#### Query Object

![GraphQL Query Object](out/schema_query/schema_query-1.svg)

#### Mutations

See [mutations](mutations.md).

### Goals

#### Avoid N+1 Queries to the Database

Use batch loading when available to the language and framework of choice.

## Tests

An implementation agnostic test suite, in _JavaScript_, is in `tests`.

See [tests/README.md](./tests/README.md).

## Development

### Generate PlantUML Diagrams as Images

At this moment, generating them using the [_PlantUML_ plugin of _VSCode_](https://marketplace.visualstudio.com/items?itemName=jebbs.plantuml),
calling the _PlantUML: Export Workspace Diagrams_ command, and choosing _svg_.

## Service Dependencies and Development Container

This workspace is set up for _Visual Studio Code_ and includes a [devcontainer](https://code.visualstudio.com/docs/devcontainers/containers).

Upon opening it up in _Visual Studio Code_, click _Open in container_ in the bottom-right popup that appears. The required services (eg: _PostgreSQL_) and the development environment itself will build (only once) and then you're all set to work on this project, without installing anything else than _Docker_ and _Visual Studio Code_ on your computer.

### Don't want to use vscode?

It is absolutely possible to use the _devcontainer_ without using _Visual Studio Code_. Execute the following command from the root of the workspace, and

```bash
docker compose -f .devcontainer/docker-compose.yml up
# in another terminal tab/window
bin/attach_docker
```

## Ideas for the future

- Connections/Nodes/Edges
  - Arrays can be paginated
- Relay-Style Object Identification
  - Objects export their GID
  - Objects are obtainable from their GID
