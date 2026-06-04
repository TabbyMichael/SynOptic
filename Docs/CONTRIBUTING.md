# Contributing Guide

Thank you for your interest in contributing to AgroInsight AI.

## Development Workflow
1. Fork the repository.
2. Create a feature branch: `feat/your-feature`.
3. Implement your changes and add tests.
4. Submit a Pull Request.

## Branch Strategy
- `main`: Production-ready code.
- `develop`: Integration branch.
- `feature/*`: New features.
- `fix/*`: Bug fixes.

## Commit Conventions
We follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:`: A new feature.
- `fix:`: A bug fix.
- `docs:`: Documentation changes.
- `test:`: Adding or correcting tests.

## Testing Requirements
- **Unit Tests**: Mandatory for new logic.
- **Integration Tests**: Required for API changes.
- **Coverage**: Aim for 80%+ coverage on core modules.

## Code Review Checklist
- Does it follow the architectural patterns?
- Are there tests for the new code?
- Is the documentation updated?
- Are the commit messages clear?

## Definition of Done
- Code passes all linting and type checks.
- All tests pass in the CI pipeline.
- Documentation is updated.
- Peer-reviewed and approved.

## Architecture Rules
- Business logic belongs in **Services**.
- Data access belongs in **Repositories**.
- UI components should be **presentational** where possible.

## Documentation Expectations
- Keep `API.md` and `ARCHITECTURE.md` up to date with your changes.
