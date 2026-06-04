AgroInsight AI
================

AgroInsight AI is a farm intelligence platform providing actionable insights for modern agriculture. It combines real-time weather monitoring, forestry analysis, alerting based on configurable rules, farm-level analytics, and historical trend analysis to help operators make data-driven decisions.

Features
--------

- Authentication: Secure sign-in and session management.
- RBAC: Role-based access controls for admins, managers, analysts, and operators.
- Farm Management: Manage farms, fields, sensors, and integrations.
- Forestry Analysis: Tree and canopy analytics, health scoring, and change detection.
- Weather Intelligence: Ingests weather snapshots, historical trends, and derived indicators.
- Alert Rules: Configurable alert rules with thresholds and operators.
- Analytics Dashboard: Aggregations, KPIs, and visualizations for operational decisions.
- Audit Logging: Immutable audit trail for critical actions and alerts.
- Background Jobs: Scheduled snapshot ingestion, alert evaluation, and analytics processing.

Architecture Overview
---------------------

AgroInsight AI follows a feature-first monolithic architecture split into frontend, backend/API, database, background workers, and external integrations.

- Frontend: Next.js TypeScript application (React) with shadcn/ui and Tailwind for UI, TanStack Query for data fetching, React Hook Form for forms.
- Backend: Next.js API routes provide the server-side logic, service and repository layers handle business rules, Drizzle ORM for database access.
- Database: PostgreSQL (Neon) stores normalized domain entities, time-series snapshots, audit logs, and derived analytics.
- External Integrations: WeatherAI API (ingestion), optional SMS/email providers, sensor bridges.
- Background Processing: Vercel Cron or background workers for periodic snapshot ingestion, rule evaluation, and analytics jobs.

Tech Stack
----------

Frontend

- Next.js 15
- TypeScript
- Tailwind CSS
- shadcn/ui
- TanStack Query
- React Hook Form

Backend

- Next.js API Routes
- PostgreSQL (Neon)
- Drizzle ORM
- Auth.js
- Zod validation
- Pino logging

Infrastructure

- WeatherAI API
- Vercel Cron
- Neon PostgreSQL

Screenshots
-----------

Placeholders — replace with real screenshots in docs/screenshots/:

- Dashboard: docs/screenshots/dashboard.png
- Farm Management: docs/screenshots/farm-management.png
- Forestry Analysis: docs/screenshots/forestry-analysis.png
- Weather Dashboard: docs/screenshots/weather-dashboard.png
- Alerts: docs/screenshots/alerts.png
- Analytics: docs/screenshots/analytics.png
- Administration: docs/screenshots/admin.png

Project Structure
-----------------

This repo uses a feature-first layout. Top-level folders map to business domains (e.g., alerts, farms, weather) and contain modules, services, UI components, and tests related to that feature. Shared UI and utilities live under shared and ui.

High-level layout

- app/ — Next.js pages and routes
- components/ — Feature components and UI building blocks
- src/ — Server code: API endpoints, services, repositories, background jobs
- infrastructure/ — DB schema, migrations, logger, and infra adapters
- tests/ — Unit, integration, contract and e2e tests

Getting Started
---------------

Prerequisites

- Node 20+
- pnpm or npm
- PostgreSQL-compatible database (Neon recommended)
- Vercel account for deployment (optional)

Installation

1. Install dependencies

```bash
pnpm install
# or
npm install
```

2. Copy .env.example to .env and fill values

Environment Variables

- DATABASE_URL — Postgres connection string
- NEXTAUTH_URL — App base URL
- NEXTAUTH_SECRET — Auth.js secret
- WEATHERAI_API_KEY — Weather provider key
- VERCEL_CRON_TOKEN — (Optional) Cron auth token

Database Setup

Run migrations with the project's migration runner (Drizzle migrations):

```bash
pnpm run migrate:up
```

Seed Data

```bash
pnpm run db:seed
```

Starting Development Server

```bash
pnpm dev
```

Testing
-------

- Unit Tests: Run with `pnpm test:unit`.
- Integration Tests: Use test DB and run `pnpm test:integration`.
- Contract Tests: Verify API contracts with `pnpm test:contract`.
- E2E Tests: Cypress/Playwright — `pnpm test:e2e`.
- Coverage: `pnpm test --coverage`.

Security
--------

- Authentication: Auth.js for secure session management.
- Authorization: RBAC via policy layer; prefer least privilege.
- Input Validation: Zod schemas on all public APIs.
- Audit Logging: Record administrative actions, alert triggers and critical state changes.

Performance
-----------

- Caching: HTTP-level and application caches for read-heavy endpoints.
- Background Jobs: Snapshot ingestion and analytics run off-request to keep APIs responsive.
- Optimized Queries: Use Drizzle ORM with well-indexed tables and batched queries.

Deployment
----------

- Vercel: Recommended for hosting Next.js frontend and API routes.
- PostgreSQL: Neon or managed Postgres. Ensure replica for analytics/storage separation.
- Environment Variables: Store secrets in Vercel/Cloud provider.
- Cron Jobs: Vercel Cron for scheduled jobs; alternatively use a worker platform.

Future Improvements
-------------------

- AI-driven recommendations for farm operations
- SMS and Rich Alerts integration
- Native mobile apps
- Multi-tenant organizations and team management

Engineering Principles
---------------------

