import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AlertService } from './alert.service';
import { db } from '../../../infrastructure/database/db.service';
import { auditLogger } from '../../audit/services/audit-logger.service';
import { alertRuleFactory } from '../../../../tests/factories/domain-factories';

vi.mock('../../../infrastructure/database/db.service', () => ({
  db: {
    select: vi.fn(() => ({
      from: vi.fn(() => ({
        where: vi.fn(),
      })),
    })),
    insert: vi.fn(() => ({
      values: vi.fn(() => ({
        returning: vi.fn(),
      })),
    })),
  },
}));

vi.mock('../../audit/services/audit-logger.service', () => ({
  auditLogger: {
    log: vi.fn(),
  },
}));

vi.mock('../../../infrastructure/logger/logger.service', () => ({
  logger: {
    warn: vi.fn(),
  },
}));

describe('AlertService', () => {
  let alertService: AlertService;

  beforeEach(() => {
    alertService = new AlertService();
    vi.clearAllMocks();
  });

  describe('evaluateRules', () => {
    it('should trigger alert when condition is met', async () => {
      const mockRule = alertRuleFactory({ metric: 'temp', operator: '>', threshold: 30 });
      const mockSnapshot = { temp: 35 } as any;
      const mockEvent = { id: 'event-1' };

      vi.mocked(db.select).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([mockRule]),
        }),
      } as any);

      vi.mocked(db.insert).mockReturnValue({
        values: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([mockEvent]),
        }),
      } as any);

      await alertService.evaluateRules('farm-1', mockSnapshot);

      expect(db.insert).toHaveBeenCalled();
      expect(auditLogger.log).toHaveBeenCalledWith(expect.objectContaining({
        action: 'ALERT_TRIGGERED',
        entityId: 'event-1',
      }));
    });

    it('should cover all operators and skip if metric is missing', async () => {
      const mockRules = [
        alertRuleFactory({ id: '1', metric: 'temp', operator: '<', threshold: 10 }),
        alertRuleFactory({ id: '2', metric: 'temp', operator: '>=', threshold: 20 }),
        alertRuleFactory({ id: '3', metric: 'temp', operator: '<=', threshold: 5 }),
        alertRuleFactory({ id: '4', metric: 'temp', operator: '==', threshold: 0 }),
        alertRuleFactory({ id: '5', metric: 'missing', operator: '>', threshold: 0 }),
        alertRuleFactory({ id: '6', metric: 'temp', operator: 'unknown', threshold: 0 }),
      ];
      const mockSnapshot = { temp: 25 } as any;

      vi.mocked(db.select).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue(mockRules),
        }),
      } as any);

      vi.mocked(db.insert).mockReturnValue({
        values: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([{ id: 'event-id' }]),
        }),
      } as any);

      await alertService.evaluateRules('farm-1', mockSnapshot);
      
      // rule 1: 25 < 10 (false)
      // rule 2: 25 >= 20 (true) -> trigger
      // rule 3: 25 <= 5 (false)
      // rule 4: 25 == 0 (false)
      // rule 5: missing -> skip
      // rule 6: unknown -> false

      expect(db.insert).toHaveBeenCalledTimes(1);
    });
  });
});
