import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FarmRepository } from './farm.repository';
import { db } from '../../../infrastructure/database/db.service';
import { eq } from 'drizzle-orm';

vi.mock('../../../infrastructure/database/db.service', () => ({
  db: {
    insert: vi.fn(),
    select: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('FarmRepository', () => {
  let repo: FarmRepository;

  beforeEach(() => {
    repo = new FarmRepository();
    vi.clearAllMocks();
  });

  it('should create a farm', async () => {
    const mockFarm = { id: '1', name: 'Farm 1' };
    vi.mocked(db.insert).mockReturnValue({
      values: vi.fn().mockReturnValue({
        returning: vi.fn().mockResolvedValue([mockFarm]),
      }),
    } as any);

    const result = await repo.create({ name: 'Farm 1' } as any);
    expect(result).toEqual(mockFarm);
  });

  it('should findById', async () => {
    const mockFarm = { id: '1', name: 'Farm 1' };
    vi.mocked(db.select).mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue([mockFarm]),
      }),
    } as any);

    const result = await repo.findById('1');
    expect(result).toEqual(mockFarm);
  });

  it('should findByOwnerId', async () => {
    const mockFarms = [{ id: '1', ownerId: 'user-1' }];
    vi.mocked(db.select).mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue(mockFarms),
      }),
    } as any);

    const result = await repo.findByOwnerId('user-1');
    expect(result).toEqual(mockFarms);
  });

  it('should update a farm', async () => {
    const mockFarm = { id: '1', name: 'Updated Farm' };
    vi.mocked(db.update).mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([mockFarm]),
        }),
      }),
    } as any);

    const result = await repo.update('1', { name: 'Updated Farm' });
    expect(result).toEqual(mockFarm);
  });

  it('should delete a farm', async () => {
    vi.mocked(db.delete).mockReturnValue({
      where: vi.fn().mockResolvedValue(undefined),
    } as any);

    await repo.delete('1');
    expect(db.delete).toHaveBeenCalled();
  });

  it('should list all farms', async () => {
    const mockFarms = [{ id: '1' }];
    vi.mocked(db.select).mockReturnValue({
      from: vi.fn().mockResolvedValue(mockFarms),
    } as any);

    const result = await repo.listAll();
    expect(result).toEqual(mockFarms);
  });
});
