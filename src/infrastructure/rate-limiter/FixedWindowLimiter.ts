import { Pool } from 'pg'
import logger from '../../lib/logger'
import type { RateLimitRule } from './RateLimitPolicy'
import type { IRateLimiter, RateLimitResult } from './IRateLimiter'

const DEFAULT_TABLE = 'rate_limits'

export class FixedWindowLimiter implements IRateLimiter {
  private pool: Pool
  private table: string
  private defaultRule: RateLimitRule

  constructor(defaultRule: RateLimitRule, poolOrConnectionString?: Pool | string, tableName = DEFAULT_TABLE) {
    this.defaultRule = defaultRule
    if (!poolOrConnectionString) {
      const conn = process.env.DATABASE_URL || process.env.PG_CONNECTION_STRING
      if (!conn) throw new Error('No Postgres connection string provided for rate limiter')
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
        key text UNIQUE NOT NULL,
        count bigint NOT NULL DEFAULT 0,
        window_start timestamptz NOT NULL,
        expires_at timestamptz NULL,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      );
      CREATE INDEX IF NOT EXISTS idx_${this.table}_key ON ${this.table} (key);
    `
    try {
      await this.pool.query(sql)
    } catch (err) {
      logger.error({ err }, 'Failed to ensure rate_limits table')
    }
  }

  private windowStartFor(now: number, windowSeconds: number): Date {
    const start = Math.floor(now / (windowSeconds * 1000)) * windowSeconds * 1000
    return new Date(start)
  }

  async allow(key: string, cost = 1, rule?: RateLimitRule): Promise<RateLimitResult> {
    const r = rule ?? this.defaultRule
    const now = Date.now()
    const windowStart = this.windowStartFor(now, r.windowSeconds)
    const windowEnd = new Date(windowStart.getTime() + r.windowSeconds * 1000)

    const client = await this.pool.connect()
    try {
      await client.query('BEGIN')
      const res = await client.query(`SELECT count, window_start FROM ${this.table} WHERE key = $1 FOR UPDATE`, [key])
      let newCount = cost
      if (!res.rowCount) {
        await client.query(`INSERT INTO ${this.table} (key, count, window_start, expires_at) VALUES ($1, $2, $3, $4)`, [key, newCount, windowStart, windowEnd])
      } else {
        const row = res.rows[0]
        const existingWindowStart = new Date(row.window_start)
        if (existingWindowStart.getTime() < windowStart.getTime()) {
          // new window
          newCount = cost
          await client.query(`UPDATE ${this.table} SET count = $1, window_start = $2, expires_at = $3, updated_at = now() WHERE key = $4`, [newCount, windowStart, windowEnd, key])
        } else {
          newCount = Number(row.count) + cost
          await client.query(`UPDATE ${this.table} SET count = $1, updated_at = now() WHERE key = $2`, [newCount, key])
        }
      }
      await client.query('COMMIT')

      const allowed = newCount <= r.limit
      const remaining = allowed ? r.limit - newCount : 0
      const resetSeconds = Math.max(0, Math.ceil((windowEnd.getTime() - now) / 1000))
      return { allowed, remaining, resetSeconds }
    } catch (err) {
      await client.query('ROLLBACK')
      logger.error({ err, key }, 'FixedWindowLimiter.allow failed')
      // in doubt allow (fail open) to avoid DoS on clients, but log
      return { allowed: true, remaining: Number.POSITIVE_INFINITY }
    } finally {
      client.release()
    }
  }

  async reset(key: string): Promise<void> {
    await this.pool.query(`DELETE FROM ${this.table} WHERE key = $1`, [key])
  }
}

export default FixedWindowLimiter
