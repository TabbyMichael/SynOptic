import { sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../../drizzle/schema';
import { env } from '../../src/config/env';

const pool = new Pool({
  connectionString: env.TEST_DATABASE_URL,
});

export const testDb = drizzle(pool, { schema });

export async function clearDatabase() {
  const tables = Object.values(schema).filter((s: any) => s.dbName);
  
  for (const table of tables) {
    await testDb.execute(sql.raw(`TRUNCATE TABLE "${(table as any).dbName}" CASCADE`));
  }
}

export async function closeConnection() {
  await pool.end();
}
