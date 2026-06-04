import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FarmService } from '../../modules/farms/services/farm.service';
import { farmFactory } from '../../../tests/factories/domain-factories';

describe('Farm Service Integration (Mocked Repo)', () => {
  let farmService: FarmService;
  let mockRepo: any;

  beforeEach(() => {
    mockRepo = {
      create: vi.fn(),
      findById: vi.fn(),
      findByOwnerId: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      listAll: vi.fn(),
    };
    farmService = new FarmService(mockRepo);
  });

  it('should handle a full farm lifecycle (create, get, update)', async () => {
    const userId = 'user-1';
    const farmData = { name: 'Integration Farm', county: 'Napa', latitude: 38, longitude: -122, acres: 10 };
    const mockFarm = farmFactory({ ...farmData, id: 'farm-123', ownerId: userId });

    mockRepo.create.mockResolvedValue(mockFarm);
    mockRepo.findById.mockResolvedValue(mockFarm);
    mockRepo.update.mockResolvedValue({ ...mockFarm, name: 'Updated Farm' });

    // 1. Create
    const created = await farmService.createFarm(userId, 'FARMER', farmData);
    expect(created.id).toBe('farm-123');

    // 2. Get
    const retrieved = await farmService.getFarm(userId, 'FARMER', 'farm-123');
    expect(retrieved.name).toBe('Integration Farm');

    // 3. Update
    const updated = await farmService.updateFarm(userId, 'FARMER', 'farm-123', { name: 'Updated Farm' });
    expect(updated.name).toBe('Updated Farm');
    
    expect(mockRepo.create).toHaveBeenCalledOnce();
    expect(mockRepo.findById).toHaveBeenCalledTimes(2); // Called in getFarm and updateFarm
    expect(mockRepo.update).toHaveBeenCalledOnce();
  });
});
