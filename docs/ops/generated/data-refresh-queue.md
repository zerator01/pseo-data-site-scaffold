# Data Refresh Queue

- Generated at: 2026-04-14T01:01:50.406Z
- Total sources: 2
- Overdue: 0
- Due soon: 0
- Blocked: 0
- Review needed: 1

| Source | Dataset | Status | Mode | Due | Last refresh | Owner | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Editorial overrides | `editorial_overrides` | review_needed | manual | n/a | 2026-04-10 | repo maintainer | Update when overrides change or when a publish decision needs fresh human review. |
| Core sample dataset | `core_sample_dataset` | fresh | semi_manual | 2026-05-10 | 2026-04-10 | repo maintainer | Replace with a real upstream fetch path before launch. |

## Operator Use

- Work overdue and due sources first.
- Treat `blocked` and `review_needed` as human-decision states, not silent automation retries.
- After a manual refresh, update `data/source-registry.json` and record the run under `state/data-refresh-runs/`.
- After review, record the decision under `state/data-refresh-approvals/` before treating the refresh as publish-ready.
