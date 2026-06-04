import { describe, it, expect } from 'vitest';
import * as Errors from '@/shared/errors/domain-errors';

describe('Domain Errors', () => {
  it('should instantiate all error classes', () => {
    expect(new Errors.FarmNotFoundError('1').code).toBe('FARM_NOT_FOUND');
    expect(new Errors.AnalysisFailedError('reason').code).toBe('ANALYSIS_FAILED');
    expect(new Errors.WeatherUnavailableError().code).toBe('WEATHER_UNAVAILABLE');
    expect(new Errors.AlertEvaluationError('details').code).toBe('ALERT_EVALUATION_ERROR');
    expect(new Errors.UnauthorizedError().code).toBe('UNAUTHORIZED');
    expect(new Errors.ForbiddenError().code).toBe('FORBIDDEN');
    const valErr = new Errors.ValidationError({ foo: 'bar' });
    expect(valErr.code).toBe('VALIDATION_ERROR');
    expect(valErr.metadata).toEqual({ foo: 'bar' });
  });
});
