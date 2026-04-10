# Incident Response SOP

Use this SOP when `{{PROJECT_NAME}}` has a data, indexing, or publish-quality incident.

## Incident Types

- Upstream source outage or malformed input
- Unexpected anomaly spike
- Large ranking churn without a justified methodology change
- Broken routing, sitemap, or robots output
- Editorial issue that creates false or overstated claims

## First Response

1. Stop automatic publishing for the affected refresh cycle.
2. Record the incident start time, trigger, and suspected blast radius.
3. Preserve the failing input, diff, or build output.
4. Decide whether the safest path is rollback, hotfix, or manual hold.

## Triage Questions

- Is the issue confined to one family, one source, or the whole site?
- Did the anomaly baseline catch it, or did it slip past the current gate?
- Does the issue require source replacement, code fix, or editorial correction?

## Recovery

- Roll back to the last known good publish if public quality is affected
- Patch source mappings, thresholds, or copy logic
- Re-run `npm run refresh:data`, `npm run validate:ops`, and `npm run build`
- Log what changed in `docs/data-audit-log.md`

## Follow-Up

- Update the relevant SOP if the incident exposed a missing control
- Add stable tasks to `docs/ops/automation-backlog.md` if the response was too manual
