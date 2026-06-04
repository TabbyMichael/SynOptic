import { describe, it, expect, vi } from 'vitest';
import { AuditLoggerService } from '@/modules/audit/services/audit-logger.service';
import { db } from '@/infrastructure/database/db.service';
import { logger } from '@/infrastructure/logger/logger.service';

vi.mock('@/infrastructure/database/db.service', () => ({
  db: {
    insert: vi.fn(),
  },
}));

vi.mock('@/infrastructure/logger/logger.service', () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
  },
}));

describe('AuditLoggerService', () => {
  it('should catch and log errors during audit logging', async () => {
    // Mock the chain: db.insert().values()
    const mockValues = vi.fn().mockRejectedValue(new Error('DB Error'));
    vi.mocked(db.insert).mockReturnValue({
      values: mockValues,
    } as any);

    const service = new AuditLoggerService();
    await service.log({ action: 'FARM_CREATED', entityType: 'farm', entityId: '1' } as any);
    
    expect(mockValues).toHaveBeenCalled();
    expect(logger.error).toHaveBeenCalled();
  });
});
