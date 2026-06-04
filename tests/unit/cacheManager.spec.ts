import { describe, it, expect, vi } from 'vitest'
import CacheManager from '../../src/infrastructure/cache/CacheManager'
import type { ICacheProvider } from '../../src/infrastructure/cache/CacheProvider'

class InMemoryProvider implements ICacheProvider {
  private store = new Map<string, any>()
  private meta = new Map<string, { expiresAt: number | null; createdAt: number; updatedAt: number }>()

  async get<T>(key: string) {
    const m = this.meta.get(key)
    if (!this.store.has(key)) return null
    if (m && m.expiresAt && m.expiresAt < Date.now()) return null
    return this.store.get(key) as T
  }

  async getWithMetadata<T>(key: string) {
    const v = (this.store.has(key) ? this.store.get(key) : null) as T | null
    const m = this.meta.get(key)
    return { value: v, expiresAt: m && m.expiresAt ? new Date(m.expiresAt) : null, createdAt: m ? new Date(m.createdAt) : null, updatedAt: m ? new Date(m.updatedAt) : null }
  }

  async set<T>(key: string, value: T, ttlSeconds?: number) {
    this.store.set(key, value)
    const now = Date.now()
    // treat ttlSeconds === 0 as immediate expiry for testing stale behavior
    const expiresAt = typeof ttlSeconds === 'number' ? (ttlSeconds > 0 ? now + ttlSeconds * 1000 : now - 1000) : null
    this.meta.set(key, { expiresAt, createdAt: now, updatedAt: now })
  }

  async delete(key: string) {
    this.store.delete(key)
    this.meta.delete(key)
  }

  async clear() {
    this.store.clear()
    this.meta.clear()
  }

  async exists(key: string) {
    const v = await this.get(key)
    return v !== null
  }

  async increment(_key: string, _amount?: number) {
    throw new Error('not implemented')
  }
  async decrement(_key: string, _amount?: number) {
    throw new Error('not implemented')
  }
  async ttl(_key: string) {
    const m = this.meta.get(_key)
    if (!m || !m.expiresAt) return null
    return Math.max(0, Math.floor((m.expiresAt - Date.now()) / 1000))
  }
}

describe('CacheManager', () => {
  it('stores and returns fresh values', async () => {
    const provider = new InMemoryProvider()
    const cm = new CacheManager({ provider })
    const val = await cm.getOrSet('k1', async () => 'v1', 60)
    expect(val).toBe('v1')
    const val2 = await cm.getOrSet('k1', async () => 'v2', 60)
    expect(val2).toBe('v1')
  })

  it('returns stale value and revalidates in background', async () => {
    const provider = new InMemoryProvider()
    const cm = new CacheManager({ provider })
    // seed a stale entry
    await provider.set('sk', 'stale', 0) // ttl 0 -> expired

    let refreshed = false
    const factory = async () => {
      refreshed = true
      return 'fresh'
    }

    const result = await cm.getOrSet('sk', factory, 60)
    expect(result).toBe('stale')
    // allow background revalidate to run
    await new Promise((r) => setTimeout(r, 20))
    expect(refreshed).toBe(true)
    const after = await provider.get('sk')
    expect(after).toBe('fresh')
  })
})
