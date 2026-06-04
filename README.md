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

