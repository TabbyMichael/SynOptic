# API Reference (OpenAPI-style)

This document describes the public API endpoints implemented as Next.js API routes. All endpoints require `Authorization` via session cookie or bearer token as configured by Auth.js unless otherwise noted.

## Authentication

### POST /api/auth/signin
- Description: Sign in user (delegates to Auth.js provider)
- Auth: anonymous
- Request: provider-specific
- Response: 200 OK (session established)
- Errors: 401 Unauthorized

### POST /api/auth/signout
- Description: Sign out current session
- Auth: session
- Response: 204 No Content

## Users

### GET /api/users/me
- Description: Get current user profile
- Auth: session
- Response: 200

```json
{
  "id": "string",
  "email": "user@example.com",
  "roles": ["manager"],
  "name": "Jane Farmer"
}
```

## Farms

### GET /api/farms
- Description: List farms visible to the user
- Auth: session
- Query params: `page`, `limit`, `q`
- Response: 200 — paginated list

### POST /api/farms
- Description: Create a new farm
- Auth: session (role: manager|admin)
- Request body (application/json):

```json
{
  "name": "North Field",
  "location": { "lat": 12.34, "lon": 56.78 },
  "metadata": { "timezone": "UTC" }
}
```

### GET /api/farms/{id}
- Description: Get farm details by id
- Auth: session
- Response: 200 or 404

## Weather

### GET /api/farms/{farmId}/weather/snapshots
- Description: List weather snapshots for a farm (paginated)
- Auth: session (must have access to farm)
- Query params: `from`, `to`, `metric`, `page`, `limit`

### POST /api/farms/{farmId}/weather/snapshots
- Description: Ingest a new snapshot (internal / ingestion)
- Auth: internal or signed webhook (use NEXTAUTH_SECRET or VERCEL_CRON_TOKEN)
- Body schema:

```json
{
  "timestamp": "2026-06-04T12:00:00Z",
  "metrics": { "temp": 28.3, "humidity": 76, "rain": 2.4 }
}
```

## Forestry

### GET /api/farms/{farmId}/forestry
- Description: Get forestry metrics and history
- Auth: session

### POST /api/farms/{farmId}/forestry/scan
- Description: Trigger an on-demand forestry scan (admin/manager)
- Auth: session (role: manager|admin)

## Alerts

### GET /api/farms/{farmId}/alerts/rules
- Description: List alert rules
- Auth: session

### POST /api/farms/{farmId}/alerts/rules
- Description: Create alert rule
- Auth: session (role: manager|admin)
- Body schema:

```json
{
  "metric": "temp",
  "operator": ">",
  "threshold": 35,
  "active": true
}
```

### GET /api/farms/{farmId}/alerts/events
- Description: List alert events (filter by status)
- Auth: session

### POST /api/farms/{farmId}/alerts/events/{eventId}/ack
- Description: Acknowledge an alert event
- Auth: session (role: operator|manager|admin)

## Analytics

### GET /api/farms/{farmId}/analytics
- Description: Get derived analytics and KPIs
- Auth: session
- Query params: `range`, `granularity`

## Administration

### GET /api/admin/users
- Description: List all users (admin only)
- Auth: session (role: admin)

### POST /api/admin/maintenance/refresh-materialized
- Description: Trigger recompute of derived analytics
- Auth: session (role: admin)

## Cron / Internal Endpoints

### POST /api/internal/cron/ingest-weather
- Description: Endpoint invoked by Vercel Cron to run snapshot ingestion and alert evaluation. Protect with `VERCEL_CRON_TOKEN`.

## Error Responses

All errors follow a uniform shape:

```json
{
  "error": {
    "code": "BAD_REQUEST",
    "message": "Validation failed",
    "details": {
      "field": "metric",
      "issue": "unsupported metric"
    }
  }
}
```

## Validation Rules

- Use Zod schemas for all request bodies and query parameters. Return 400 on validation errors.

## Examples

- Create alert rule:

```bash
curl -X POST "https://app.example.com/api/farms/123/alerts/rules" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"metric":"temp","operator":">","threshold":35,"active":true}'
```
