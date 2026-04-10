# Weekly Ops Replan Brief

- Generated at: 2026-04-10T06:56:34.274Z
- Purpose: package the current cycle into a model-ready replanning brief

## Replan Signals

- Carry forward candidates: 0
- Re-scope candidates: 0
- Drop candidates: 0

## Compact Context Sent To LLM

### Summary Headlines

- Generated at: 2026-04-10T06:03:02.878Z
- Dataset version: `2026.04.10.6`
- Last refresh: `2026-04-09T17:52:22.016Z`
- Refresh cadence: `monthly`
- Publish mode: `semi_automatic`
- Entity count: 3 (+0)
- Active overrides: 1 (+0)
- Pending override reviews: 0

### Review Headlines

- Generated at: 2026-04-10T06:03:03.482Z
- Planned task count: 5
- Completed planned tasks: 0
- Completion rate: 0%
- No planned tasks marked complete yet.
- No tasks are currently marked blocked.
- No tasks have been explicitly carried forward yet.
- `refresh_core_data` Refresh core data and review anomaly output
- `review_qa_sampling_queue` Review the QA sampling queue with focus on North Harbor
- `decide_publish_gate_mode` Decide whether the current publish gate should stay manual-review-only

### Decision Inputs

- `refresh_core_data`: action=keep; status=planned; due=2026-04-11; executor=human:zerator; rationale=Still planned with no strong execution signal. Re-validate before carrying forward unchanged.
- `review_qa_sampling_queue`: action=keep; status=planned; due=2026-04-12; executor=agent:openclaw; rationale=Still planned with no strong execution signal. Re-validate before carrying forward unchanged.
- `decide_publish_gate_mode`: action=keep; status=planned; due=2026-04-13; executor=human:zerator; rationale=Still planned with no strong execution signal. Re-validate before carrying forward unchanged.
- `audit_representative_pages`: action=keep; status=planned; due=2026-04-14; executor=agent:openclaw; rationale=Still planned with no strong execution signal. Re-validate before carrying forward unchanged.
- `update_automation_backlog`: action=keep; status=planned; due=2026-04-15; executor=human:zerator; rationale=Still planned with no strong execution signal. Re-validate before carrying forward unchanged.

## LLM Replan Prompt

```text
You are replanning the next weekly operations cycle for a solo operator who may delegate execution to agents.

Use only the structured inputs below. Do not assume missing history.

Rules:
- Keep owner as `zerator` unless there is a compelling reason to change it.
- Use `executor_type` values `human`, `agent`, or `system`.
- Prefer `executor_id: openclaw` for analysis-heavy tasks and `executor_id: zerator` for operator decisions.
- Do not silently re-add dropped work.
- Re-scope blocked work instead of copying it unchanged.
- Return at most 5 tasks for the next weekly plan.

Summary headlines:
- Generated at: 2026-04-10T06:03:02.878Z
- Dataset version: `2026.04.10.6`
- Last refresh: `2026-04-09T17:52:22.016Z`
- Refresh cadence: `monthly`
- Publish mode: `semi_automatic`
- Entity count: 3 (+0)
- Active overrides: 1 (+0)
- Pending override reviews: 0

Review headlines:
- Generated at: 2026-04-10T06:03:03.482Z
- Planned task count: 5
- Completed planned tasks: 0
- Completion rate: 0%
- No planned tasks marked complete yet.
- No tasks are currently marked blocked.
- No tasks have been explicitly carried forward yet.
- `refresh_core_data` Refresh core data and review anomaly output
- `review_qa_sampling_queue` Review the QA sampling queue with focus on North Harbor
- `decide_publish_gate_mode` Decide whether the current publish gate should stay manual-review-only

Decision inputs:
- refresh_core_data: action=keep; status=planned; due=2026-04-11; executor=human:zerator; rationale=Still planned with no strong execution signal. Re-validate before carrying forward unchanged.
- review_qa_sampling_queue: action=keep; status=planned; due=2026-04-12; executor=agent:openclaw; rationale=Still planned with no strong execution signal. Re-validate before carrying forward unchanged.
- decide_publish_gate_mode: action=keep; status=planned; due=2026-04-13; executor=human:zerator; rationale=Still planned with no strong execution signal. Re-validate before carrying forward unchanged.
- audit_representative_pages: action=keep; status=planned; due=2026-04-14; executor=agent:openclaw; rationale=Still planned with no strong execution signal. Re-validate before carrying forward unchanged.
- update_automation_backlog: action=keep; status=planned; due=2026-04-15; executor=human:zerator; rationale=Still planned with no strong execution signal. Re-validate before carrying forward unchanged.

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

