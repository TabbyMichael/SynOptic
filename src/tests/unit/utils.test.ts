import { describe, it, expect } from 'vitest';
import { cn } from '../../../lib/utils';

describe('cn utility', () => {
  it('should merge tailwind classes correctly', () => {
    const result = cn('px-2 py-1', 'bg-red-500');
    expect(result).toContain('px-2');
    expect(result).toContain('py-1');
    expect(result).toContain('bg-red-500');
  });

  it('should handle conditional classes', () => {
    const isError = true;
    const result = cn('base', isError && 'text-red-500', !isError && 'text-blue-500');
    expect(result).toContain('base');
    expect(result).toContain('text-red-500');
    expect(result).not.toContain('text-blue-500');
  });

  it('should resolve tailwind conflicts', () => {
    const result = cn('p-4', 'p-2');
    expect(result).toBe('p-2');
  });
});
