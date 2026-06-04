import { sessionRepository } from '../repositories/session.repository';
import { refreshTokenRepository } from '../repositories/refreshToken.repository';
import { auditLogger } from '../../audit/services/audit-logger.service';
import { logger } from '../../../infrastructure/logger/logger.service';

export class RevokeSessionService {
  constructor(private repo = sessionRepository, private tokenRepo = refreshTokenRepository) {}

  async revoke(sessionId: string, userId?: string) {
    // revoke session
    await this.repo.revoke(sessionId, new Date());

    // revoke any refresh tokens tied to session
    const tokens = await this.tokenRepo.findBySessionId(sessionId);
    await Promise.all(tokens.map(t => this.tokenRepo.revoke(t.id)));

    await auditLogger.log({
      userId: userId,
      action: 'SESSION_REVOKED',
      entityType: 'session',
      entityId: sessionId,
      metadata: {},
    });

    logger.info({ sessionId, userId }, 'session_revoked');
  }
}

export const revokeSessionService = new RevokeSessionService();
