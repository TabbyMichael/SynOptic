import { randomUUID } from 'crypto';
import { 
  NewUser, NewFarm, NewAnalysis, NewWeatherSnapshot, 
  NewAlertRule, NewAlertEvent, NewAuditLog 
} from '../../src/infrastructure/database/repositories/interfaces';

const counties = [
  'Bomet', 'Kericho', 'Nakuru', 'Kiambu', 'Nyeri', 'Meru', 'Uasin Gishu'
];

function pick<T>(arr: T[]) { return arr[Math.floor(Math.random() * arr.length)]; }

export class UserFactory {
  static create(overrides: Partial<NewUser> = {}): NewUser {
    return {
      id: overrides.id ?? randomUUID(),
      email: overrides.email ?? `user.${Math.floor(Math.random() * 10000)}@example.com`,
      name: overrides.name ?? `User ${Math.floor(Math.random() * 1000)}`,
      role: overrides.role ?? 'FARMER',
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides
    };
  }
  static createMany(n: number, overrides: Partial<NewUser> = {}): NewUser[] {
    return Array.from({ length: n }).map(() => this.create(overrides));
  }
}

export class FarmFactory {
  static create(ownerId: string, overrides: Partial<NewFarm> = {}): NewFarm {
    return {
      id: overrides.id ?? randomUUID(),
      name: overrides.name ?? `Farm ${Math.floor(Math.random() * 10000)}`,
      ownerId: ownerId,
      county: overrides.county ?? pick(counties),
      latitude: overrides.latitude ?? -0.5 + Math.random(),
      longitude: overrides.longitude ?? 36 + Math.random(),
      acres: overrides.acres ?? 1 + Math.random() * 10,
      status: overrides.status ?? 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides
    };
  }
}

export class AnalysisFactory {
  static create(farmId: string, overrides: Partial<NewAnalysis> = {}): NewAnalysis {
    return {
      id: overrides.id ?? randomUUID(),
      farmId: farmId,
      analysisId: overrides.analysisId ?? `ANL-${Math.floor(Math.random() * 100000)}`,
      treeCount: overrides.treeCount ?? Math.floor(Math.random() * 1000),
      healthyCount: overrides.healthyCount ?? Math.floor(Math.random() * 800),
      needsCareCount: overrides.needsCareCount ?? Math.floor(Math.random() * 100),
      needsReplacementCount: overrides.needsReplacementCount ?? Math.floor(Math.random() * 50),
      canopyCoverage: overrides.canopyCoverage ?? Math.random() * 100,
      treeDensity: overrides.treeDensity ?? Math.random() * 50,
      confidenceScore: overrides.confidenceScore ?? 0.8 + Math.random() * 0.2,
      overlayUrl: overrides.overlayUrl ?? 'https://example.com/overlay.png',
      createdAt: new Date(),
      ...overrides
    };
  }
}

export class WeatherSnapshotFactory {
  static create(farmId: string, ts: Date = new Date(), overrides: Partial<NewWeatherSnapshot> = {}): NewWeatherSnapshot {
    return {
      id: overrides.id ?? randomUUID(),
      farmId: farmId,
      capturedAt: ts,
      temperature: overrides.temperature ?? +(15 + Math.random() * 15).toFixed(1),
      humidity: overrides.humidity ?? +(40 + Math.random() * 60).toFixed(1),
      windSpeed: overrides.windSpeed ?? +(0 + Math.random() * 15).toFixed(1),
      rainfall: overrides.rainfall ?? +(Math.random() * 20).toFixed(1),
      pressure: overrides.pressure ?? +(980 + Math.random() * 40).toFixed(1),
      ...overrides
    };
  }
}

export class AlertRuleFactory {
  static metrics = ['temperature', 'rainfall', 'wind_speed'];
  static create(farmId: string, overrides: Partial<NewAlertRule> = {}): NewAlertRule {
    return {
      id: overrides.id ?? randomUUID(),
      farmId: farmId,
      metric: overrides.metric ?? pick(this.metrics),
      operator: overrides.operator ?? '>',
      threshold: overrides.threshold ?? Math.floor(Math.random() * 100),
      severity: overrides.severity ?? 'warning',
      active: true,
      createdAt: new Date(),
      ...overrides
    };
  }
}

export class AlertEventFactory {
  static create(ruleId: string, overrides: Partial<NewAlertEvent> = {}): NewAlertEvent {
    return {
      id: overrides.id ?? randomUUID(),
      ruleId: ruleId,
      triggeredValue: overrides.triggeredValue ?? Math.floor(Math.random() * 100),
      status: overrides.status ?? 'OPEN',
      triggeredAt: new Date(),
      ...overrides
    };
  }
}

export class AuditLogFactory {
  static create(userId: string | null, action: string, entityType: string = 'SYSTEM', entityId: string = 'SYSTEM', overrides: Partial<NewAuditLog> = {}): NewAuditLog {
    return {
      id: overrides.id ?? randomUUID(),
      userId: userId,
      action,
      entityType: entityType,
      entityId: entityId,
      metadata: {},
      createdAt: new Date(),
      ...overrides
    };
  }
}
