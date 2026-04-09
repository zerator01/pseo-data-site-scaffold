# Scaffold Config Reference

Use `scaffold.config.json` as the single source of truth for starter identity, route families, ranking families, metric families, and section order.

## Identity

- `projectName`: package name written into `package.json`
- `siteName`: display name used in metadata and layout
- `siteUrl`: canonical base URL for sitemap, schema, and robots
- `siteDescription`: default metadata description
- `siteTagline`: short header tagline
- `heroTitle`: homepage hero heading
- `heroDescription`: homepage hero supporting copy

## Page Families

- `entitySingular`, `entityPlural`: labels for the primary detail family
- `entityDirectoryLabel`: label for the entity directory surface
- `entityRouteBase`: route segment for the primary detail family, for example `cities`
- `categorySingular`, `categoryPlural`: labels for hub families
- `categoryRouteBase`: route segment for hub family pages
- `defaultCategoryHubLabel`: home-page default hub card label
- `defaultCategoryHubSlug`: default hub route slug

## Rankings

- `representativeRankingLabel`
- `representativeRankingDescription`
- `fullRankingLabel`
- `fullRankingDescription`

These values drive the ranking hub cards, ranking detail metadata, and helper exports in `src/lib/site.ts`.

## Metrics

- `metricFamilies`: ordered list of starter metrics rendered on detail pages

Each metric family entry supports:

- `key`: raw/processed dataset key, for example `cost_index`
- `label`: display label rendered on detail pages

## Section Ordering

- `homeSectionOrder`
- `entityDetailSectionOrder`
- `categoryHubSectionOrder`
- `rankingHubSectionOrder`
- `rankingDetailSectionOrder`

These arrays control the render order of major sections via `src/lib/page-sections.ts`.

## Regeneration Workflow

After changing config:

```bash
npm run init:project
npm run refresh:data
npm run validate:ops
npm run build
```

## Notes

- `init:project` rewrites generated files. Treat `src/lib/site.ts`, generated docs, and starter sample data as derived outputs.
- Route bases affect helper URLs immediately, but existing legacy compatibility routes may remain in the repo intentionally.
- Section order only changes layout order. It does not automatically create new section types; those still live in `src/lib/page-sections.ts`.
