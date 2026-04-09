# Data Access Notes

For larger pSEO sites, split data access into two layers:

- Full detail dataset:
  Used by detail pages and calculations.

- Lightweight index dataset:
  Used by `generateStaticParams`, sitemap generation, and lightweight lookups.

Recommended pattern:

- `data/processed/entities.json`
- `data/processed/entity-index.json`
- `src/lib/data/entities.ts`

Do not make every build-time routing path scan the full detail payload if a smaller index can answer the question.
