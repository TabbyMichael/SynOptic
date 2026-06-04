import { sessionRepository } from '../repositories/session.repository';

export enum SecurityRiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const toRad = (v: number) => (v * Math.PI) / 180;
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export class DetectSuspiciousSessionsService {
  constructor(private repo = sessionRepository) {}

  async analyzeForUser(userId: string) {
    const sessions = await this.repo.findActiveByUser(userId);
    const results: Array<{ sessionId: string; risk: SecurityRiskLevel; reasons: string[] }> = [];

    for (const s of sessions) {
      const reasons: string[] = [];
      let risk = SecurityRiskLevel.LOW;

      const sCountry = s.location?.country;
      const sLat = s.location?.lat;
      const sLon = s.location?.lon;

      // check for multiple countries in short time windows
      for (const other of sessions) {
        if (other.id === s.id) continue;
        const otherCountry = other.location?.country;
        if (sCountry && otherCountry && sCountry !== otherCountry) {
          const dt = Math.abs(new Date(s.lastUsedAt).getTime() - new Date(other.lastUsedAt).getTime()) / 1000; // seconds
          if (dt < 3 * 60 * 60) {
            reasons.push('Login from different country within 3 hours');
            risk = SecurityRiskLevel.HIGH;
            break;
          }
        }
      }

      // new device or browser
      const seenSameDevice = sessions.some((x) => x.id !== s.id && x.deviceName === s.deviceName);
      if (!seenSameDevice && s.deviceName) {
        reasons.push('New device detected');
        if (risk !== SecurityRiskLevel.HIGH) risk = SecurityRiskLevel.MEDIUM;
      }

      const seenSameBrowser = sessions.some((x) => x.id !== s.id && x.browser === s.browser);
      if (!seenSameBrowser && s.browser) {
        reasons.push('New browser detected');
        if (risk !== SecurityRiskLevel.HIGH) risk = SecurityRiskLevel.MEDIUM;
      }

      // impossible travel detection
      if (sLat && sLon) {
        for (const other of sessions) {
          if (other.id === s.id) continue;
          const oLat = other.location?.lat;
          const oLon = other.location?.lon;
          if (oLat && oLon) {
            const dist = haversineKm(sLat, sLon, oLat, oLon);
            const dt = Math.abs(new Date(s.lastUsedAt).getTime() - new Date(other.lastUsedAt).getTime()) / 1000; // seconds
            const hours = dt / 3600;
            const speed = hours > 0 ? dist / hours : Infinity; // km/h
            if (speed > 1000) {
              reasons.push('Impossible travel detected');
              risk = SecurityRiskLevel.HIGH;
              break;
            }
            if (speed > 500 && risk !== SecurityRiskLevel.HIGH) {
              reasons.push('Unusually fast travel between locations');
              if (risk !== SecurityRiskLevel.HIGH) risk = SecurityRiskLevel.MEDIUM;
            }
          }
        }
      }

      results.push({ sessionId: s.id, risk, reasons });
    }

    return results;
  }
}

export const detectSuspiciousSessionsService = new DetectSuspiciousSessionsService();
