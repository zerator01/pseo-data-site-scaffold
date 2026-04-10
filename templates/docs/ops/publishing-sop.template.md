# Publishing SOP

This SOP defines how `{{PROJECT_NAME}}` moves from refreshed data to public release.

## Trigger Events

- Scheduled data refresh
- Source methodology change
- Editorial correction
- Large anomaly or ranking churn

## Inputs

- Fresh processed data in `data/processed/`
- Current anomaly baseline and override registry
- Latest narrative diff in `docs/ops/generated/page-narrative-diff.md`
- Latest notes in `docs/data-audit-log.md`
- Spot-check samples for representative pages

## Steps

1. Run `npm run refresh:data`.
2. Review `npm run validate:ops` output and confirm whether the publish gate is automatic or manual-review-only.
3. Review `docs/ops/generated/page-narrative-diff.md` for changes to summaries, visible FAQ content, or top comparison links.
4. Sample representative pages across top, middle, and edge-case entities.
5. Confirm metadata, on-page summaries, next-step navigation, and schema output still make sense.
6. Record any decisions, holds, or overrides in `docs/data-audit-log.md`.
7. Publish only after manual approval when gate output says `hold_for_review`.

## Manual Review Checklist

- No unsupported claims were introduced by data or copy changes
- Narrative diff output does not show unexpected trust or methodology-adjacent copy drift
- Top-ranked pages still reflect the intended story, not raw noise
- Category hubs and rankings still point users into useful next steps
- Thin, duplicate, or orphan-prone pages are not being expanded blindly

## Rollback Rule

- If refresh output is technically valid but page quality regresses, roll back the publish and open a remediation task before the next run.
