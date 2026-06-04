import { sessionRepository } from '../repositories/session.repository';
import { SessionViewDTO } from '../dtos/session.dto';

export class GetSessionsService {
  constructor(private repo = sessionRepository) {}

  async listForUser(userId: string, limit = 20, offset = 0): Promise<SessionViewDTO[]> {
    const sessions = await this.repo.findByUserId(userId, limit, offset);
    return sessions.map((s) => ({
      id: s.id,
      deviceName: s.deviceName ?? undefined,
      browser: s.browser ?? undefined,
      operatingSystem: s.operatingSystem ?? undefined,
      ipAddress: s.ipAddress ?? undefined,
      location: s.location ?? null,
      current: !!s.current,
      trusted: !!s.trusted,
      createdAt: s.createdAt.toISOString(),
      lastUsedAt: s.lastUsedAt.toISOString(),
      expiresAt: s.expiresAt ? s.expiresAt.toISOString() : null,
      revoked: !!s.revoked,
    }));
  }
}

export const getSessionsService = new GetSessionsService();
