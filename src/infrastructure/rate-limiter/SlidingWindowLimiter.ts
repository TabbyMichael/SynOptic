import { Pool } from 'pg'
import logger from '../../lib/logger'
import type { IRateLimiter, RateLimitResult } from './IRateLimiter'
import type { RateLimitRule } from './RateLimitPolicy'

const DEFAULT_TABLE = 'rate_limit_hits'

export class SlidingWindowLimiter implements IRateLimiter {
  private pool: Pool
  private table: string

  constructor(poolOrConnectionString?: Pool | string, tableName = DEFAULT_TABLE) {
    if (!poolOrConnectionString) {
      const conn = process.env.DATABASE_URL || process.env.PG_CONNECTION_STRING
      if (!conn) throw new Error('No Postgres connection string provided for sliding window limiter')
      this.pool = new Pool({ connectionString: conn })
    } else if (typeof poolOrConnectionString === 'string') {
      this.pool = new Pool({ connectionString: poolOrConnectionString })
    } else {
      this.pool = poolOrConnectionString
    }
    this.table = tableName
    void this.ensureTable()
  }

  private async ensureTable() {
    const sql = `
      CREATE TABLE IF NOT EXISTS ${this.table} (
        id bigserial PRIMARY KEY,
        key text NOT NULL,
        weight integer NOT NULL DEFAULT 1,
        ts timestamptz NOT NULL DEFAULT now()
      );
      CREATE INDEX IF NOT EXISTS idx_${this.table}_key_ts ON ${this.table} (key, ts);
    `
    try {
      await this.pool.query(sql)
    } catch (err) {
      logger.error({ err }, 'Failed to ensure rate_limit_hits table')
    }
  }

  async allow(key: string, cost = 1, rule?: RateLimitRule): Promise<RateLimitResult> {
    if (!rule) throw new Error('SlidingWindowLimiter requires a rule parameter')
    const windowSeconds = rule.windowSeconds
    const limit = rule.limit
    const client = await this.pool.connect()
    try {
      await client.query('BEGIN')
      const countRes = await client.query(
        `SELECT COALESCE(SUM(weight),0) as cnt FROM ${this.table} WHERE key = $1 AND ts >= now() - ($2 || ' seconds')::interval`,
        [key, windowSeconds]
      )
      const current = Number(countRes.rows[0].cnt || 0)
      const newCount = current + cost
      if (newCount <= limit) {
        await client.query(`INSERT INTO ${this.table} (key, weight, ts) VALUES ($1, $2, now())`, [key, cost])
        await client.query('COMMIT')
        return { allowed: true, remaining: limit - newCount }
      }
      await client.query('COMMIT')
      return { allowed: false, remaining: 0 }
    } catch (err) {
      await client.query('ROLLBACK')
      logger.error({ err, key }, 'SlidingWindowLimiter.allow failed')
      return { allowed: true, remaining: Number.POSITIVE_INFINITY }
    } finally {
      client.release()
    }
  }
}

export default SlidingWindowLimiter
