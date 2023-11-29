import { StandaloneServerContextFunctionArgument } from '@apollo/server/dist/esm/standalone';
import { ApiSession, PrismaClient, User } from '@prisma/client';
import { GraphQLError } from 'graphql';
import { IncomingMessage } from 'http';
import once from 'lodash/once.js';
import { env } from 'process';

// class Context {
//   constructor(
//     readonly request: IncomingMessage,
//     readonly db: PrismaClient,
//     readonly serverSalt: string,
//     readonly currentSession: ApiSession | null
//   ) {}

//   // memoized to avoid querying the database for nothing if the user is not needed by the current request
//   currentUser = once(async (): Promise<User | null> => {
//     return this.currentSession && (await this.db.user.findUnique({ where: { id: this.currentSession.userId } }));
//   });
// }

export type Context = {
  request: IncomingMessage;
  queryIdentifier: string;
  db: PrismaClient;
  serverSalt: string;
  currentSession: ApiSession | null;
  getCurrentUser: () => Promise<User | null>;
};

type ContextFactory = (input: StandaloneServerContextFunctionArgument) => Promise<Context>;

const db = new PrismaClient({ log: ['query'] });
const serverSalt = env['SERVER_SALT'];

export function createContextFactory(): ContextFactory {
  return async ({ req }) => {
    const currentSession = await extractCurrentSession(req);

    return {
      request: req,
      queryIdentifier: extractQueryIdentifier(req),
      db,
      serverSalt,
      currentSession,
      getCurrentUser: once(
        async (): Promise<User | null> =>
          currentSession && (await db.user.findUnique({ where: { id: currentSession.userId } }))
      ),
    } as const;
  };
}

const bearerTokenPrefix = 'Bearer ' as const;
const bearerTokenPrefixLength = bearerTokenPrefix.length;

async function extractCurrentSession(req: IncomingMessage): Promise<ApiSession | null> {
  const bearerToken = req.headers.authorization;
  if (!bearerToken || bearerToken === '') return null; // no token, no session, but no error.

  if (!bearerToken.startsWith(bearerTokenPrefix)) failFromInvalidToken();

  const token = bearerToken.substring(bearerTokenPrefixLength);
  const session = await db.apiSession.findUnique({ where: { token } });
  if (!session) failFromInvalidToken();

  return session;
}

function failFromInvalidToken(): void {
  throw new GraphQLError('Invalid bearer token', { extensions: { http: { status: 401 } } });
}

function extractQueryIdentifier(req: IncomingMessage): string {
  const queryIdentifier = req.headers['x-query-identifier'];
  if (Array.isArray(queryIdentifier)) {
    return queryIdentifier[0];
  } else {
    return queryIdentifier;
  }
}
