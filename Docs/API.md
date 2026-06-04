# API Reference

This document enumerates the primary API endpoints for AgroInsight AI.

## Base URL
All API endpoints are prefixed with `/api`.

## Authentication
Authentication is required for most endpoints. Use session cookies or a Bearer token.

## Error Format
```json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": {}
  }
}
```

## Modules

### Auth APIs
- `POST /api/auth/signin`: Authenticate a user.
- `POST /api/auth/signout`: End the current session.
- `GET /api/auth/me`: Get current user profile.

### Farm APIs
- `GET /api/farms`: List farms with pagination and filtering.
- `POST /api/farms`: Create a new farm.
- `GET /api/farms/{id}`: Get detailed farm information.
- `PATCH /api/farms/{id}`: Update farm metadata or location.
- `DELETE /api/farms/{id}`: Remove a farm.

### Weather APIs
- `GET /api/weather/farms/{farmId}/latest`: Latest weather snapshot.
- `GET /api/weather/farms/{farmId}/history`: Historical weather data.
- `POST /api/weather/snapshots`: (Internal) Ingest new weather data.

### Forestry APIs
- `GET /api/forestry/farms/{farmId}/analyses`: List forestry analysis results.
- `POST /api/forestry/analyses`: Trigger a new satellite analysis.

### Alert APIs
- `GET /api/alerts`: List alerts.
- `POST /api/alerts/rules`: Create alert rules.
- `POST /api/alerts/evaluate`: Trigger rule evaluation engine.

### Analytics APIs
- `GET /api/analytics/farms/{farmId}/overview`: Summary KPIs for a farm.
- `GET /api/analytics/reports/{reportId}`: Retrieve generated reports.

### Administration APIs
- `GET /api/admin/users`: List all users (Admin only).
- `PATCH /api/admin/users/{id}/roles`: Manage user roles.

### Cron APIs
- `POST /api/cron/weather-ingest`: Trigger weather data sync.
- `POST /api/cron/alert-evaluate`: Trigger alert evaluation.
