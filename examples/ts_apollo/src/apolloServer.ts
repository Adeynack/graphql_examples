import fs from 'fs';
import { ApolloServer } from '@apollo/server';
import { LoggingPlugin } from './loggingPlugin.js';
import { Resolvers } from './__generated__/graphql';
import query from './resolvers/query.js';
import mutation from './resolvers/mutation.js';
import post from './resolvers/post.js';
import user from './resolvers/users.js';
import { Context } from './context.js';
import http from 'http';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';

const typeDefs = fs.readFileSync('src/typeDefs.graphql').toString();

const resolvers: Resolvers = {
  Query: query,
  Mutation: mutation,
  Post: post,
  User: user,
};

export async function createApolloServer(
  httpServer: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>
): Promise<ApolloServer<Context>> {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer }), new LoggingPlugin()],
  });
  await server.start();
  return server;
}
