import { db } from '@/infrastructure/database/db.service'
import { users as usersTable, sessions as sessionsTable, auditLogs as auditLogsTable, weatherSnapshots as weatherTable, analyses as analysesTable } from '../../../../drizzle/schema'
import { eq, desc } from 'drizzle-orm'
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
    for (const u of users) {
      const userSessions = await db.select().from(sessionsTable).where(eq(sessionsTable.userId, u.id))
      const sessionCount = userSessions.length
      const lastActivity = userSessions.length
        ? userSessions.reduce((a: any, b: any) => (new Date(a.lastUsedAt) > new Date(b.lastUsedAt) ? a : b)).lastUsedAt
        : null
      out.push({ id: u.id, name: u.name, email: u.email, role: u.role, createdAt: u.createdAt, sessionCount, lastActivity })
    }

    const total = (await db.select().from(usersTable)).length

    // best-effort audit
    void auditLogger.log({ userId: undefined, action: 'LOGIN_SUCCESS', entityType: 'admin', entityId: 'admin', metadata: { listUsers: { limit, offset, search } } }).catch(() => {})

    return { users: out, meta: { total, limit, offset } }
  }

  async getAuditLogs(opts: { limit?: number; offset?: number; userId?: string; action?: string } = {}) {
    const { limit = 50, offset = 0, userId, action } = opts
    let rows
    if (userId && action) {
      rows = await db.select().from(auditLogsTable).where(eq(auditLogsTable.userId, userId), eq(auditLogsTable.action, action)).orderBy(desc(auditLogsTable.createdAt)).limit(limit).offset(offset)
    } else if (userId) {
      rows = await db.select().from(auditLogsTable).where(eq(auditLogsTable.userId, userId)).orderBy(desc(auditLogsTable.createdAt)).limit(limit).offset(offset)
    } else if (action) {
      rows = await db.select().from(auditLogsTable).where(eq(auditLogsTable.action, action)).orderBy(desc(auditLogsTable.createdAt)).limit(limit).offset(offset)
    } else {
      rows = await db.select().from(auditLogsTable).orderBy(desc(auditLogsTable.createdAt)).limit(limit).offset(offset)
    }

    return { logs: rows, meta: { limit, offset } }
  }

  async getSystemMetrics() {
    const dbHealth = await DatabaseHealthService.check()
    const allUsers = await db.select().from(usersTable)
    const totalUsers = allUsers.length
    const allSessions = await db.select().from(sessionsTable)
    const since7d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const activeUserIds = new Set(allSessions.filter((s: any) => new Date(s.lastUsedAt) >= since7d).map((s: any) => s.userId))
    const activeUsers7d = activeUserIds.size
    const weatherSnapshots = await db.select().from(weatherTable)
    const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000)
    const weather24h = weatherSnapshots.filter((w: any) => new Date(w.capturedAt) >= since24h)
    const analyses = await db.select().from(analysesTable)

    const metrics = {
      backend: { dbHealth, totalUsers, activeUsers7d },
      weather: { requestsLast24h: weather24h.length },
      forestry: { totalAnalyses: analyses.length },
      timestamp: new Date().toISOString(),
    }

    return metrics
  }

  async getApiUsage() {
    const since30d = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const weatherSnapshots = await db.select().from(weatherTable)
    const analyses = await db.select().from(analysesTable)
    const weather30d = weatherSnapshots.filter((w: any) => new Date(w.capturedAt) >= since30d)
    const analyses30d = analyses.filter((a: any) => new Date(a.createdAt) >= since30d)

    return {
      weather: { totalRequests30d: weather30d.length },
      forestry: { totalAnalyses30d: analyses30d.length },
      timestamp: new Date().toISOString(),
    }
  }
}

export const adminService = new AdminService()
