# Architecture Decisions (ADRs)

This document lists key architectural decisions and tradeoffs made for AgroInsight AI.

1. Why Next.js

- Context: Need for server-rendered UI, API routes, and fast developer experience.
- Decision: Use Next.js to host frontend and API in a single deployable unit.
- Consequences: Simplified deployment on Vercel; limited for heavy background processing.

2. Why PostgreSQL

- Context: Need relational integrity, complex queries, and time-series support for snapshots.
- Decision: Use PostgreSQL (Neon) as primary datastore.
- Consequences: Strong OLTP support; time-series scaling may require TimescaleDB or a dedicated TSDB later.

3. Why Drizzle

- Context: Typesafe ORM with compile-time typings and good developer ergonomics.
- Decision: Use Drizzle ORM to interface with Postgres.
- Consequences: Improved type safety and maintainability; small learning curve for new contributors.

4. Why Auth.js

- Context: Need for production-ready authentication with providers and session management.
- Decision: Use Auth.js as the authentication layer.
- Consequences: Secure sessions, provider integrations; complexity in session management for serverless functions handled.

5. Why Feature-Based Architecture

- Context: Product is domain-rich; teams should work on vertical slices.
- Decision: Organize code by feature/domain.
- Consequences: Easier ownership and discoverability; careful discipline required to keep shared utilities minimal.

6. Why Modular Monolith

- Context: Startups benefit from rapid iteration and simple ops.
- Decision: Modular monolith that can be split later if needed.
- Consequences: Faster development; must invest in modularization to avoid large coupling.

7. Why Vercel Cron

- Context: Need low-friction scheduled tasks for ingestion and light jobs.
- Decision: Use Vercel Cron for scheduled calls to internal endpoints.
- Consequences: Simple operations but not suitable for CPU-intensive or long-running jobs.

8. Why Policy-Based Authorization

- Context: Fine-grained access control needed across domains and farms.
- Decision: Implement a policy layer that encapsulates authorization rules.
- Consequences: Clear separation of auth logic and business logic; extra discipline for policy coverage.

9. Why Repository Pattern

- Context: Keep DB access encapsulated and testable.
- Decision: Use repository pattern backed by Drizzle as the DB adapter.
- Consequences: Easier mocking and testing; slightly more boilerplate.

10. Why Weather Snapshots Are Stored

- Context: Alerts and analytics require historical context.
- Decision: Persist snapshots as canonical records for auditing, alerting and re-computation.
- Consequences: Storage and retention required; enables re-computation and reproducibility.

11. Why Analytics Are Derived

- Context: Aggregations are expensive at read time and must support historical queries.
- Decision: Derive analytics via background jobs into materialized tables.
- Consequences: Faster reads, more storage and pipeline complexity.

12. Why Audit Logs Exist

- Context: Compliance, troubleshooting and security require immutable records of critical actions.
- Decision: Record audit logs for admin actions, alert triggers, and key state changes.
- Consequences: Additional storage and operational tooling for log retention.
