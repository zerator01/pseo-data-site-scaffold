# Operations Automation Backlog

Use this document to separate safe automation candidates from tasks that still require human judgement for `My Data Site`.

## Automate First

- Scheduled refresh execution
- Validation and anomaly digest generation
- Publish-gate result summaries
- Spot-check sample generation
- Weekly ops summary drafts

## Human Review Required

- Source trust decisions
- Threshold changes that affect ranking narratives
- EEAT and methodology wording changes
- Index/noindex decisions for borderline page families

## Candidate Systems

- Repo-local scripts in `scripts/`
- GitHub Actions for verification and scheduled refreshes
- External orchestrators such as OpenClaw if you need multi-step task routing, notifications, or approvals

## Backlog Table

| Task | Manual Cost | Risk If Automated Wrong | Suggested System | Status |
| --- | --- | --- | --- | --- |
| Detect visible page-narrative diffs after refresh | Medium | Medium | Repo script plus GitHub Actions artifact | Proposed |
| Generate refresh digest | Medium | Low | GitHub Actions or OpenClaw | Proposed |
| Create QA sampling queue | Low | Low | Repo script | In Place |
| Draft weekly ops report | Medium | Low | OpenClaw or external workflow | Proposed |
| Approve publish to production | Low | High | Human gate only | Keep Manual |

## Current Recommendation

- Prioritize a script that compares the rendered or processed entity-page narrative fields after `refresh:data`.
- Flag changes to `summary`, visible FAQ content, and top comparison links so the manual publish gate reviews concrete diffs instead of re-reading pages from scratch.
- Keep final publish approval manual even after this automation lands.

## Rule

- Do not automate judgment-heavy decisions until the SOP path is stable for at least a few runs.
