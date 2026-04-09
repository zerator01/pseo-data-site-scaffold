# Data Refresh Policy

Define how this project updates data before launch.

## Refresh Modes

| Dataset | Refresh mode | Publish mode | Cadence | Trigger | Notes |
| --- | --- | --- | --- | --- | --- |
| Core sample dataset | hybrid | semi_automatic | monthly | scheduler or maintainer run | Fetch into `data/raw/source-sample.json`, then transform into processed entities. |
| Secondary editorial inputs | manual | manual_review_required | on-release | methodology or copy changes | Update copy, overrides, and source notes alongside data refresh. |

Refresh mode values:
- `automatic`: scheduled workflow pulls and rebuilds on a fixed cadence
- `manual`: human-triggered refresh after source review
- `hybrid`: scheduled check plus manual approval before publish

Publish mode values:
- `fully_automatic`: refresh and publish can complete without human approval
- `semi_automatic`: refresh can run automatically but publish is held pending review
- `manual_review_required`: a human must explicitly review before publishing
- `do_not_autopublish`: data may be collected or transformed, but must never publish automatically

## Source Rules

| Dataset | Expected upstream cadence | Max stale window | Owner |
| --- | --- | --- | --- |
| Core sample dataset | monthly | 45 days | repo maintainer |
| Editorial overrides | ad hoc | 14 days | repo maintainer |

## Approval Rules

- Automatic publish allowed for:
- Semi-automatic publish allowed for: low-risk source refreshes with clean validation and anomaly results
- Manual approval required for: any refresh that changes page narratives, override registry, or methodology text
- Never auto-publish:
- Always spot-check these fields: slug, score, population, categoryLabel, summary
- Always review these page families: home, representative rankings, top entity details, default hub

## Failure Rules

- If fetch fails:
- If validation fails: stop publish, fix transform assumptions, rerun `npm run refresh:data`
- If coverage drops: investigate raw snapshot and update source registry before publish
- If fallback usage spikes: document override or methodology change before release

## Rollback

- Last known good dataset location:
- Rollback operator: repo maintainer
- Rollback command or process: restore `data/processed/`, `data/governance/anomaly-baseline.json`, and `data/data-manifest.json` from last known good commit
