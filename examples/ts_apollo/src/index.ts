import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { readFileSync } from 'fs';
// import { queryResolver } from './queryResolver.js';
import { context } from './context.js';
import { Resolvers } from './__generated__/graphql.js';
import queryResolver from './queryResolver.js';

const typeDefs = readFileSync('src/typeDefs.graphql').toString();

const resolvers: Resolvers = {
  Query: queryResolver,
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
  context,
});

// eslint-disable-next-line no-console
console.log(`🚀  Server ready at: ${url}`);

// NEXT STEPS: https://www.apollographql.com/docs/apollo-server/data/errors
