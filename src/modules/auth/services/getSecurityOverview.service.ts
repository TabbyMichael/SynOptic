import { sessionRepository } from '../repositories/session.repository';
import { detectSuspiciousSessionsService, SecurityRiskLevel } from './detectSuspiciousSessions.service';
import { DrizzleAuditRepository } from '../../../infrastructure/database/repositories/drizzle-repositories';

export class GetSecurityOverviewService {
  constructor(private sessionRepo = sessionRepository, private auditRepo = new DrizzleAuditRepository()) {}

  async overviewForUser(userId: string) {
    const sessions = await this.sessionRepo.findActiveByUser(userId);
    const totalSessions = sessions.length;
    const currentSession = sessions.find((s) => !!s.current) ?? null;
    const trustedDevices = sessions.filter((s) => s.trusted).length;

    const suspicious = await detectSuspiciousSessionsService.analyzeForUser(userId);
    const suspiciousCount = suspicious.filter(s => s.risk !== SecurityRiskLevel.LOW).length;

    const recentEvents = await this.auditRepo.findByUserId(userId);

    // compute a lightweight security score (0-100)
    let score = 100;
    if (suspiciousCount > 0) score -= Math.min(60, suspiciousCount * 20);
    if (trustedDevices < 1) score -= 10;
    score = Math.max(0, score);

    return {
      totalSessions,
      currentSessionId: currentSession?.id ?? null,
      trustedDevices,
      securityScore: score,
      suspiciousCount,
      recentEvents: recentEvents.slice(0, 20),
    };
  }
}

export const getSecurityOverviewService = new GetSecurityOverviewService();
