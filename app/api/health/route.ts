import { NextResponse } from 'next/server';
import PostgresCacheProvider from '@/src/infrastructure/cache/PostgresCacheProvider';
import CacheHealthService from '@/src/infrastructure/health/CacheHealthService';
import { FixedWindowLimiter } from '@/src/infrastructure/rate-limiter/FixedWindowLimiter';
import RateLimitHealthService from '@/src/infrastructure/health/RateLimitHealthService';
import { DatabaseHealthService } from '@/src/services/DatabaseHealthService';

export async function GET() {
  try {
    const dbStatus = await DatabaseHealthService.check();
    
    const cacheProvider = new PostgresCacheProvider();
    const cacheStatus = await new CacheHealthService(cacheProvider).status();

    let rateStatus = { ok: false };
    try {
      const limiter = new FixedWindowLimiter({ limit: 1, windowSeconds: 60 });
      const fn = async () => {
        const r = await limiter.allow('__health__', 0);
        return r.allowed;
      };
      rateStatus = await new RateLimitHealthService(fn).status();
    } catch (e) {
      rateStatus = { ok: false };
    }

    const overallOk = dbStatus.status === 'healthy' && cacheStatus.ok && rateStatus.ok;

    return NextResponse.json({
      status: overallOk ? 'up' : 'down',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      database: dbStatus,
      cache: cacheStatus,
      rate_limit: rateStatus,
    }, { status: overallOk ? 200 : 503 });
  } catch (err: any) {
    return NextResponse.json({ status: 'down', error: err.message }, { status: 500 });
  }
}
