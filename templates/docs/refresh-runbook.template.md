# Refresh Runbook

Use this runbook when executing a data update.

## Inputs

- Trigger:
- Dataset(s):
- Expected impact:

## Commands

```bash
npm run fetch:sample
npm run transform:sample
npm run rebuild:baseline
npm run validate:ops
```

## Checks

- Compare row counts
- Compare score distribution
- Compare category distribution
- Compare representative sample records
- Confirm `data/raw/` snapshot date matches `data/data-manifest.json`

## Decision

- Ship
- Hold
- Roll back

## Notes

- Anything unusual:
- Methodology changes required:
- UI copy changes required:
