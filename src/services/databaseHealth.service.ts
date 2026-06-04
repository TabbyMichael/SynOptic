import { Pool } from 'pg';
import { env } from '../config/env';

export class DatabaseHealthService {
  pool: Pool;
  constructor(connectionString?: string){
    this.pool = new Pool({ connectionString: connectionString ?? env.DATABASE_URL });
  }

  async check(){
    const client = await this.pool.connect();
    try{
      const res = await client.query('SELECT 1 as ok');
      return { ok: true, latency_ms: 0 };
    }catch(err){
      return { ok: false, error: String(err) };
    }finally{
      client.release();
    }
  }
}

export const databaseHealthService = new DatabaseHealthService();
