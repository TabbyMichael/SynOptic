import { NextResponse } from 'next/server'
import PostgresCacheProvider from '../../../src/infrastructure/cache/PostgresCacheProvider'
import CacheHealthService from '../../../src/infrastructure/health/CacheHealthService'
import { FixedWindowLimiter } from '../../../src/infrastructure/rate-limiter/FixedWindowLimiter'
import RateLimitHealthService from '../../../src/infrastructure/health/RateLimitHealthService'

export async function GET() {
  try {
    const cacheProvider = new PostgresCacheProvider()
    const cacheStatus = await new CacheHealthService(cacheProvider).status()

    // create a lightweight limiter instance for a health check
    let rateStatus = { ok: false }
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

    return NextResponse.json({ cache_status: cacheStatus, rate_limit_status: rateStatus, ok: cacheStatus.ok && rateStatus.ok })
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}

export default GET
import { NextResponse } from 'next/server';
import { DatabaseHealthService } from '@/services/DatabaseHealthService';

export async function GET() {
  const dbStatus = await DatabaseHealthService.check();
  
  const status = dbStatus.status === 'healthy' ? 200 : 503;

  return NextResponse.json({
    status: dbStatus.status === 'healthy' ? 'up' : 'down',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    database: dbStatus,
  }, { status });
}
