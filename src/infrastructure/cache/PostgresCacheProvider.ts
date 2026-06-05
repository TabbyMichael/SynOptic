import { Pool } from 'pg'
import logger from '../../lib/logger'
import type { ICacheProvider, ICacheMetadata } from './CacheProvider'
import { CacheUnavailableError } from './CacheErrors'

const DEFAULT_TABLE = 'cache_entries'

export class PostgresCacheProvider implements ICacheProvider {
  private pool: Pool
  private table: string

  constructor(poolOrConnectionString?: Pool | string, tableName = DEFAULT_TABLE) {
    if (!poolOrConnectionString) {
      const conn = process.env.DATABASE_URL || process.env.PG_CONNECTION_STRING
      if (!conn) throw new Error('No Postgres connection string provided')
      this.pool = new Pool({ connectionString: conn })
    } else if (typeof poolOrConnectionString === 'string') {
      this.pool = new Pool({ connectionString: poolOrConnectionString })
    } else {
      this.pool = poolOrConnectionString
    }
    this.table = tableName
    void this.ensureTable()
  }

  private async ensureTable(): Promise<void> {
    const create = `
      CREATE TABLE IF NOT EXISTS ${this.table} (
        id bigserial PRIMARY KEY,
        cache_key text UNIQUE NOT NULL,
        cache_value jsonb NOT NULL,
        expires_at timestamptz NULL,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      );
      CREATE INDEX IF NOT EXISTS idx_${this.table}_key ON ${this.table} (cache_key);
      CREATE INDEX IF NOT EXISTS idx_${this.table}_expires_at ON ${this.table} (expires_at);
    `
    try {
      await this.pool.query(create)
    } catch (err) {
      logger.error({ err }, 'Failed to ensure cache table')
    }
  }

  async ping(): Promise<boolean> {
    try {
      await this.pool.query('SELECT 1')
      return true
    } catch (err) {
      logger.error({ err }, 'Postgres ping failed')
      return false
    }
  }

  async getWithMetadata<T>(key: string): Promise<{ value: T | null } & ICacheMetadata> {
    try {
      const res = await this.pool.query(
        `SELECT cache_value, expires_at, created_at, updated_at FROM ${this.table} WHERE cache_key = $1 LIMIT 1`,
        [key]
      )
      if (!res.rowCount) return { value: null, expiresAt: null, createdAt: null, updatedAt: null }
      const row = res.rows[0]
      const value = row.cache_value as T
      return { value, expiresAt: row.expires_at ? new Date(row.expires_at) : null, createdAt: row.created_at ? new Date(row.created_at) : null, updatedAt: row.updated_at ? new Date(row.updated_at) : null }
    } catch (err) {
      logger.error({ err, key }, 'PostgresCacheProvider.getWithMetadata failed')
      throw new CacheUnavailableError('Postgres cache read failed')
    }
  }

  async get<T>(key: string): Promise<T | null> {
    const meta = await this.getWithMetadata<T>(key)
    if (!meta.value) return null
    if (meta.expiresAt && meta.expiresAt.getTime() < Date.now()) return null
    return meta.value
  }

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    const expiresAt = ttlSeconds ? new Date(Date.now() + ttlSeconds * 1000) : null
    try {
      await this.pool.query(
        `INSERT INTO ${this.table} (cache_key, cache_value, expires_at) VALUES ($1, $2, $3)
         ON CONFLICT (cache_key) DO UPDATE SET cache_value = EXCLUDED.cache_value, expires_at = EXCLUDED.expires_at, updated_at = now()`,
        [key, value, expiresAt]
      )
    } catch (err) {
      logger.error({ err, key }, 'PostgresCacheProvider.set failed')
      throw new CacheUnavailableError('Postgres cache write failed')
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await this.pool.query(`DELETE FROM ${this.table} WHERE cache_key = $1`, [key])
    } catch (err) {
      logger.error({ err, key }, 'PostgresCacheProvider.delete failed')
      throw new CacheUnavailableError('Postgres cache delete failed')
    }
  }

  async deleteByPattern(pattern: string): Promise<number> {
    try {
      const res = await this.pool.query(`DELETE FROM ${this.table} WHERE cache_key LIKE $1 RETURNING 1`, [pattern.replace('*', '%')])
      return res.rowCount || 0
    } catch (err) {
      logger.error({ err, pattern }, 'PostgresCacheProvider.deleteByPattern failed')
      throw new CacheUnavailableError('Postgres cache delete by pattern failed')
    }
  }

  async clear(): Promise<void> {
    try {
      await this.pool.query(`TRUNCATE TABLE ${this.table}`)
    } catch (err) {
      logger.error({ err }, 'PostgresCacheProvider.clear failed')
      throw new CacheUnavailableError('Postgres cache clear failed')
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const res = await this.pool.query(`SELECT expires_at FROM ${this.table} WHERE cache_key = $1 LIMIT 1`, [key])
      if (!res.rowCount) return false
      const row = res.rows[0]
      if (row.expires_at && new Date(row.expires_at).getTime() < Date.now()) return false
      return true
    } catch (err) {
      logger.error({ err, key }, 'PostgresCacheProvider.exists failed')
      throw new CacheUnavailableError('Postgres cache exists check failed')
    }
  }

  async increment(key: string, amount = 1, ttlSeconds?: number): Promise<number> {
    const client = await this.pool.connect()
    try {
      await client.query('BEGIN')
      const select = await client.query(`SELECT cache_value, expires_at FROM ${this.table} WHERE cache_key = $1 FOR UPDATE`, [key])
      let current = 0
      if (!select.rowCount) {
        current = amount
        const expiresAt = ttlSeconds ? new Date(Date.now() + ttlSeconds * 1000) : null
        await client.query(`INSERT INTO ${this.table} (cache_key, cache_value, expires_at) VALUES ($1, $2, $3)`, [key, current, expiresAt])
      } else {
        const row = select.rows[0]
        const existing = row.cache_value
        if (typeof existing === 'number') current = existing + amount
        else if (existing && typeof existing === 'object' && (existing as any).value && typeof (existing as any).value === 'number') current = (existing as any).value + amount
        else current = amount
        const expiresAt = ttlSeconds ? new Date(Date.now() + ttlSeconds * 1000) : row.expires_at
        await client.query(`UPDATE ${this.table} SET cache_value = $1, expires_at = $2, updated_at = now() WHERE cache_key = $3`, [current, expiresAt, key])
      }
      await client.query('COMMIT')
      return current
    } catch (err) {
      await client.query('ROLLBACK')
      logger.error({ err, key }, 'PostgresCacheProvider.increment failed')
      throw new CacheUnavailableError('Postgres cache increment failed')
    } finally {
      client.release()
    }
  }

  async decrement(key: string, amount = 1, ttlSeconds?: number): Promise<number> {
    return this.increment(key, -Math.abs(amount), ttlSeconds)
  }

  async ttl(key: string): Promise<number | null> {
    try {
      const res = await this.pool.query(`SELECT expires_at FROM ${this.table} WHERE cache_key = $1 LIMIT 1`, [key])
      if (!res.rowCount) return null
      const row = res.rows[0]
      if (!row.expires_at) return null
      const ms = new Date(row.expires_at).getTime() - Date.now()
      return ms > 0 ? Math.floor(ms / 1000) : 0
    } catch (err) {
      logger.error({ err, key }, 'PostgresCacheProvider.ttl failed')
      throw new CacheUnavailableError('Postgres cache ttl check failed')
    }
  }
}

export default PostgresCacheProvider
