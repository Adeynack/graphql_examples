import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { readFileSync } from 'fs';
import queryType from './queryType.js';

const typeDefs = readFileSync('src/typeDefs.graphql').toString();

const resolvers = {
  Query: queryType,
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

// eslint-disable-next-line no-console
console.log(`🚀  Server ready at: ${url}`);

// NEXT STEPS: https://www.apollographql.com/docs/apollo-server/getting-started#next-steps
