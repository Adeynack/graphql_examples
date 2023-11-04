import { PrismaClient } from '@prisma/client';
import { IncomingMessage } from 'http';

export type Context = {
  db: PrismaClient;
  authorizationHeader: string;
};

export async function createContext({ req }: { req: IncomingMessage }): Promise<Context> {
  return {
    db: initializeDatabaseClient(),
    authorizationHeader: req.headers.authorization,
  };
}

function initializeDatabaseClient(): PrismaClient {
  return new PrismaClient();
}
