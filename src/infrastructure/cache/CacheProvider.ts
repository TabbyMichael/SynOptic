export interface ICacheMetadata {
  expiresAt: Date | null
  createdAt: Date | null
  updatedAt: Date | null
}

export interface ICacheProvider {
  get<T>(key: string): Promise<T | null>
  getWithMetadata<T>(key: string): Promise<{ value: T | null } & ICacheMetadata>
  set<T>(key: string, value: T, ttlSeconds?: number): Promise<void>
  delete(key: string): Promise<void>
  clear(): Promise<void>
  exists(key: string): Promise<boolean>
  increment(key: string, amount?: number, ttlSeconds?: number): Promise<number>
  decrement(key: string, amount?: number, ttlSeconds?: number): Promise<number>
  ttl(key: string): Promise<number | null>
  // optional ping for health checks
  ping?(): Promise<boolean>
  // optional pattern delete for invalidation
  deleteByPattern?(pattern: string): Promise<number>
}

export default ICacheProvider
