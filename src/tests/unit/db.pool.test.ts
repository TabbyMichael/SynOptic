import { describe, it, expect, vi } from 'vitest';
import { logger } from '@/infrastructure/logger/logger.service';

// We define these outside so we can access them in tests
const mPoolOn = vi.fn();

vi.mock('pg', () => {
  return {
    Pool: class {
      on = mPoolOn;
      connect = vi.fn();
      query = vi.fn();
      end = vi.fn();
    }
  };
});

vi.mock('@/infrastructure/logger/logger.service', () => ({
  logger: {
    error: vi.fn(),
  },
}));

describe('DB Service Pool Error', () => {
  it('should handle pool error and exit', async () => {
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation((code?: string | number | null | undefined) => { 
        throw new Error('exit ' + code); 
    });
    
    vi.resetModules();
    await import('@/infrastructure/database/db.service');
    
    const errorCall = mPoolOn.mock.calls.find((call: any) => call[0] === 'error');
    expect(errorCall).toBeDefined();
    const errorCallback = errorCall[1];
    
    try {
        errorCallback(new Error('Pool error'));
    } catch (e: any) {
        expect(e.message).toBe('exit -1');
    }
    
    expect(logger.error).toHaveBeenCalled();
    expect(exitSpy).toHaveBeenCalledWith(-1);
    
    exitSpy.mockRestore();
  });
});
