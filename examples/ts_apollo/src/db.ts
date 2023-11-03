import { Sequelize } from 'sequelize';

export async function initializeDatabase(): Promise<Sequelize> {
  const sequelize = new Sequelize({
    dialect: 'postgres',
    database: 'postgres',
    username: 'postgres',
    host: '127.0.0.1',
    schema: 'ts_apollo_development',
  });

  await sequelize.authenticate();
  return sequelize;
}
