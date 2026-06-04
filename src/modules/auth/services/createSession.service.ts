import { sessionRepository } from '../repositories/session.repository';
import { refreshTokenRepository } from '../repositories/refreshToken.repository';
import { auditLogger } from '../../audit/services/audit-logger.service';
import { CreateSessionDTO } from '../dtos/session.dto';
import { randomUUID } from 'crypto';
import { logger } from '../../../infrastructure/logger/logger.service';

export class CreateSessionService {
  constructor(private repo = sessionRepository, private tokenRepo = refreshTokenRepository) {}

  async create(dto: CreateSessionDTO) {
    const session = await this.repo.create({
      id: randomUUID(),
      userId: dto.userId,
      deviceName: dto.deviceName,
      browser: dto.browser,
      operatingSystem: dto.operatingSystem,
      userAgent: dto.userAgent,
      ipAddress: dto.ipAddress,
      location: dto.location ?? null,
      current: true,
      trusted: !!dto.trusted,
      createdAt: new Date(),
      lastUsedAt: new Date(),
      expiresAt: dto.expiresAt ?? null,
      revoked: false,
      revokedAt: null,
    } as any);

    await auditLogger.log({
      userId: dto.userId,
      action: 'SESSION_CREATED',
      entityType: 'session',
      entityId: session.id,
      metadata: { device: dto.deviceName, ip: dto.ipAddress },
    });

    logger.info({ userId: dto.userId, sessionId: session.id }, 'session_created');

    return session;
  }
}

export const createSessionService = new CreateSessionService();
