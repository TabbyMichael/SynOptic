import { sessionRepository } from '../repositories/session.repository';
import { refreshTokenRepository } from '../repositories/refreshToken.repository';
import { auditLogger } from '../../audit/services/audit-logger.service';
import { logger } from '../../../infrastructure/logger/logger.service';

export class RevokeAllSessionsService {
  constructor(private repo = sessionRepository, private tokenRepo = refreshTokenRepository) {}

  async revokeAll(userId: string, exceptSessionId?: string) {
    const count = await this.repo.revokeAllForUser(userId, exceptSessionId);

    // revoke tokens for all sessions for user (exceptSessionId if provided was restored)
    const sessions = await this.repo.findByUserId(userId, 1000, 0);
    const toRevoke = sessions.filter(s => s.revoked).map(s => s.id);
    for (const sid of toRevoke) {
      const tokens = await this.tokenRepo.findBySessionId(sid);
      await Promise.all(tokens.map(t => this.tokenRepo.revoke(t.id)));
    }

    await auditLogger.log({
      userId,
      action: 'SESSION_REVOKED_ALL',
      entityType: 'session',
      entityId: userId,
      metadata: { exceptSessionId },
    });

    logger.info({ userId, exceptSessionId, count }, 'sessions_revoked_all');
    return count;
  }
}

export const revokeAllSessionsService = new RevokeAllSessionsService();
