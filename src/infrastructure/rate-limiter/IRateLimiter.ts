export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetSeconds?: number
}

export interface IRateLimiter {
  allow(key: string, cost?: number): Promise<RateLimitResult>
  consume?(key: string, cost?: number): Promise<RateLimitResult>
  reset?(key: string): Promise<void>
  remaining?(key: string): Promise<number>
}

export default IRateLimiter
