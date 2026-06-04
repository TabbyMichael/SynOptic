# Architecture Decision Records (ADR)

This document records the key architectural decisions for AgroInsight AI.

## ADR 1: Next.js 15 for Frontend and API
- **Context**: Need a unified framework for fast iteration and SEO.
- **Decision**: Use Next.js 15 with App Router.
- **Consequences**: Simplified deployment on Vercel, unified codebase.

## ADR 2: PostgreSQL with Drizzle ORM
- **Context**: Need a robust relational database with type safety.
- **Decision**: PostgreSQL (Neon) with Drizzle ORM.
- **Consequences**: Great DX, type-safe queries, easy migrations.

## ADR 3: Feature-First Architecture
- **Context**: Project complexity is expected to grow.
- **Decision**: Organize code by feature (modules) rather than layer.
- **Consequences**: Better encapsulation, easier to reason about specific domains.

## ADR 4: Auth.js for Authentication
- **Context**: Need secure, multi-provider auth.
- **Decision**: Auth.js.
- **Consequences**: Rapid implementation of secure auth flows.

## ADR 5: Vercel Cron for Background Jobs
- **Context**: Need a simple way to schedule ingestion and evaluation.
- **Decision**: Vercel Cron.
- **Consequences**: No need for separate worker infrastructure for light tasks.

## ADR 6: Repository and Service Patterns
- **Context**: Need to decouple business logic from data access.
- `Decision`: Explicitly use Repository and Service layers within modules.
- **Consequences**: Improved testability and modularity.
