import type { IRateLimiter } from './IRateLimiter'
import type { RateLimitRule } from './RateLimitPolicy'

export type Req = any
export type Res = any

export function rateLimitMiddleware(limiter: IRateLimiter, keyFactory: (req: Req) => string, ruleFactory: (req: Req) => RateLimitRule) {
  return (handler: (req: Req, res: Res) => Promise<any> | any) => {
    return async (req: Req, res: Res) => {
      try {
        const key = keyFactory(req)
        const rule = ruleFactory(req)
        const result = await limiter.allow(key, 1)
        if (!result.allowed) {
          const retry = result.resetSeconds ?? 60
          if (res && typeof res.setHeader === 'function') res.setHeader('Retry-After', String(retry))
          if (res && typeof res.status === 'function') return res.status(429).json({ error: 'Rate limit exceeded', retryAfter: retry })
          throw new Error('Rate limit exceeded')
        }
        return handler(req, res)
      } catch (err) {
        if (res && typeof res.status === 'function') return res.status(500).json({ error: 'Internal rate limiter error' })
        throw err
      }
    }
  }
}

export default rateLimitMiddleware
