import { BaseContext } from '@apollo/server';
import { IncomingMessage } from 'http';

// Temporary in-memory store, until database support is implemented.
const store = {
  users: [
    {
      id: 'c63f9383-bdad-4dcf-ae1c-779ab9e72d4c',
      email: 'joe@example.com',
      name: 'Joe',
      password: 'joe',
    },
    {
      id: '249550fe-b5b6-4e1c-ad38-eea80c9fd29a',
      email: 'linda@example.com',
      name: 'Linda',
      password: 'linda',
    },
  ],
};

export interface Context {
  store: typeof store;
  authorizationHeader: string;
}

export async function context({ req }: { req: IncomingMessage }): Promise<Context> {
  return {
    store,
    authorizationHeader: req.headers.authorization,
  };
}
