# Data Refresh Checklist

Use this checklist for every scheduled or manual data refresh.

## Before Refresh

- Refresh reason is clear:
  - scheduled cadence
  - upstream release
  - bug fix
- manual override correction
- Source cadence and refresh mode are documented
- Publish mode is documented per critical dataset
- Required credentials or access prerequisites are available
- Current production dataset version is known
- Previous anomaly baseline is available
- Spot-check sample list is ready

## During Refresh

- Raw fetch completed without silent partial failure
- ETL completed successfully
- `data-manifest.json` updated with refresh metadata
- Validation script ran cleanly
- Coverage and match-rate diffs were reviewed
- Fallback usage did not spike unexpectedly
- Dataset version was bumped
- Previous dataset version was preserved
- Publish gate outcome is explicit: auto publish, hold, or block

## Manual Review

- At least one representative record per major page family was spot-checked
- Outliers were reviewed
- Any policy/legal-sensitive fields were rechecked if touched
- Audit log updated with findings and decision
- Override registry updated if any manual fix was added or removed

## Release Gate

- Approved for publishing
- Methodology or freshness copy updated if needed
- Sitemap freshness will reflect the new build
- Rollback path is known if the refresh regresses quality
