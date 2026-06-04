import { describe, it, expect } from 'vitest';
import { farmFactory, userFactory } from '../factories/domain-factories';

describe('Domain Factories', () => {
  it('should create a valid farm object with overrides', () => {
    const farm = farmFactory({ name: 'Custom Farm' });
    expect(farm.name).toBe('Custom Farm');
    expect(farm.id).toBeDefined();
    expect(farm.ownerId).toBeDefined();
  });

  it('should create a valid user object', () => {
    const user = userFactory({ role: 'ADMIN' });
    expect(user.role).toBe('ADMIN');
    expect(user.email).toContain('@example.com');
  });
});
