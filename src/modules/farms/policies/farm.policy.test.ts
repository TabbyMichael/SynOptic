import { describe, it, expect } from 'vitest';
import { FarmPolicy } from './farm.policy';
import { Farm } from '../repositories/farm.repository.interface';

describe('FarmPolicy', () => {
  const mockFarm: Farm = {
    id: 'farm-1',
    ownerId: 'user-1',
    name: 'Test Farm',
    county: 'Test County',
    latitude: 0,
    longitude: 0,
    acres: 10,
    status: 'ACTIVE',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  describe('canCreate', () => {
    it('should allow ADMIN and FARMER', () => {
      expect(FarmPolicy.canCreate('ADMIN')).toBe(true);
      expect(FarmPolicy.canCreate('FARMER')).toBe(true);
      expect(FarmPolicy.canCreate('GUEST' as any)).toBe(false);
    });
  });

  describe('canUpdate', () => {
    it('should allow ADMIN or owner', () => {
      expect(FarmPolicy.canUpdate('ADMIN', 'other-user', mockFarm)).toBe(true);
      expect(FarmPolicy.canUpdate('FARMER', 'user-1', mockFarm)).toBe(true);
      expect(FarmPolicy.canUpdate('FARMER', 'other-user', mockFarm)).toBe(false);
    });
  });

  describe('canDelete', () => {
    it('should allow ADMIN or owner', () => {
      expect(FarmPolicy.canDelete('ADMIN', 'other-user', mockFarm)).toBe(true);
      expect(FarmPolicy.canDelete('FARMER', 'user-1', mockFarm)).toBe(true);
      expect(FarmPolicy.canDelete('FARMER', 'other-user', mockFarm)).toBe(false);
    });
  });

  describe('canView', () => {
    it('should allow ADMIN or owner', () => {
      expect(FarmPolicy.canView('ADMIN', 'other-user', mockFarm)).toBe(true);
      expect(FarmPolicy.canView('FARMER', 'user-1', mockFarm)).toBe(true);
      expect(FarmPolicy.canView('FARMER', 'other-user', mockFarm)).toBe(false);
    });
  });

  describe('canList', () => {
    it('should allow everyone', () => {
      expect(FarmPolicy.canList('FARMER')).toBe(true);
    });
  });
});
