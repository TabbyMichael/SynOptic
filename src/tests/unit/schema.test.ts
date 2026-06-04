import { describe, it, expect } from 'vitest';
import * as schema from '@/infrastructure/database/schema';

describe('Database Schema', () => {
  it('should have valid tables', () => {
    expect(schema.farms).toBeDefined();
    expect(schema.users).toBeDefined();
    expect(schema.alertEvents).toBeDefined();
  });
});
