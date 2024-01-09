import { DataSource, DataSourceOptions } from 'typeorm';

// Config connection to database for migration (production)
export const appDataSource = new DataSource({
  type: 'sqlite',
  database: 'db.sqlite',
  entities: ['**/*.entity.ts'],
  migrations: [__dirname, '/migrations/*.ts'], // location of migration files
} as DataSourceOptions);
