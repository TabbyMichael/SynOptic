import { eq } from 'drizzle-orm';
import { db } from '../../../infrastructure/database/db.service';
import { sessions } from '../../../../drizzle/schema';
import { Session, NewSession } from '../../../infrastructure/database/repositories/interfaces';

export class SessionRepository {
  async create(data: NewSession): Promise<Session> {
    const [created] = await db.insert(sessions).values(data).returning();
    return created;
  }

  async findById(id: string): Promise<Session | undefined> {
    const [s] = await db.select().from(sessions).where(eq(sessions.id, id));
    return s;
  }

  async findByUserId(userId: string, limit = 20, offset = 0): Promise<Session[]> {
    return db.select().from(sessions).where(eq(sessions.userId, userId)).limit(limit).offset(offset);
  }

  async findActiveByUser(userId: string): Promise<Session[]> {
    return db.select().from(sessions).where(eq(sessions.userId, userId), eq(sessions.revoked, false));
  }

  async update(id: string, data: Partial<NewSession>): Promise<Session> {
    const [updated] = await db.update(sessions).set({ ...data }).where(eq(sessions.id, id)).returning();
    return updated;
  }

  async revoke(id: string, revokedAt?: Date): Promise<void> {
    await db.update(sessions).set({ revoked: true, revokedAt: revokedAt ?? new Date() }).where(eq(sessions.id, id));
  }

  async revokeAllForUser(userId: string, exceptSessionId?: string): Promise<number> {
    const res = await db.update(sessions).set({ revoked: true, revokedAt: new Date() }).where(eq(sessions.userId, userId)).returning();
    if (exceptSessionId) {
      await db.update(sessions).set({ revoked: false, revokedAt: null }).where(eq(sessions.id, exceptSessionId));
      return Math.max(0, res.length - 1);
    }
    return res.length;
  }

  async findByFilters(userId: string, filters: Record<string, any>, limit = 20, offset = 0): Promise<Session[]> {
    // TODO: implement real filtering; for now return all user sessions
    return this.findByUserId(userId, limit, offset);
  }
}

export const sessionRepository = new SessionRepository();
