import type ICacheProvider from './CacheProvider'
import logger from '../../lib/logger'

/**
 * Minimal Redis provider stub. Implementations should use `ioredis` or `redis`.
 * This file provides the shape and fails fast so callers can be swapped to Redis later.
 */
export class RedisCacheProvider implements ICacheProvider {
  constructor(/* redis client */) {
    logger.warn('RedisCacheProvider is a stub and not connected')
  }

  async get<T>(_key: string): Promise<T | null> {
    throw new Error('RedisCacheProvider not implemented')
  }
  async getWithMetadata<T>(_key: string): Promise<{ value: T | null; expiresAt: Date | null; createdAt: Date | null; updatedAt: Date | null }> {
    throw new Error('RedisCacheProvider not implemented')
  }
  async set<T>(_key: string, _value: T, _ttlSeconds?: number): Promise<void> {
    throw new Error('RedisCacheProvider not implemented')
  }
  async delete(_key: string): Promise<void> {
    throw new Error('RedisCacheProvider not implemented')
  }
  async clear(): Promise<void> {
    throw new Error('RedisCacheProvider not implemented')
  }
  async exists(_key: string): Promise<boolean> {
    throw new Error('RedisCacheProvider not implemented')
  }
  async increment(_key: string, _amount = 1): Promise<number> {
    throw new Error('RedisCacheProvider not implemented')
  }
  async decrement(_key: string, _amount = 1): Promise<number> {
    throw new Error('RedisCacheProvider not implemented')
  }
  async ttl(_key: string): Promise<number | null> {
    throw new Error('RedisCacheProvider not implemented')
  }
}

export default RedisCacheProvider
