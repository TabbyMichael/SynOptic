# Documentation Standards

This file defines the standards expected for all documentation in the AgroInsight AI repository.

Standards

- Professional: Write in clear, unambiguous language aimed at engineers and product stakeholders.
- Production quality: Documentation must be accurate, actionable and kept up to date with code changes.
- Explain reasoning: Where possible explain why decisions were made, not just how.
- Include diagrams: Use mermaid diagrams for architecture and flow explanations.
- Include examples: Provide request/response examples, CLI snippets, and minimal reproducible samples.
- Include operational guidance: Healthchecks, scaling notes, and common troubleshooting steps.

Structure Guidelines

- README.md: high-level overview and getting started.
- ARCHITECTURE.md: design principles, diagrams, data model and operational concerns.
- API.md: OpenAPI-style reference with schemas and examples.
- CONTRIBUTING.md: workflow and expectations.
- DECISIONS.md: architecture decision records.

Formatting

- Use Markdown with fenced code blocks.
- Use mermaid for diagrams.
- When referencing files in the repo, include workspace-relative path links where possible.

Maintenance

- Update docs as part of PRs that change behavior.
- Major changes must include a short migration/upgrade guide.

Troubleshooting Guidance (examples)

- If scheduled ingestion fails: check VERCEL_CRON_TOKEN, ingestion logs, and WeatherAI throttling.
- If alerts are not triggering: inspect alert_rules.active, verify snapshots contain the metric, check alert evaluation logs and audit entries.
