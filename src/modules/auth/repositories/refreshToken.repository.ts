import { eq } from 'drizzle-orm';
import { db } from '../../../infrastructure/database/db.service';
import { refreshTokens } from '../../../../drizzle/schema';
import { RefreshToken, NewRefreshToken } from '../../../infrastructure/database/repositories/interfaces';

export class RefreshTokenRepository {
  async create(data: NewRefreshToken): Promise<RefreshToken> {
    const [created] = await db.insert(refreshTokens).values(data).returning();
    return created;
  }

  async findByTokenHash(tokenHash: string): Promise<RefreshToken | undefined> {
    const [t] = await db.select().from(refreshTokens).where(eq(refreshTokens.tokenHash, tokenHash));
    return t;
  }

  async findBySessionId(sessionId: string): Promise<RefreshToken[]> {
    return db.select().from(refreshTokens).where(eq(refreshTokens.sessionId, sessionId));
  }

  async revoke(id: string): Promise<void> {
    await db.update(refreshTokens).set({ revoked: true, revokedAt: new Date() }).where(eq(refreshTokens.id, id));
  }

  async replace(oldId: string, newToken: NewRefreshToken): Promise<RefreshToken> {
    const [created] = await db.insert(refreshTokens).values(newToken).returning();
    await db.update(refreshTokens).set({ revoked: true, revokedAt: new Date(), replacedBy: created.id }).where(eq(refreshTokens.id, oldId));
    return created;
  }
}

export const refreshTokenRepository = new RefreshTokenRepository();
