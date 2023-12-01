# graphql_examples Tests

- [graphql_examples Tests](#graphql_examples-tests)
  - [Tests](#tests)
  - [Development](#development)
    - [Generate PlantUML Diagrams as Images](#generate-plantuml-diagrams-as-images)
  - [Service Dependencies and Development Container](#service-dependencies-and-development-container)
    - [Don't want to use vscode?](#dont-want-to-use-vscode)
  - [Ideas for the future](#ideas-for-the-future)

## Tests

To execute, set the `EXAMPLE` environment variable to the directory name
you want to test (subdirectory of `examples`) and call `yarn test` from
the `tests` directory.

```bash
EXAMPLE=rails yarn test
EXAMPLE=rails yarn test tests/scenarios/users.test.ts
```

For watch file and only execute a single file on save:

```bash
EXAMPLE=rails yarn watch
EXAMPLE=rails yarn watch tests/scenarios/users.test.ts
```
