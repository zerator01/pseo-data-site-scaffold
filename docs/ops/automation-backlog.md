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
| Generate refresh digest | Medium | Low | GitHub Actions or OpenClaw | Proposed |
| Create QA sampling queue | Medium | Low | Repo script | Proposed |
| Draft weekly ops report | Medium | Low | OpenClaw or external workflow | Proposed |
| Approve publish to production | Low | High | Human gate only | Keep Manual |

## Rule

- Do not automate judgment-heavy decisions until the SOP path is stable for at least a few runs.
