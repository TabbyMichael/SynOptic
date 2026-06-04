import { 
  users, farms, analyses, weatherSnapshots, 
  alertRules, alertEvents, auditLogs 
} from '../../../../drizzle/schema';
import { sessions, refreshTokens } from '../../../../drizzle/schema';

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Farm = typeof farms.$inferSelect;
export type NewFarm = typeof farms.$inferInsert;

export type Analysis = typeof analyses.$inferSelect;
export type NewAnalysis = typeof analyses.$inferInsert;

export type WeatherSnapshot = typeof weatherSnapshots.$inferSelect;
export type NewWeatherSnapshot = typeof weatherSnapshots.$inferInsert;

export type AlertRule = typeof alertRules.$inferSelect;
export type NewAlertRule = typeof alertRules.$inferInsert;

export type AlertEvent = typeof alertEvents.$inferSelect;
export type NewAlertEvent = typeof alertEvents.$inferInsert;

export type AuditLog = typeof auditLogs.$inferSelect;
export type NewAuditLog = typeof auditLogs.$inferInsert;

export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;

export type RefreshToken = typeof refreshTokens.$inferSelect;
export type NewRefreshToken = typeof refreshTokens.$inferInsert;

export interface UserRepository {
  findById(id: string): Promise<User | undefined>;
  findByEmail(email: string): Promise<User | undefined>;
  create(user: NewUser): Promise<User>;
  update(id: string, data: Partial<NewUser>): Promise<User>;
}

export interface FarmRepository {
  findById(id: string): Promise<Farm | undefined>;
  findByOwnerId(ownerId: string): Promise<Farm[]>;
  create(farm: NewFarm): Promise<Farm>;
  findAll(limit?: number, offset?: number): Promise<Farm[]>;
}

export interface AnalysisRepository {
  findByFarmId(farmId: string): Promise<Analysis[]>;
  create(analysis: NewAnalysis): Promise<Analysis>;
}

export interface WeatherRepository {
  findByFarmId(farmId: string, limit?: number): Promise<WeatherSnapshot[]>;
  create(snapshot: NewWeatherSnapshot): Promise<WeatherSnapshot>;
  createMany(snapshots: NewWeatherSnapshot[]): Promise<WeatherSnapshot[]>;
}

export interface AlertRepository {
  findRulesByFarmId(farmId: string): Promise<AlertRule[]>;
  findEventsByRuleId(ruleId: string): Promise<AlertEvent[]>;
  createRule(rule: NewAlertRule): Promise<AlertRule>;
  createEvent(event: NewAlertEvent): Promise<AlertEvent>;
}

export interface AuditRepository {
  create(log: NewAuditLog): Promise<AuditLog>;
  findByUserId(userId: string): Promise<AuditLog[]>;
}

export interface SessionRepository {
  findById(id: string): Promise<Session | undefined>;
  findByUserId(userId: string, limit?: number, offset?: number): Promise<Session[]>;
  findActiveByUser(userId: string): Promise<Session[]>;
  create(session: NewSession): Promise<Session>;
  update(id: string, data: Partial<NewSession>): Promise<Session>;
  revoke(id: string, revokedAt?: Date): Promise<void>;
  revokeAllForUser(userId: string, exceptSessionId?: string): Promise<number>;
  // additional search with filters/pagination
  findByFilters(userId: string, filters: Record<string, any>, limit?: number, offset?: number): Promise<Session[]>;
}

export interface RefreshTokenRepository {
  create(token: NewRefreshToken): Promise<RefreshToken>;
  findByTokenHash(tokenHash: string): Promise<RefreshToken | undefined>;
  findBySessionId(sessionId: string): Promise<RefreshToken[]>;
  revoke(id: string): Promise<void>;
  replace(oldId: string, newToken: NewRefreshToken): Promise<RefreshToken>;
}
