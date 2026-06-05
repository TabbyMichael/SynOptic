import { NextResponse } from 'next/server'
import PostgresCacheProvider from '../../../src/infrastructure/cache/PostgresCacheProvider'
import CacheHealthService from '../../../src/infrastructure/health/CacheHealthService'
import { FixedWindowLimiter } from '../../../src/infrastructure/rate-limiter/FixedWindowLimiter'
import RateLimitHealthService from '../../../src/infrastructure/health/RateLimitHealthService'
import { DatabaseHealthService } from '@/services/DatabaseHealthService';

export async function GET() {
  try {
    const cacheProvider = new PostgresCacheProvider()
    const cacheStatus = await new CacheHealthService(cacheProvider).status()

    // create a lightweight limiter instance for a health check
    let rateStatus: { ok: boolean; error?: string } = { ok: false }
    try {
      const limiter = new FixedWindowLimiter({ limit: 1, windowSeconds: 60 })
      const fn = async () => {
        const r = await limiter.allow('__health__', 0)
        return r.allowed
      }
      rateStatus = await new RateLimitHealthService(fn).status()
    } catch (e) {
      rateStatus = { ok: false, error: String(e) }
    }

    const dbStatus = await DatabaseHealthService.check();
    const ok = cacheStatus.ok && rateStatus.ok && dbStatus.status === 'healthy';

    return NextResponse.json({
      ok,
      cache_status: cacheStatus,
      rate_limit_status: rateStatus,
      database: dbStatus,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
    }, { status: ok ? 200 : 503 })
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}

