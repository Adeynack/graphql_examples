import { PrismaClient } from '@prisma/client';
import { IncomingMessage } from 'http';
import { env } from 'process';

export type Context = {
  db: PrismaClient;
  authorizationHeader: string;
  serverSalt: string;
};

type ContextFactory = (input: { req: IncomingMessage }) => Promise<Context>;

const prismaClient = new PrismaClient({ log: ['query'] });
const serverSalt = env['SERVER_SALT'];

export function createContextFactory(): ContextFactory {
  return async ({ req }: { req: IncomingMessage }) => {
    return {
      db: prismaClient,
      serverSalt,
      authorizationHeader: req.headers.authorization,
    };
  };
}
