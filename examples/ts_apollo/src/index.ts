/* eslint-disable no-console */
import { createContextFactory } from './context.js';
import { config } from 'dotenv';
import express from 'express';
import { env } from 'process';
import { expressMiddleware } from '@apollo/server/express4';
import http from 'http';
import { createApolloServer } from './apolloServer.js';
import cors from 'cors';
import { exec } from 'child_process';
import { promisify } from 'util';

config({ path: '.env' });

const port = env.port || 30101;
const app = express();
const httpServer = http.createServer(app);
const apolloServer = await createApolloServer(httpServer);
const apolloServerExpressMiddleware = expressMiddleware(apolloServer, {
  context: createContextFactory(),
});

app.use('/graphql', cors(), express.json(), apolloServerExpressMiddleware);

app.post('/data_resets', async (_req, res) => {
  console.log('Data reset triggered...');
  await promisify(exec)('npx prisma db seed -- --environment development --truncateAllData');
  console.log('Data reset completed.');
  res.send('OK\n');
});

app.listen(port, () => {
  console.log(`🚀  Server ready on port ${port}`);
});
