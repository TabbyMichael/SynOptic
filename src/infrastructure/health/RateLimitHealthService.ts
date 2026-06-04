export class RateLimitHealthService {
  constructor(private checkFn: () => Promise<boolean>) {}

  async status() {
    try {
      const ok = await this.checkFn()
      return { ok }
    } catch (err) {
      return { ok: false, error: String(err) }
    }
  }
}

export default RateLimitHealthService
