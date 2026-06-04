import { describe, it, expect } from 'vitest'
import RequestCoalescingService from '../../src/infrastructure/cache/RequestCoalescingService'

describe('RequestCoalescingService', () => {
  it('coalesces concurrent requests', async () => {
    const svc = new RequestCoalescingService()
    let calls = 0

    const factory = async () => {
      calls += 1
      // simulate latency
      await new Promise((r) => setTimeout(r, 50))
      return 'ok'
    }

    const [a, b, c] = await Promise.all([svc.coalesce('k', factory), svc.coalesce('k', factory), svc.coalesce('k', factory)])
    expect(a).toBe('ok')
    expect(b).toBe('ok')
    expect(c).toBe('ok')
    expect(calls).toBe(1)
  })
})
