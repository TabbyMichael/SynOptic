export class CacheError extends Error {
  constructor(message?: string) {
    super(message)
    this.name = 'CacheError'
  }
}

export class CacheMissError extends CacheError {
  constructor(key?: string) {
    super(`Cache miss${key ? ` for ${key}` : ''}`)
    this.name = 'CacheMissError'
  }
}

export class CacheUnavailableError extends CacheError {
  constructor(message?: string) {
    super(message || 'Cache unavailable')
    this.name = 'CacheUnavailableError'
  }
}

export default CacheError
