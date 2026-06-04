import { describe, it, expect } from 'vitest'
import { DetectSuspiciousSessionsService, SecurityRiskLevel } from '../../src/modules/auth/services/detectSuspiciousSessions.service'

describe('DetectSuspiciousSessionsService', () => {
  it('flags sessions from different countries within short time as HIGH risk', async () => {
    const now = new Date()
    const repo = {
      findActiveByUser: async (userId: string) => [
        { id: 's1', location: { country: 'KE', lat: -1.286389, lon: 36.817223 }, lastUsedAt: new Date(now.getTime() - 30 * 60 * 1000).toISOString() },
        { id: 's2', location: { country: 'GB', lat: 51.5074, lon: -0.1278 }, lastUsedAt: now.toISOString() },
      ],
    }

    const svc = new DetectSuspiciousSessionsService(repo as any)
    const res = await svc.analyzeForUser('user-1')
    const s1 = res.find(r => r.sessionId === 's1')
    const s2 = res.find(r => r.sessionId === 's2')
    expect(s1?.risk).toBe(SecurityRiskLevel.HIGH)
    expect(s2?.risk).toBe(SecurityRiskLevel.HIGH)
  })
})