- Low Coupling / High Cohesion: Features encapsulated and communicate through well-defined interfaces.
- Testability: Services and repositories are designed for injection and unit testing.
- Modularity: Feature modules encapsulate models, services, APIs and UI.
- Defensive Programming: Validate external inputs and fail safely; observability and alerts for runtime issues.

Where to Next
-------------

See the detailed architecture in ARCHITECTURE.md and the API contract in API.md.
# AgroInsight AI

Professional project overview.

AgroInsight AI is a farm intelligence platform that combines weather monitoring, forestry analysis, weather-based alerting, farm analytics, and historical insights into a unified dashboard for operations, agronomists, and analysts.

---

# Features

- **Authentication**: Secure sign-in and session management using Auth.js.
- **RBAC**: Role-based access control for multi-person teams.
- **Farm Management**: Create, view, and manage farms, plots, and sensors.
- **Forestry Analysis**: Satellite/imagery-backed forestry insights and change detection.
- **Weather Intelligence**: Current conditions, forecasts, and historical snapshots.
- **Alert Rules**: Define, evaluate, and dispatch alerts based on weather conditions.
- **Analytics Dashboard**: Time-series analytics and derived KPIs.
- **Audit Logging**: Immutable audit trails for sensitive operations.
- **Background Jobs**: Scheduled tasks for data ingestion and batch analysis.

---

# Architecture Overview

AgroInsight AI follows a modular monolith architecture with a feature-first structure.

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS, shadcn/ui.
- **Backend**: Next.js API Routes, modular service layer, repository pattern.
- **Database**: PostgreSQL (Neon) with Drizzle ORM.
- **External Integrations**: WeatherAI API, satellite imagery providers.
- **Background Processing**: Vercel Cron for scheduled tasks.

---

# Tech Stack

**Frontend**
* Next.js 15
* TypeScript
* Tailwind
* shadcn/ui
* TanStack Query
* React Hook Form

**Backend**
* Next.js API Routes
* PostgreSQL
* Drizzle ORM
* Auth.js
* Zod
* Pino

**Infrastructure**
* WeatherAI API
* Vercel Cron
* Neon PostgreSQL

---

# Screenshots

Placeholder sections for future visuals:

- **Dashboard**: ![Dashboard](docs/screenshots/dashboard.png)
- **Farm Management**: ![Farms](docs/screenshots/farms.png)
- **Forestry Analysis**: ![Forestry](docs/screenshots/forestry.png)
- **Weather Dashboard**: ![Weather](docs/screenshots/weather.png)
- **Alerts**: ![Alerts](docs/screenshots/alerts.png)
- **Analytics**: ![Analytics](docs/screenshots/analytics.png)
- **Administration**: ![Admin](docs/screenshots/admin.png)

---

# Project Structure

The codebase is organized by feature to ensure high cohesion and low coupling.

```text
src/
  ├── modules/
  │   ├── farms/      # Everything related to farms
  │   ├── weather/    # Weather data and ingestion
  │   ├── alerts/     # Alert rules and evaluation
  │   ├── forestry/   # Satellite analysis
  │   ├── analytics/  # Reporting and KPIs
  │   └── admin/      # System management
  ├── infrastructure/ # Database, auth, and external clients
  └── shared/         # Common utils, types, and constants
```

---

# Documentation

Comprehensive documentation is available in the [Docs/](./Docs) folder:

* [Architecture](./Docs/ARCHITECTURE.md) - System design and domain models.
* [API Reference](./Docs/API.md) - Detailed API endpoint documentation.
* [Contributing Guide](./Docs/CONTRIBUTING.md) - Guidelines for developers.
* [Architecture Decisions](./Docs/DECISIONS.md) - Records of key technical choices.
* [Documentation Standards](./Docs/DOCUMENTATION_STANDARDS.md) - Standards for project docs.

---

# Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL instance

### Installation
1. Clone the repository
2. Run `npm install`
3. Copy `.env.example` to `.env` and fill in the values

### Database Setup
```bash
npm run db:push
npm run db:seed
```

### Running the App
```bash
npm run dev
```

---

# Testing

Comprehensive test suite across multiple levels:
- **Unit Tests**: `npm run test:unit`
- **Integration Tests**: `npm run test:integration`
- **Contract Tests**: `npm run test:contract`
- **E2E Tests**: `npm run test:e2e`

---

# Security

* **Authentication**: Auth.js with secure session management.
* **Authorization**: Granular RBAC and policy-based access control.
* **Input Validation**: All inputs validated via Zod schemas.
* **Audit Logging**: Sensitive actions are recorded in an immutable audit log.

---

# Performance

* **Caching**: Data-level caching and TanStack Query for UI responsiveness.
* **Background Jobs**: Heavy processing moved to async jobs via Vercel Cron.
* **Optimized Queries**: Drizzle ORM for type-safe and performant SQL.

---

# Deployment

The application is designed to be deployed on Vercel with Neon PostgreSQL.

---

# Future Improvements

* **AI Recommendations**: Machine learning for predictive farming insights.
* **SMS Alerts**: Integration with Twilio for mobile notifications.
* **Mobile App**: Cross-platform mobile client.
* **Multi-Tenant Organizations**: Support for complex organizational hierarchies.

---

# Engineering Principles

* **Low Coupling**: Modules are independent.
* **High Cohesion**: Related logic stays together.
* **Testability**: Code is written to be easily testable.
* **Modularity**: Feature-based design.
* **Defensive Programming**: Robust error handling and validation.

