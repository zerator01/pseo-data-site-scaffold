# Weekly Ops Replan Brief

- Generated at: 2026-04-10T06:03:04.029Z
- Purpose: package the current cycle into a model-ready replanning brief

## Replan Signals

- Carry forward candidates: 0
- Re-scope candidates: 0
- Drop candidates: 0

## Task Decisions

| Task ID | Latest Status | Recommended Action | Executor | Due | Carry Forward Reason |
| --- | --- | --- | --- | --- | --- |
| `refresh_core_data` | planned | keep | human:zerator | 2026-04-11 |  |
| `review_qa_sampling_queue` | planned | keep | agent:openclaw | 2026-04-12 |  |
| `decide_publish_gate_mode` | planned | keep | human:zerator | 2026-04-13 |  |
| `audit_representative_pages` | planned | keep | agent:openclaw | 2026-04-14 |  |
| `update_automation_backlog` | planned | keep | human:zerator | 2026-04-15 |  |

## Operator Notes

- `refresh_core_data`: Task is still planned but lacks a strong execution signal. Re-validate priority before carrying it forward unchanged.
- `review_qa_sampling_queue`: Task is still planned but lacks a strong execution signal. Re-validate priority before carrying it forward unchanged.
- `decide_publish_gate_mode`: Task is still planned but lacks a strong execution signal. Re-validate priority before carrying it forward unchanged.
- `audit_representative_pages`: Task is still planned but lacks a strong execution signal. Re-validate priority before carrying it forward unchanged.
- `update_automation_backlog`: Task is still planned but lacks a strong execution signal. Re-validate priority before carrying it forward unchanged.

## Inputs Included

- `docs/ops/generated/weekly-ops-summary.md`
- `docs/ops/generated/weekly-ops-review.md`
- `docs/ops/generated/weekly-ops-plan.json`
- `docs/ops/ops-execution-log.md`

## LLM Replan Prompt

```text
You are replanning the next weekly operations cycle for a solo operator who may delegate execution to agents.

Use only the inputs in this packet.

Rules:
- Keep owner as `zerator` unless there is a compelling reason to change it.
- Use `executor_type` values `human`, `agent`, or `system`.
- Prefer `executor_id: openclaw` for analysis-heavy tasks and `executor_id: zerator` for operator decisions.
- Do not silently re-add dropped work.
- Re-scope blocked work instead of copying it unchanged.
- Only carry unfinished tasks forward when the rationale still matches the current summary and review.
- Return at most 5 tasks for the next weekly plan.

Current weekly summary:
# Weekly Ops Summary

- Generated at: 2026-04-10T06:03:02.878Z
- Dataset version: `2026.04.10.6`
- Last refresh: `2026-04-09T17:52:22.016Z`
- Refresh cadence: `monthly`
- Publish mode: `semi_automatic`

## What Changed Since Last Snapshot

- Entity count: 3 (+0)
- Active overrides: 1 (+0)
- Pending override reviews: 0
- Top entity changed: no

## Top-Line Watchlist

1. North Harbor (`north-harbor`) score 88
2. Mesa Grove (`mesa-grove`) score 81
3. Riverbend (`riverbend`) score 76

## Suggested Operator Actions

- Review the latest refresh digest in `docs/ops/generated/refresh-digest.md`
- Work through the QA queue in `docs/ops/generated/qa-sampling-queue.md`
- Record publish or hold decisions in `docs/data-audit-log.md`

Current weekly review:
# Weekly Ops Review

- Generated at: 2026-04-10T06:03:03.482Z
- Planned task count: 5
- Completed planned tasks: 0
- Completion rate: 0%

## Completed

- No planned tasks marked complete yet.

## Blocked

- No tasks are currently marked blocked.

## Carried Forward

- No tasks have been explicitly carried forward yet.

## Still Open

- `refresh_core_data` Refresh core data and review anomaly output
- `review_qa_sampling_queue` Review the QA sampling queue with focus on North Harbor
- `decide_publish_gate_mode` Decide whether the current publish gate should stay manual-review-only
- `audit_representative_pages` Audit one high-confidence page (North Harbor) and one edge-case page (Riverbend)
- `update_automation_backlog` Update the ops automation backlog with one candidate to automate next

## Extra Completed Work

- No extra completed tasks recorded outside the plan.

## Next-Cycle Prompt

- Carry open tasks forward only when the rationale is still valid.
- Mark dropped work explicitly instead of silently deleting it.
- Use `carry_forward_reason` to explain why a task survives into the next cycle.

Replan decisions:
- refresh_core_data: keep | Task is still planned but lacks a strong execution signal. Re-validate priority before carrying it forward unchanged.
- review_qa_sampling_queue: keep | Task is still planned but lacks a strong execution signal. Re-validate priority before carrying it forward unchanged.
- decide_publish_gate_mode: keep | Task is still planned but lacks a strong execution signal. Re-validate priority before carrying it forward unchanged.
- audit_representative_pages: keep | Task is still planned but lacks a strong execution signal. Re-validate priority before carrying it forward unchanged.
- update_automation_backlog: keep | Task is still planned but lacks a strong execution signal. Re-validate priority before carrying it forward unchanged.

Return JSON in this shape:
{
  "focus": ["...", "..."],
  "tasks": [
    {
      "id": "task_id",
      "title": "Task title",
      "owner": "zerator",
      "executor_type": "human|agent|system",
      "executor_id": "zerator|openclaw|github_actions",
      "status": "planned",
      "due": "YYYY-MM-DD",
      "carry_forward_reason": null,
      "source": "ops_replan"
    }
  ],
  "planning_notes": ["...", "..."]
}
```

