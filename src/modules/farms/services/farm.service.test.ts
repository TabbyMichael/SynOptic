import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FarmService } from './farm.service';
import { farmFactory } from '@/../tests/factories/domain-factories';
import { FarmNotFoundError, UnauthorizedError } from '@/shared/errors/domain-errors';

describe('FarmService', () => {
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
    farmService = new FarmService(mockRepo as any);
  });

  it('should create a farm when authorized', async () => {
    const farmData = { name: 'New Farm', county: 'Napa', latitude: 38, longitude: -122, acres: 10 };
    const mockFarm = farmFactory({ ...farmData, id: '1', ownerId: 'user-1' });
    mockRepo.create.mockResolvedValue(mockFarm);

    const result = await farmService.createFarm('user-1', 'FARMER', farmData);

    expect(result).toEqual(mockFarm);
    expect(mockRepo.create).toHaveBeenCalledWith(expect.objectContaining({ ownerId: 'user-1' }));
  });

  it('should throw UnauthorizedError if user role is not allowed to create', async () => {
    await expect(farmService.createFarm('user-1', 'GUEST' as any, {} as any))
      .rejects.toThrow(UnauthorizedError);
  });

  it('should get farm if user is owner', async () => {
    const mockFarm = farmFactory({ id: 'farm-1', ownerId: 'user-1' });
    mockRepo.findById.mockResolvedValue(mockFarm);

    const result = await farmService.getFarm('user-1', 'FARMER', 'farm-1');

    expect(result).toEqual(mockFarm);
  });

  it('should throw UnauthorizedError when getting unauthorized farm', async () => {
    const mockFarm = farmFactory({ id: 'farm-1', ownerId: 'user-2' });
    mockRepo.findById.mockResolvedValue(mockFarm);
    await expect(farmService.getFarm('user-1', 'FARMER', 'farm-1'))
      .rejects.toThrow(UnauthorizedError);
  });

  it('should throw FarmNotFoundError if farm does not exist', async () => {
    mockRepo.findById.mockResolvedValue(null);
    await expect(farmService.getFarm('user-1', 'FARMER', 'farm-1'))
      .rejects.toThrow(FarmNotFoundError);
  });

  it('should list all farms for ADMIN', async () => {
    const mockFarms = [farmFactory()];
    mockRepo.listAll.mockResolvedValue(mockFarms);

    const result = await farmService.listFarms('admin-1', 'ADMIN');
    expect(result).toEqual(mockFarms);
    expect(mockRepo.listAll).toHaveBeenCalled();
  });

  it('should list owner farms for FARMER', async () => {
    const mockFarms = [farmFactory()];
    mockRepo.findByOwnerId.mockResolvedValue(mockFarms);

    const result = await farmService.listFarms('user-1', 'FARMER');
    expect(result).toEqual(mockFarms);
    expect(mockRepo.findByOwnerId).toHaveBeenCalledWith('user-1');
  });

  it('should update farm if authorized', async () => {
    const mockFarm = farmFactory({ id: 'farm-1', ownerId: 'user-1' });
    mockRepo.findById.mockResolvedValue(mockFarm);
    mockRepo.update.mockResolvedValue({ ...mockFarm, name: 'Updated' });

    const result = await farmService.updateFarm('user-1', 'FARMER', 'farm-1', { name: 'Updated' });
    expect(result.name).toBe('Updated');
  });

  it('should throw error when updating non-existent farm', async () => {
    mockRepo.findById.mockResolvedValue(null);
    await expect(farmService.updateFarm('user-1', 'FARMER', 'farm-1', {}))
      .rejects.toThrow(FarmNotFoundError);
  });

  it('should throw UnauthorizedError when updating unauthorized farm', async () => {
    const mockFarm = farmFactory({ id: 'farm-1', ownerId: 'user-2' });
    mockRepo.findById.mockResolvedValue(mockFarm);
    await expect(farmService.updateFarm('user-1', 'FARMER', 'farm-1', {}))
      .rejects.toThrow(UnauthorizedError);
  });

  it('should delete farm if authorized', async () => {
    const mockFarm = farmFactory({ id: 'farm-1', ownerId: 'user-1' });
    mockRepo.findById.mockResolvedValue(mockFarm);

    await farmService.deleteFarm('user-1', 'FARMER', 'farm-1');
    expect(mockRepo.delete).toHaveBeenCalledWith('farm-1');
  });

  it('should throw error when deleting non-existent farm', async () => {
    mockRepo.findById.mockResolvedValue(null);
    await expect(farmService.deleteFarm('user-1', 'FARMER', 'farm-1'))
      .rejects.toThrow(FarmNotFoundError);
  });

  it('should throw UnauthorizedError when deleting unauthorized farm', async () => {
    const mockFarm = farmFactory({ id: 'farm-1', ownerId: 'user-2' });
    mockRepo.findById.mockResolvedValue(mockFarm);
    await expect(farmService.deleteFarm('user-1', 'FARMER', 'farm-1'))
      .rejects.toThrow(UnauthorizedError);
  });
});
