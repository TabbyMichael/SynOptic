import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../../../drizzle/schema';
import { logger } from '../logger/logger.service';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on('error', (err) => {
  logger.error({ err }, 'Unexpected error on idle client');
  process.exit(-1);
});

export const db = drizzle(pool, { schema });

export type Database = typeof db;
