/* eslint-disable no-console */
import { PrismaClient } from '@prisma/client';
import { seedDevelopment } from './seeds/development.js';
import { seedProduction } from './seeds/production.js';
import { parseArgs } from 'util';

const options = {
  environment: { type: 'string', default: 'development' },
  truncateAllData: { type: 'boolean', default: false },
} as const;

const db = new PrismaClient({ log: ['query', 'info', 'error', 'warn'] });

async function main(): Promise<void> {
  const {
    values: { environment, truncateAllData },
  } = parseArgs({ options });

  if (truncateAllData) doTruncateAllData(db);

  switch (environment) {
    case 'development':
      await seedDevelopment(db);
      break;
    case 'production':
      await seedProduction();
      break;
    default:
      throw new Error(`unknown environment "${environment}"`);
  }
}

async function doTruncateAllData(db: PrismaClient): Promise<void> {
  const models = Object.getOwnPropertyNames(db).filter(
    (x) => x !== 'constructor' && !x.toString().startsWith('$') && !x.toString().startsWith('_')
  );
  for (const model of models) {
    await db[model].deleteMany();
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
