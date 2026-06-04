import { sql } from 'drizzle-orm';
import { db } from '../../drizzle/config';

export class DatabaseHealthService {
  static async check() {
    try {
      const start = Date.now();
      await db.execute(sql`SELECT 1`);
      const latency = Date.now() - start;

      return {
        status: 'healthy',
        latency: `${latency}ms`,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      };
    }
  }
}
