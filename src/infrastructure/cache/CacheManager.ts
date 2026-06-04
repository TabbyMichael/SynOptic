import type ICacheProvider from './CacheProvider'
import RequestCoalescingService from './RequestCoalescingService'
import CachePolicies from './CachePolicies'
import CacheMetrics from './CacheMetrics'
import logger from '../../lib/logger'
import CacheKeys from './CacheKeys'

export interface CacheManagerOptions {
  provider: ICacheProvider
  coalescer?: RequestCoalescingService
  metrics?: CacheMetrics
}

export class CacheManager {
  private provider: ICacheProvider
  private coalescer: RequestCoalescingService
  private metrics: CacheMetrics

  constructor(opts: CacheManagerOptions) {
    this.provider = opts.provider
    this.coalescer = opts.coalescer ?? new RequestCoalescingService()
    this.metrics = opts.metrics ?? new CacheMetrics()
  }

  async getOrSet<T>(key: string, factory: () => Promise<T>, ttlSeconds?: number): Promise<T> {
    // read metadata so we can implement stale-while-revalidate
    const meta = await this.provider.getWithMetadata<T>(key)
    const now = new Date()

    // cache hit (fresh)
    if (meta.value !== null && meta.expiresAt && meta.expiresAt.getTime() > now.getTime()) {
      this.metrics.increment('cache_hit')
      logger.info({ key }, 'cache_hit')
      return meta.value as T
    }

    // stale - return stale and refresh in background
    if (meta.value !== null && meta.expiresAt && meta.expiresAt.getTime() <= now.getTime()) {
      this.metrics.increment('cache_stale_returned')
      logger.info({ key }, 'cache_stale_returned')
      // background refresh using coalescing
      void this.coalescer.coalesce(key, async () => {
        try {
          const fresh = await factory()
          await this.provider.set(key, fresh, ttlSeconds)
          this.metrics.increment('cache_revalidated')
          logger.info({ key }, 'cache_revalidated')
          return fresh
        } catch (err) {
          logger.error({ err, key }, 'background_revalidate_failed')
          throw err
        }
      })
      return meta.value as T
    }

    // miss - coalesce a single request
    this.metrics.increment('cache_miss')
    logger.info({ key }, 'cache_miss')
    const result = await this.coalescer.coalesce(key, async () => {
      const v = await factory()
      // allow policies to set default TTLs for well-known keys
      let ttl = ttlSeconds
      try {
        // infer some TTLs by key patterns
        if (!ttl) {
          if (key.startsWith('weather:current')) ttl = CachePolicies.forWeatherCurrent()
          else if (key.startsWith('weather:forecast')) ttl = CachePolicies.forWeatherForecast()
          else if (key.startsWith('farm:')) ttl = CachePolicies.forFarmDetails()
          else if (key.startsWith('analysis:')) ttl = CachePolicies.forAnalysisResults()
        }
      } catch (e) {
        // ignore
      }
      await this.provider.set(key, v, ttl)
      return v
    })

    return result as T
  }

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    await this.provider.set(key, value, ttlSeconds)
    this.metrics.increment('cache_set')
  }

  async delete(key: string): Promise<void> {
    await this.provider.delete(key)
    this.metrics.increment('cache_delete')
    logger.info({ key }, 'cache_invalidation')
  }

  async deleteByPattern(pattern: string): Promise<number> {
    if (typeof this.provider.deleteByPattern !== 'function') {
      logger.warn({ pattern }, 'deleteByPattern not supported by provider')
      return 0
    }
    const n = await this.provider.deleteByPattern(pattern)
    this.metrics.increment('cache_delete_pattern')
    logger.info({ pattern, deleted: n }, 'cache_invalidation_pattern')
    return n
  }

  // Domain-driven invalidation helpers
  async onFarmUpdated(farmId: string): Promise<void> {
    const keys = [CacheKeys.farm(farmId), CacheKeys.weatherCurrent(farmId), CacheKeys.weatherForecast(farmId), CacheKeys.analytics(farmId), CacheKeys.alerts(farmId)]
    await Promise.all(keys.map(k => this.delete(k)))
    this.metrics.increment('invalidation.farm_updated')
  }

  async onAnalysisCompleted(analysisId: string, relatedFarmId?: string): Promise<void> {
    await Promise.all([this.delete(CacheKeys.analysis(analysisId)), relatedFarmId ? this.delete(CacheKeys.analytics(relatedFarmId)) : Promise.resolve()])
    this.metrics.increment('invalidation.analysis_completed')
  }

  async onAlertRuleUpdated(farmId: string): Promise<void> {
    await Promise.all([this.delete(CacheKeys.alerts(farmId)), this.delete(CacheKeys.analytics(farmId))])
    this.metrics.increment('invalidation.alert_rule_updated')
  }

  metricsSnapshot() {
    return this.metrics.snapshot()
  }
}

export default CacheManager
