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
    - [Maintaining Initial Database State](#maintaining-initial-database-state)
  - [Service Dependencies](#service-dependencies)
    - [Docker \& docker-compose](#docker--docker-compose)
      - [Linux](#linux)
      - [macOS](#macos)
  - [Ideas for the future](#ideas-for-the-future)

## Where to find implementations?

In the `examples` folder of this repository, named by convention `language_framework_library`
(examples: `ruby_on_rails_ruby_graphql`, `rust_juniper`).

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

See [mutations](mutation.md).

### Goals

#### Avoid N+1 Queries to the Database

Use batch loading when available to the language and framework of choice.

## Tests

An implementation agnostic test suite, in _JavaScript_, is in `tests`.

To execute, set the `EXAMPLE` environment variable to the directory name
you want to test (subdirectory of `examples`) and call `yarn mocha` from
the `tests` directory.

```bash
EXAMPLE=ruby_on_rails_ruby_graphql yarn test
EXAMPLE=ruby_on_rails_ruby_graphql yarn test tests/scenarios/users.test.ts
```

For watch file and only execute a single file on save:

```bash
EXAMPLE=ruby_on_rails_ruby_graphql yarn watch
EXAMPLE=ruby_on_rails_ruby_graphql yarn watch tests/scenarios/users.test.ts
```

## Development

### Generate PlantUML Diagrams as Images

At this moment, generating them using the [_PlantUML_ plugin of _VSCode_](https://marketplace.visualstudio.com/items?itemName=jebbs.plantuml),
calling the _PlantUML: Export Workspace Diagrams_ command, and choosing _png_.

### Maintaining Initial Database State

```bash
pg_dump --format=p --file=tests/initial_test_data.sql --clean
```

## Service Dependencies

A _Docker Compose_ file is provided. All required database and other
services are included in.

```bash
docker-compose up
```

### Docker & docker-compose

#### Linux

```bash
sudo apt-get install -y docker docker-compose
```

#### macOS

Follow [this link](https://docs.docker.com/docker-for-mac/install/) for install instructions.

## Ideas for the future

- Connections/Nodes/Edges
  - Arrays can be paginated
- Relay-Style Object Identification
  - Objects export their GID
  - Objects are obtainable from their GID
