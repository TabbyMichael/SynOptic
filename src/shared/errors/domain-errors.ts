export class DomainError extends Error {
  constructor(public message: string, public code: string = 'DOMAIN_ERROR', public statusCode: number = 400) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class FarmNotFoundError extends DomainError {
  constructor(id: string) {
    super(`Farm with ID ${id} not found`, 'FARM_NOT_FOUND', 404);
  }
}

export class AnalysisFailedError extends DomainError {
  constructor(reason: string) {
    super(`Analysis failed: ${reason}`, 'ANALYSIS_FAILED', 500);
  }
}

export class WeatherUnavailableError extends DomainError {
  constructor() {
    super('Weather service is currently unavailable', 'WEATHER_UNAVAILABLE', 503);
  }
}

export class AlertEvaluationError extends DomainError {
  constructor(details: string) {
    super(`Alert evaluation failed: ${details}`, 'ALERT_EVALUATION_ERROR', 500);
  }
}

export class UnauthorizedError extends DomainError {
  constructor(message: string = 'Unauthorized') {
    super(message, 'UNAUTHORIZED', 401);
  }
}

export class ForbiddenError extends DomainError {
  constructor(message: string = 'Forbidden') {
    super(message, 'FORBIDDEN', 403);
  }
}

export class ValidationError extends DomainError {
  constructor(details: any) {
    super('Validation failed', 'VALIDATION_ERROR', 422);
    this.metadata = details;
  }
  public metadata?: any;
}
