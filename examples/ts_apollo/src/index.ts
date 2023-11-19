import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { readFileSync } from 'fs';
// import { queryResolver } from './queryResolver.js';
import { createContext } from './context.js';
import { Resolvers } from './__generated__/graphql.js';
import queryResolver from './resolvers/query.js';
import postResolvers from './resolvers/post.js';
import { config } from 'dotenv';

config({ path: '.env' });
const typeDefs = readFileSync('src/typeDefs.graphql').toString();

const resolvers: Resolvers = {
  Query: queryResolver,
  Post: postResolvers,
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
  context: createContext,
});

// eslint-disable-next-line no-console
console.log(`🚀  Server ready at: ${url}`);

// NEXT STEPS: https://www.apollographql.com/docs/apollo-server/data/errors
