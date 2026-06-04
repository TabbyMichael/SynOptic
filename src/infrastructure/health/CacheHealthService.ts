import type ICacheProvider from '../cache/CacheProvider'

export class CacheHealthService {
  constructor(private provider: ICacheProvider) {}

  async status() {
    try {
      if (typeof this.provider.ping === 'function') {
        const ok = await this.provider.ping()
        return { ok }
      }
      // best-effort: try a simple get
      await this.provider.get('__healthcheck__')
      return { ok: true }
    } catch (err) {
      return { ok: false, error: String(err) }
    }
  }
}

export default CacheHealthService
