import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { readFileSync } from 'fs';
import { createContextFactory } from './context.js';
import { Resolvers } from './__generated__/graphql.js';
import { config } from 'dotenv';
import query from './resolvers/query.js';
import post from './resolvers/post.js';
import user from './resolvers/users.js';
import mutation from './resolvers/mutation.js';

config({ path: '.env' });
const typeDefs = readFileSync('src/typeDefs.graphql').toString();

const resolvers: Resolvers = {
  Query: query,
  Mutation: mutation,
  Post: post,
  User: user,
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
  context: createContextFactory(),
});

// eslint-disable-next-line no-console
console.log(`🚀  Server ready at: ${url}`);

// NEXT STEPS: https://www.apollographql.com/docs/apollo-server/data/errors
