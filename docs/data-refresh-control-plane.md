# Data Refresh Control Plane

Use this lightweight control layer to coordinate human-in-the-loop data refreshes without introducing a full scheduler.

## Purpose

- Track which upstream sources exist
- Know when each source is due or overdue
- Generate a human-readable refresh queue
- Record refresh runs and review decisions

## Core Files

- `data/source-registry.json`: machine-readable source registry
- `docs/source-registry.md`: narrative source inventory and trust notes
- `docs/ops/generated/data-refresh-queue.json`: structured queue output
- `docs/ops/generated/data-refresh-queue.md`: operator-facing queue view
- `state/data-refresh-runs/`: refresh execution records
- `state/data-refresh-approvals/`: review and approval records

## Operating Rule

This layer is intentionally not a scheduler.

It should:

- tell the operator what needs refresh attention
- preserve review boundaries
- make refresh work auditable

It should not:

- auto-run refresh commands without an explicit operating decision
- auto-approve refreshed data for publish
- silently infer source freshness from page output alone

## Minimum Workflow

1. Update `data/source-registry.json` when a new source is added or its cadence changes.
2. Run `npm run ops:refresh-queue` to generate the current queue.
3. Perform the required manual or semi-manual refresh work.
4. Record the run under `state/data-refresh-runs/`.
5. Review the resulting data and record the decision under `state/data-refresh-approvals/`.
6. Only then treat the refresh as ready for publish gating.
