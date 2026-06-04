# Contributing to AgroInsight AI

Thank you for contributing. This document describes the development workflow, expectations, and requirements for contributions.

Development Workflow

- Fork the repository and create feature branches from `main`.
- Branch naming: `feat/<short-desc>`, `fix/<short-desc>`, `chore/<short-desc>`, `docs/<short-desc>`.
- Open a PR against `main` with a descriptive title and changelog-style description.

Branch Strategy

- `main` — Always deployable; merged PRs must pass CI and reviews.
- Feature branches — short-lived; rebase or squash as needed.

Commit Conventions

Follow Conventional Commits. Examples:

- `feat(farms): add spatial index for farm locations`
- `fix(alerts): ensure event ack updates status`
- `chore(deps): bump drizzle to 3.0`

Testing Requirements

- New features must include unit tests covering logic paths.
- Bug fixes should include regression tests when applicable.
- Integration tests for end-to-end behavior are required for changes touching multiple services.

Code Review Checklist

- Tests: Unit/integration tests included and passing.
- Documentation: User-facing and developer documentation updated.
- Security: Inputs validated; secrets not leaked.
- Performance: No obvious N+1 queries or unbounded loops in hot paths.
- Style: Follow existing code patterns and formatting.

Definition of Done

- Code compiles and tests pass in CI.
- PR has at least one approving review from a peer and one from the architecture/engineering lead for impactful changes.
- Documentation updated (README, API, or architecture docs) if behavior changed.

Refactoring Guidelines

- Keep refactors small and focused. Separate refactors from feature work.
- Provide benchmarks or tests if refactor affects performance-sensitive code.

Architecture Rules

- Prefer SRP (single responsibility) for services.
- Keep side-effects in service layer; repositories should be pure DB adapters.

Maximum File Length Rule

- Keep files under ~500 lines when feasible; prefer splitting large files into focused modules.

Testing Expectations

- Aim for high coverage in domain logic; don't over-test trivial getters/setters.

Documentation Expectations

- Document public APIs, important invariants, and operational runbooks.
