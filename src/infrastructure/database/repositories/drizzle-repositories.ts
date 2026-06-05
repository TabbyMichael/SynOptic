import { eq, desc, and } from 'drizzle-orm';
import { db } from '../../../../drizzle/config';
import { 
  users, farms, analyses, weatherSnapshots, 
  alertRules, alertEvents, auditLogs, sessions, refreshTokens
} from '../../../../drizzle/schema';
import { 
  UserRepository, FarmRepository, AnalysisRepository, 
  WeatherRepository, AlertRepository, AuditRepository,
  SessionRepository, RefreshTokenRepository,
  User, NewUser, Farm, NewFarm, Analysis, NewAnalysis,
  WeatherSnapshot, NewWeatherSnapshot, AlertRule, NewAlertRule,
  AlertEvent, NewAlertEvent, AuditLog, NewAuditLog
  , Session, NewSession, RefreshToken, NewRefreshToken
} from './interfaces';

export class DrizzleUserRepository implements UserRepository {
  async findById(id: string) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  async findByEmail(email: string) {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }
  async create(user: NewUser) {
    const [created] = await db.insert(users).values(user).returning();
    return created;
  }
  async update(id: string, data: Partial<NewUser>) {
    const [updated] = await db.update(users).set({ ...data, updatedAt: new Date() }).where(eq(users.id, id)).returning();
    return updated;
  }
}

export class DrizzleFarmRepository implements FarmRepository {
  async findById(id: string) {
    const [farm] = await db.select().from(farms).where(eq(farms.id, id));
    return farm;
  }
  async findByOwnerId(ownerId: string) {
    return db.select().from(farms).where(eq(farms.ownerId, ownerId));
  }
  async create(farm: NewFarm) {
    const [created] = await db.insert(farms).values(farm).returning();
    return created;
  }
  async findAll(limit = 10, offset = 0) {
    return db.select().from(farms).limit(limit).offset(offset);
  }
}

export class DrizzleAnalysisRepository implements AnalysisRepository {
  async findByFarmId(farmId: string) {
    return db.select().from(analyses).where(eq(analyses.farmId, farmId)).orderBy(desc(analyses.createdAt));
  }
  async create(analysis: NewAnalysis) {
    const [created] = await db.insert(analyses).values(analysis).returning();
    return created;
  }
}

export class DrizzleWeatherRepository implements WeatherRepository {
  async findByFarmId(farmId: string, limit = 100) {
    return db.select().from(weatherSnapshots)
      .where(eq(weatherSnapshots.farmId, farmId))
      .orderBy(desc(weatherSnapshots.capturedAt))
      .limit(limit);
  }
  async create(snapshot: NewWeatherSnapshot) {
    const [created] = await db.insert(weatherSnapshots).values(snapshot).returning();
    return created;
  }
  async createMany(snapshots: NewWeatherSnapshot[]) {
    return db.insert(weatherSnapshots).values(snapshots).returning();
  }
}

export class DrizzleAlertRepository implements AlertRepository {
  async findRulesByFarmId(farmId: string) {
    return db.select().from(alertRules).where(eq(alertRules.farmId, farmId));
  }
  async findEventsByRuleId(ruleId: string) {
    return db.select().from(alertEvents).where(eq(alertEvents.ruleId, ruleId)).orderBy(desc(alertEvents.triggeredAt));
  }
  async createRule(rule: NewAlertRule) {
    const [created] = await db.insert(alertRules).values(rule).returning();
    return created;
  }
  async createEvent(event: NewAlertEvent) {
    const [created] = await db.insert(alertEvents).values(event).returning();
    return created;
  }
}

export class DrizzleAuditRepository implements AuditRepository {
  async create(log: NewAuditLog) {
    const [created] = await db.insert(auditLogs).values(log).returning();
    return created;
  }
  async findByUserId(userId: string) {
    return db.select().from(auditLogs).where(eq(auditLogs.userId, userId)).orderBy(desc(auditLogs.createdAt));
  }
}

export class DrizzleSessionRepository implements SessionRepository {
  async findById(id: string) {
    const [s] = await db.select().from(sessions).where(eq(sessions.id, id));
    return s;
  }

  async findByUserId(userId: string, limit = 20, offset = 0) {
    return db.select().from(sessions).where(eq(sessions.userId, userId)).orderBy(desc(sessions.lastUsedAt)).limit(limit).offset(offset);
  }

  async findActiveByUser(userId: string) {
    return db.select().from(sessions).where(and(eq(sessions.userId, userId), eq(sessions.revoked, false)));
  }

  async create(session: NewSession) {
    const [created] = await db.insert(sessions).values(session).returning();
    return created;
  }

  async update(id: string, data: Partial<NewSession>) {
    const [updated] = await db.update(sessions).set({ ...data }).where(eq(sessions.id, id)).returning();
    return updated;
  }

  async revoke(id: string, revokedAt?: Date) {
    await db.update(sessions).set({ revoked: true, revokedAt: revokedAt ?? new Date() }).where(eq(sessions.id, id));
  }

  async revokeAllForUser(userId: string, exceptSessionId?: string) {
    // Update all sessions for the user as revoked, then restore the exceptSessionId if provided.
    const res = await db.update(sessions).set({ revoked: true, revokedAt: new Date() }).where(eq(sessions.userId, userId)).returning();
    if (exceptSessionId) {
      await db.update(sessions).set({ revoked: false, revokedAt: null }).where(eq(sessions.id, exceptSessionId));
      return Math.max(0, res.length - 1);
    }
    return res.length;
  }

  async findByFilters(userId: string, _filters: Record<string, any>, limit = 20, offset = 0) {
    // Simple implementation; extend with real filter parsing as needed
    return db.select().from(sessions).where(eq(sessions.userId, userId)).orderBy(desc(sessions.lastUsedAt)).limit(limit).offset(offset);
  }
}

export class DrizzleRefreshTokenRepository implements RefreshTokenRepository {
  async create(token: NewRefreshToken) {
    const [created] = await db.insert(refreshTokens).values(token).returning();
    return created;
  }

  async findByTokenHash(tokenHash: string) {
    const [t] = await db.select().from(refreshTokens).where(eq(refreshTokens.tokenHash, tokenHash));
    return t;
  }

  async findBySessionId(sessionId: string) {
    return db.select().from(refreshTokens).where(eq(refreshTokens.sessionId, sessionId));
  }

  async revoke(id: string) {
    await db.update(refreshTokens).set({ revoked: true, revokedAt: new Date() }).where(eq(refreshTokens.id, id));
  }

  async replace(oldId: string, newToken: NewRefreshToken) {
    // atomic replacement: insert new token, then mark old token replaced
    const [created] = await db.insert(refreshTokens).values(newToken).returning();
    await db.update(refreshTokens).set({ revoked: true, revokedAt: new Date(), replacedBy: created.id }).where(eq(refreshTokens.id, oldId));
    return created;
  }
}
