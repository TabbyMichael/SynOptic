import logger from '../../lib/logger'

export class RequestCoalescingService {
  private inflight = new Map<string, Promise<any>>()

  async coalesce<T>(key: string, factory: () => Promise<T>): Promise<T> {
    if (this.inflight.has(key)) {
      logger.info({ key }, 'request_coalesced')
      return this.inflight.get(key) as Promise<T>
    }

    const p = (async () => {
      try {
        return await factory()
      } finally {
        // ensure removal in next tick so others waiting can still observe promise
        setTimeout(() => this.inflight.delete(key), 0)
      }
    })()

    this.inflight.set(key, p)
    return p
  }
}

export default RequestCoalescingService
