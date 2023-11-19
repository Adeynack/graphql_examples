import { PrismaClient } from '@prisma/client';
import { IncomingMessage } from 'http';

export type Context = {
  db: PrismaClient;
  authorizationHeader: string;
};

type ContextFactory = (input: { req: IncomingMessage }) => Promise<Context>;

const prismaClient = new PrismaClient({ log: ['query'] });

export function createContextFactory(): ContextFactory {
  return async ({ req }: { req: IncomingMessage }) => {
    return {
      db: prismaClient,
      authorizationHeader: req.headers.authorization,
    };
  };
}
