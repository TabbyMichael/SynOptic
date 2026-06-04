import { describe, it, expect, vi, beforeEach } from 'vitest'

// mocks must be declared before importing the service
vi.mock('../../../infrastructure/database/db.service', () => ({
  db: {
    select: vi.fn(() => ({
      from: (table: any) => {
        const keys = Array.isArray(table) ? [] : Object.keys(table || {})
        let rows: any[] = []

        if (keys.includes('email')) {
          rows = [{ id: 'u1', name: 'Alice', email: 'alice@example.com', role: 'FARMER', createdAt: '2024-01-01' }]
        } else if (keys.includes('lastUsedAt')) {
          rows = [{ id: 's1', userId: 'u1', lastUsedAt: '2024-05-01' }]
        } else if (keys.includes('capturedAt')) {
          rows = []
        } else if (keys.includes('analysisId')) {
          rows = []
        } else if (keys.includes('action') && keys.includes('entityType')) {
          rows = []
        }

        return {
          where: (..._args: any[]) => ({
            orderBy: (_ord: any) => ({
              limit: (l: number) => ({
                offset: (o: number) => Promise.resolve(rows),
              }),
            }),
            limit: (l: number) => ({
              offset: (o: number) => Promise.resolve(rows),
            }),
            then: (resolve: any) => Promise.resolve(rows).then(resolve),
          }),
          limit: (l: number) => ({
            offset: (o: number) => Promise.resolve(rows),
          }),
          then: (resolve: any) => Promise.resolve(rows).then(resolve),
        }
      },
    })),
    insert: vi.fn(() => ({ values: vi.fn(() => ({ returning: vi.fn() })) })),
  },
}))

vi.mock('../../../modules/audit/services/audit-logger.service', () => ({
  auditLogger: { log: vi.fn(() => Promise.resolve(true)) },
}))

vi.mock('../../../services/DatabaseHealthService', () => ({
  DatabaseHealthService: { check: vi.fn(async () => ({ status: 'healthy', latency: '1ms' })) },
}))

import { adminService } from './admin.service'
import { users as usersTable } from '../../../../drizzle/schema'

// debug table shape
// eslint-disable-next-line no-console
// eslint-disable-next-line no-console
console.log('DRIZZLE USERS TABLE DBNAME:', (usersTable as any).dbName)
// eslint-disable-next-line no-console
console.log('DRIZZLE USERS TABLE KEYS:', Object.keys(usersTable as any))

describe('AdminService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('listUsers returns users with session counts and lastActivity', async () => {
    const res = await adminService.listUsers({ limit: 10, offset: 0 })
    // debug
    // eslint-disable-next-line no-console
    console.log('ADMIN SERVICE LIST USERS RESULT', JSON.stringify(res))
    expect(res).toHaveProperty('users')
    expect(Array.isArray(res.users)).toBe(true)
    const u = res.users[0]
    expect(u).toHaveProperty('sessionCount', 1)
    expect(u).toHaveProperty('lastActivity')
    expect(res).toHaveProperty('meta')
  })

  it('getSystemMetrics returns metrics shape', async () => {
    const m = await adminService.getSystemMetrics()
    expect(m).toHaveProperty('backend')
    expect(m.backend).toHaveProperty('totalUsers')
    expect(m.backend).toHaveProperty('activeUsers7d')
    expect(m).toHaveProperty('weather')
    expect(m).toHaveProperty('forestry')
  })
})
