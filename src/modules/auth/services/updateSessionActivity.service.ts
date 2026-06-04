import { sessionRepository } from '../repositories/session.repository';

export class UpdateSessionActivityService {
  constructor(private repo = sessionRepository) {}

  async touch(sessionId: string) {
    const updated = await this.repo.update(sessionId, { lastUsedAt: new Date() } as any);
    return updated;
  }
}

export const updateSessionActivityService = new UpdateSessionActivityService();
