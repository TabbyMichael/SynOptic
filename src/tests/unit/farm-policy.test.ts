import { describe, it, expect } from 'vitest';
import { FarmPolicy } from '../../modules/farms/policies/farm.policy';
import { farmFactory } from '../../../tests/factories/domain-factories';

describe('FarmPolicy', () => {
  describe('canCreate', () => {
    it('should allow ADMIN to create', () => {
      expect(FarmPolicy.canCreate('ADMIN')).toBe(true);
    });

    it('should allow FARMER to create', () => {
      expect(FarmPolicy.canCreate('FARMER')).toBe(true);
    });
  });

  describe('canUpdate', () => {
    const farm = farmFactory({ ownerId: 'user-1' });

    it('should allow owner to update', () => {
      expect(FarmPolicy.canUpdate('FARMER', 'user-1', farm as any)).toBe(true);
    });

    it('should deny non-owner to update', () => {
      expect(FarmPolicy.canUpdate('FARMER', 'user-2', farm as any)).toBe(false);
    });
  });
});
