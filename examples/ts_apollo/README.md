# ts-apollo

## Stack

- [TypeScript](https://www.typescriptlang.org/)
- [Apollo Server](https://www.apollographql.com/docs/apollo-server)

## DevOps

### Database / Models

Run `npx sequelize-cli` to see a list of commands.

#### History of models creation

```bash
npx sequelize-cli model:generate --name User --attributes email:string,name:string,password_digest:string
```

## Solving N+1

Not implemented yet.

### Solutions within this stack

- [Sequelize](https://sequelize.org/) + [sequelize-proxy](https://github.com/oney/sequelize-proxy)
  - https://dev.to/zipy/sequelize-and-typescript-integration-a-practical-tutorial-5ha3

### Solutions in other stacks

- https://www.scalablepath.com/full-stack/graphql-api-full-stack-tutorial-part-1
  - https://www.graphile.org/postgraphile/performance/
- https://hackernoon.com/the-easiest-way-to-solve-n1-problem-on-graphql-s8283tgz
