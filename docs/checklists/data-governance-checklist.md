# Data Governance Checklist

Use this before promoting any dataset into page generation.

## Source Registry

- Every upstream dataset is listed with source URL, owner, cadence, and coverage
- License or usage constraints are recorded
- Raw source date and fetch date are both captured
- Manual overrides are stored separately from raw inputs
- Refresh mode is defined per source: automatic, manual, or hybrid
- Publish mode is defined per critical source: fully_automatic, semi_automatic, manual_review_required, or do_not_autopublish
- Max stale window is defined for each critical source
- Dataset version is recorded for every publishable build
- Previous dataset version is retained for comparison

## Field Definitions

- Every published field has a plain-English definition
- Units are explicit for every numeric field
- Derived fields list their formulas
- Fallback fields list their fallback order
- Estimate fields are explicitly marked as estimates

## Join Logic

- Primary keys are documented
- Crosswalk tables are versioned
- Known ambiguous joins are listed
- Match-rate or join-rate is measured after every build

## Validation

- Slug uniqueness is checked
- Null-rate checks exist for critical fields
- Numeric range checks exist for score and money fields
- Representative sample records are spot-checked manually
- Current build is compared against the previous build for anomaly detection
- Anomaly baseline exists for build-over-build comparison
- Spot-check sample set is defined, not improvised each time
- Manual override registry is current

## Publishing Gate

- Methodology matches actual data behavior
- UI labels do not overstate precision
- Freshness labels read from `data-manifest.json`
- Critical coverage gaps are listed in launch docs
- Dataset is approved for page generation
- Refresh policy exists and is current
- Rollback target is known for the current dataset version
