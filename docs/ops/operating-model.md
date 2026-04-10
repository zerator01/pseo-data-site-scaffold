# Operations Operating Model

Use this document to define how `My Data Site` runs after launch.

## Objectives

- Keep core data and page families fresh without shipping silent regressions
- Maintain a visible review queue for pages, data anomalies, and refresh failures
- Separate mechanical operations from editorial judgement

## Weekly Cadence

- `Monday`: review search, traffic, and indexing deltas
- `Tuesday`: refresh source inventory and data quality backlog
- `Wednesday`: review representative pages and thin-page candidates
- `Thursday`: ship approved refreshes and backlog fixes
- `Friday`: publish weekly ops summary and incident notes

## Roles

- `Operator`: runs refreshes, checks gates, and records incidents
- `Editor`: reviews messaging, EEAT claims, and page quality issues
- `Owner`: approves major publish decisions, schema shifts, and source changes

## Core Artifacts

- `docs/source-registry.md`: source inventory and trust boundaries
- `docs/data-refresh-policy.md`: refresh rhythm and escalation rules
- `docs/refresh-runbook.md`: command-level runbook
- `docs/ops/publishing-sop.md`: release decision path
- `docs/ops/quality-review-sop.md`: page QA and sampling rules
- `docs/ops/incident-response-sop.md`: anomaly and rollback handling
- `docs/ops/automation-backlog.md`: what should be automated next

## Decision Gates

- Refresh only if source freshness, override checks, and anomaly checks pass
- Publish only if representative pages have human-readable summaries and next-step navigation
- Escalate when source methodology changes, top pages churn sharply, or confidence drops

## Notes

- Keep this file short. Put detailed procedures in the SOP documents under `docs/ops/`.
