import { db } from '@/infrastructure/database/db.service'
import { users as usersTable, sessions as sessionsTable, auditLogs as auditLogsTable, weatherSnapshots as weatherTable, analyses as analysesTable } from '../../../../drizzle/schema'
import { eq, desc, and, inArray, count, gte, sql } from 'drizzle-orm'
import { auditLogger } from '@/modules/audit/services/audit-logger.service'
import { DatabaseHealthService } from '@/services/DatabaseHealthService'

export class AdminService {
  async listUsers(opts: { limit?: number; offset?: number; search?: string } = {}) {
    const { limit = 20, offset = 0, search = '' } = opts
    let users = [] as any[]
    if (search) {
      users = await db.select().from(usersTable).where(eq(usersTable.email, search)).limit(limit).offset(offset)
    } else {
      users = await db.select().from(usersTable).limit(limit).offset(offset)
    }

    const out = [] as any[]
    const userIds = users.map((u: any) => u.id)
    let sessionsByUserId: Record<string, any[]> = {}

    if (userIds.length > 0) {
      const allSessions = await db
        .select()
        .from(sessionsTable)
        .where(inArray(sessionsTable.userId, userIds))

      sessionsByUserId = allSessions.reduce((acc: Record<string, any[]>, session: any) => {
        const key = session.userId
        if (!acc[key]) acc[key] = []
        acc[key].push(session)
        return acc
      }, {})
    }

    for (const u of users) {
      const userSessions = sessionsByUserId[u.id] ?? []
      const sessionCount = userSessions.length
      const lastActivity = userSessions.length
        ? userSessions.reduce((a: any, b: any) => (new Date(a.lastUsedAt) > new Date(b.lastUsedAt) ? a : b)).lastUsedAt
        : null
      out.push({ id: u.id, name: u.name, email: u.email, role: u.role, createdAt: u.createdAt, sessionCount, lastActivity })
    }

    const [{ total }] = await db.select({ total: count() }).from(usersTable)

    void auditLogger.log({ userId: undefined, action: 'ADMIN_LIST_USERS', entityType: 'admin', entityId: 'admin', metadata: { listUsers: { limit, offset, search } } }).catch(() => {})

    return { users: out, meta: { total, limit, offset } }
  }

  async getAuditLogs(opts: { limit?: number; offset?: number; userId?: string; action?: string } = {}) {
    const { limit = 50, offset = 0, userId, action } = opts
    const filters = []
    if (userId) filters.push(eq(auditLogsTable.userId, userId))
    if (action) filters.push(eq(auditLogsTable.action, action))

    const rows = await db.select().from(auditLogsTable)
      .where(filters.length ? and(...filters) : undefined)
      .orderBy(desc(auditLogsTable.createdAt))
      .limit(limit)
      .offset(offset)

    return { logs: rows, meta: { limit, offset } }
  }

  async getSystemMetrics() {
    const dbHealth = await DatabaseHealthService.check()
    const since7d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000)

    const totalUsersResult = await db.select({ totalUsers: count() }).from(usersTable)
    const activeUsersResult = await db
      .select({ activeUsers7d: sql<number>`count(distinct ${sessionsTable.userId})` })
      .from(sessionsTable)
      .where(gte(sessionsTable.lastUsedAt, since7d))
    const weatherResult = await db
      .select({ requestsLast24h: count() })
      .from(weatherTable)
      .where(gte(weatherTable.capturedAt, since24h))
    const analysesResult = await db.select({ totalAnalyses: count() }).from(analysesTable)

    const totalUsers = totalUsersResult[0]?.totalUsers ?? 0
    const activeUsers7d = activeUsersResult[0]?.activeUsers7d ?? 0
    const requestsLast24h = weatherResult[0]?.requestsLast24h ?? 0
    const totalAnalyses = analysesResult[0]?.totalAnalyses ?? 0

    return {
      backend: { dbHealth, totalUsers, activeUsers7d },
      weather: { requestsLast24h },
      forestry: { totalAnalyses },
      timestamp: new Date().toISOString(),
    }
  }

  async getApiUsage() {
    const since30d = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const weatherResult = await db
      .select({ weather30d: count() })
      .from(weatherTable)
      .where(gte(weatherTable.capturedAt, since30d))
    const analysesResult = await db
      .select({ analyses30d: count() })
      .from(analysesTable)
      .where(gte(analysesTable.createdAt, since30d))

    return {
      weather: { totalRequests30d: weatherResult[0]?.weather30d ?? 0 },
      forestry: { totalAnalyses30d: analysesResult[0]?.analyses30d ?? 0 },
      timestamp: new Date().toISOString(),
    }
  }
}

export const adminService = new AdminService()
