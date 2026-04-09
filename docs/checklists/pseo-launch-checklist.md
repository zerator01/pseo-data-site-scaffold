# pSEO Launch Checklist

## Data

- Primary entity key defined
- Crosswalk/join strategy defined
- Fallback layers documented
- Known estimates marked as estimates
- `data-manifest.json` present and wired
- Lightweight index file present for build-time routing
- Lazy-load access layer considered if datasets are too large for direct import
- Validation script exists and is runnable
- Site blueprint written and current
- Blueprint scale matches real data coverage, not aspirational future scope
- Source registry written
- Metric spec written for public scores and key fields
- Data audit log written for the current build

## Pages

- Home page
- Hub/directory pages
- Detail pages
- Ranking pages
- Methodology / About / Privacy
- Page family defined: main entity / secondary entity / cross page if applicable
- Home navigation matrix defined
- Anti-orphan hub path defined for long-tail detail pages
- No core navigation entry points to a placeholder or `ComingSoon` page
- Tools, rankings, and hub links only appear when target pages and data actually exist

## Trust

- Independent publisher wording
- Contact / corrections path
- Methodology explains estimates and limitations
- No “only truth”, “100% objective”, or equivalent overclaims

## SEO

- Core pages in sitemap
- Long-tail pages tiered
- Metadata and schema aligned with page content
- Schema generator layer exists if multiple dynamic templates need JSON-LD
- Hub pages included as crawl-entry surfaces, not just detail pages

## UX

- Search works
- Display names cleaned
- Long lists are progressive, not dumped all at once

## Conversion

- Ranking -> detail/state path
- Detail -> ranking/breed/category path
- Hub -> strong first-click path

## Final

- validation script run cleanly
- `npm run lint`
- `npm run build`
- performance audit baseline captured
- docs updated
- Default template README replaced with project-specific operating docs
