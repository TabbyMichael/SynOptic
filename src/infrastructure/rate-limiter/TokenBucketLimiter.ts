import { Pool } from 'pg'
import logger from '../../lib/logger'
import type { IRateLimiter, RateLimitResult } from './IRateLimiter'

const DEFAULT_TABLE = 'token_buckets'

export interface TokenBucketOptions {
  capacity: number
  refillRatePerSecond: number
}

export class TokenBucketLimiter implements IRateLimiter {
  private pool: Pool
  private table: string
  private options: TokenBucketOptions

  constructor(options: TokenBucketOptions, poolOrConnectionString?: Pool | string, tableName = DEFAULT_TABLE) {
    this.options = options
    if (!poolOrConnectionString) {
      const conn = process.env.DATABASE_URL || process.env.PG_CONNECTION_STRING
      if (!conn) throw new Error('No Postgres connection string provided for token bucket')
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
        tokens double precision NOT NULL,
        capacity integer NOT NULL,
        refill_rate double precision NOT NULL,
        last_refill timestamptz NOT NULL,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      );
      CREATE INDEX IF NOT EXISTS idx_${this.table}_key ON ${this.table} (key);
    `
    try {
      await this.pool.query(sql)
    } catch (err) {
      logger.error({ err }, 'Failed to ensure token_buckets table')
    }
  }

  private nowSeconds() {
    return Date.now() / 1000
  }

  async allow(key: string, cost = 1): Promise<RateLimitResult> {
    const client = await this.pool.connect()
    try {
      await client.query('BEGIN')
      const res = await client.query(`SELECT tokens, capacity, refill_rate, last_refill FROM ${this.table} WHERE key = $1 FOR UPDATE`, [key])
      const now = new Date()
      let tokens = this.options.capacity
      let capacity = this.options.capacity
      let refillRate = this.options.refillRatePerSecond

      if (!res.rowCount) {
        // create fresh
        tokens = Math.max(0, capacity - cost)
        await client.query(`INSERT INTO ${this.table} (key, tokens, capacity, refill_rate, last_refill) VALUES ($1, $2, $3, $4, $5)`, [key, tokens, capacity, refillRate, now])
        await client.query('COMMIT')
        const remaining = Math.max(0, Math.floor(tokens))
        return { allowed: true, remaining }
      }

      const row = res.rows[0]
      tokens = Number(row.tokens)
      capacity = Number(row.capacity)
      refillRate = Number(row.refill_rate)
      const lastRefill = new Date(row.last_refill)

      const elapsed = Math.max(0, (now.getTime() - lastRefill.getTime()) / 1000)
      tokens = Math.min(capacity, tokens + elapsed * refillRate)

      if (tokens >= cost) {
        tokens -= cost
        await client.query(`UPDATE ${this.table} SET tokens = $1, last_refill = $2, updated_at = now() WHERE key = $3`, [tokens, now, key])
        await client.query('COMMIT')
        return { allowed: true, remaining: Math.floor(tokens) }
      }

      // not enough tokens, compute retryAfter
      const deficit = cost - tokens
      const retryAfter = Math.ceil(deficit / refillRate)
      await client.query('COMMIT')
      return { allowed: false, remaining: 0, resetSeconds: retryAfter }
    } catch (err) {
      await client.query('ROLLBACK')
      logger.error({ err, key }, 'TokenBucketLimiter.allow failed')
      return { allowed: true, remaining: Number.POSITIVE_INFINITY }
    } finally {
      client.release()
    }
  }

  async reset(key: string): Promise<void> {
    await this.pool.query(`DELETE FROM ${this.table} WHERE key = $1`, [key])
  }
}

export default TokenBucketLimiter
