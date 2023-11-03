# ts-apollo

## Stack

- [TypeScript](https://www.typescriptlang.org/)
- [Apollo Server](https://www.apollographql.com/docs/apollo-server)

## DevOps

### Database / Models

TODO

#### History of models creation

TODO

## Solving N+1

Not implemented yet.

### Potential solutions within this stack

- [Prisma](https://www.prisma.io/)
  - TODO: Find a way to solve N+1 with _Prisma_
- [Sequelize](https://sequelize.org/) + [sequelize-proxy](https://github.com/oney/sequelize-proxy)
  - 🛑 Its generated code (from its CLI) do not play well with the current TS setup of this project
  - https://dev.to/zipy/sequelize-and-typescript-integration-a-practical-tutorial-5ha3

### Potential solutions in other stacks

- https://www.scalablepath.com/full-stack/graphql-api-full-stack-tutorial-part-1
  - https://www.graphile.org/postgraphile/performance/
- https://hackernoon.com/the-easiest-way-to-solve-n1-problem-on-graphql-s8283tgz
