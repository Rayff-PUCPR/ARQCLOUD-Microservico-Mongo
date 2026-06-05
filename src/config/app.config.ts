import { config as loadEnv } from 'dotenv';

loadEnv();

export type PersistenceDriver = 'memory' | 'mongodb-atlas';

export function getPersistenceDriver(): PersistenceDriver {
  const driver = process.env.PERSISTENCE_DRIVER ?? 'memory';
  if (driver !== 'memory' && driver !== 'mongodb-atlas') {
    throw new Error(`Invalid PERSISTENCE_DRIVER: ${driver}`);
  }

  return driver;
}

export function getMongoConfig() {
  const required = ['MONGODB_URI', 'MONGODB_DATABASE'];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing MongoDB environment variables: ${missing.join(', ')}`);
  }

  return {
    uri: process.env.MONGODB_URI!,
    database: process.env.MONGODB_DATABASE!,
    collection: process.env.MONGODB_ROUTES_COLLECTION ?? 'routes',
    serverSelectionTimeoutMS: Number(process.env.MONGODB_SERVER_SELECTION_TIMEOUT_MS ?? 15000),
    connectTimeoutMS: Number(process.env.MONGODB_CONNECT_TIMEOUT_MS ?? 15000)
  };
}
