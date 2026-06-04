export class RateLimitError extends Error {
  constructor(message?: string) {
    super(message)
    this.name = 'RateLimitError'
  }
}

export class RateLimitExceededError extends RateLimitError {
  public retryAfterSeconds: number
  constructor(retryAfterSeconds = 60, message?: string) {
    super(message || 'Rate limit exceeded')
    this.name = 'RateLimitExceededError'
    this.retryAfterSeconds = retryAfterSeconds
  }
}

export default RateLimitError
