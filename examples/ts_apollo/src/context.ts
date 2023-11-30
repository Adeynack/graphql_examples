import { StandaloneServerContextFunctionArgument } from '@apollo/server/dist/esm/standalone';
import { ApiSession, PrismaClient } from '@prisma/client';
import { randomBytes } from 'crypto';
import { GraphQLError } from 'graphql';
import { IncomingMessage } from 'http';
import once from 'lodash/once.js';
import { env } from 'process';

export class Context {
  constructor(
    readonly request: IncomingMessage,
    readonly queryIdentifier: string,
    readonly db: PrismaClient,
    readonly serverSalt: string,
    readonly currentSession: ApiSession | null
  ) {}

  getCurrentUser = once(
    async () => this.currentSession && (await this.db.user.findUnique({ where: { id: this.currentSession.userId } }))
  );

  authorize = async (): Promise<void> => {
    // For this simple example, there is just one level of authorization: "Is the user logged in?"
    if (!(await this.getCurrentUser())) throw new GraphQLError('Not authorized');
  };
}

type ContextFactory = (input: StandaloneServerContextFunctionArgument) => Promise<Context>;

const db = new PrismaClient({ log: ['query'] });
const serverSalt = env['SERVER_SALT'];

export function createContextFactory(): ContextFactory {
  return async ({ req }) => {
    const currentSession = await extractCurrentSession(req);
    const queryIdentifier = extractQueryIdentifier(req);
    return new Context(req, queryIdentifier, db, serverSalt, currentSession);
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
  const queryIdentifiers = req.headers['x-query-identifier'];
  const queryIdentifier = Array.isArray(queryIdentifiers) ? queryIdentifiers[0] : queryIdentifiers;
  const namedPart = queryIdentifier === '' ? Math.floor(Date.now() / 1000).toString() : queryIdentifier;
  const idSuffix = randomBytes(2).toString('hex');
  return `${namedPart}-${idSuffix}`;
}
