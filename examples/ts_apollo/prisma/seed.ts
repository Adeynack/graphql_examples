/* eslint-disable no-console */
import { PrismaClient } from '@prisma/client';
import { generatePasswordDigest } from '../src/models/user.js';
import { parseArgs } from 'util';

const options = {
  environment: { type: 'string', default: 'development' },
} as const;

const db = new PrismaClient();

async function seedDevelopment(): Promise<void> {
  [
    {
      email: 'joe@example.com',
      name: 'Joe',
      passwordDigest: generatePasswordDigest('joe'),
    },
    {
      email: 'linda@example.com',
      name: 'Linda',
      passwordDigest: generatePasswordDigest('linda'),
    },
  ].forEach(async (user) => {
    await db.user.upsert({
      where: { email: user.email },
      update: user,
      create: user,
    });
  });
}

async function seedProduction(): Promise<void> {
  throw new Error('Function not implemented.');
}

async function main(): Promise<void> {
  const {
    values: { environment },
  } = parseArgs({ options });
  switch (environment) {
    case 'development':
      await seedDevelopment();
      break;
    case 'production':
      await seedProduction();
      break;
    default:
      throw new Error(`unknown environment "${environment}"`);
  }
}

main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });
