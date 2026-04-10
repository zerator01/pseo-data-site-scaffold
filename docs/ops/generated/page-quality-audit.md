# Page Quality Audit

- Generated at: 2026-04-10T08:14:00.373Z
- Site: My Data Site
- Cities: 3
- Regions: 3
- Metric families: 3

## Framework Dimensions

1. `uniqueness`: does the page family say something that nearby pages do not?
2. `information_density`: does the page carry enough evidence, not just decorative modules?
3. `trust_clarity`: are methodology, boundaries, and estimate language clear?
4. `internal_navigation`: does the page create a meaningful next step?
5. `serp_intent_match`: does the template match a real search intent?
6. `indexing_control`: should this family be fully indexed, selectively indexed, or held back?

## Family Scorecard

| Family | Route | Candidates | Avg Score | Risk | Sample URL |
| --- | --- | ---: | ---: | --- | --- |
| `home` | `/` | 1 | 4.00 | low | `https://example.com/` |
| `entity_detail` | `/entities/[slug]` | 3 | 3.83 | medium | `https://example.com/entities/north-harbor/` |
| `category_hub` | `/categories/[slug]` | 3 | 3.67 | medium | `https://example.com/categories/port-city/` |
| `ranking_hub` | `/rankings/` | 1 | 4.17 | low | `https://example.com/rankings/` |
| `ranking_detail` | `/rankings/[family]` | 2 | 3.67 | medium | `https://example.com/rankings/representative/` |

## Family Findings

### home

- Sample URL: `https://example.com/`
- Risk: `low`
- Strongest signals: core navigation surface; brand and methodology entry point
- Risks: hero-only homepage; weak links into strongest page family
- Recommended actions:
  - Confirm the homepage routes users into the strongest ranking and detail surfaces.
  - Keep methodology and source-trust links visible above the fold or in the first scroll.

| Dimension | Score | Rationale |
| --- | ---: | --- |
| `uniqueness` | 4 | Home section order contains 6 modules. |
| `information_density` | 4 | Home exposes multiple navigation and comparison surfaces instead of a single hero block. |
| `trust_clarity` | 4 | Home is expected to route readers toward methodology, rankings, and representative examples. |
| `internal_navigation` | 4 | Navigation matrix and next-step modules should create obvious paths into page families. |
| `serp_intent_match` | 3 | Home usually serves broad brand and comparison intent, not a single long-tail need. |
| `indexing_control` | 5 | Home should always remain in the core indexed set. |

### entity_detail

- Sample URL: `https://example.com/entities/north-harbor/`
- Risk: `medium`
- Strongest signals: specific long-tail intent; metrics plus narrative; next-step navigation
- Risks: templated narrative drift; too many similar detail pages entering the sitemap at once
- Recommended actions:
  - Audit a representative sample of cities for uniqueness, trust wording, and next-step links.
  - Keep the indexed cities pool smaller than the total published cities surface.

| Dimension | Score | Rationale |
| --- | ---: | --- |
| `uniqueness` | 4 | 3/3 sample entities have summaries and 3/3 have FAQs. |
| `information_density` | 4 | 3/3 sample entities expose metrics plus a narrative summary. |
| `trust_clarity` | 4 | Entity pages are expected to pair metrics with explanation instead of standalone scores. |
| `internal_navigation` | 4 | Entity detail section order contains 5 modules. |
| `serp_intent_match` | 4 | City detail pages usually serve the strongest long-tail comparison intent. |
| `indexing_control` | 3 | Entity pages need selective sitemap entry and family-level quality review, not full-surface indexing by default. |

### category_hub

- Sample URL: `https://example.com/categories/port-city/`
- Risk: `medium`
- Strongest signals: comparison hub intent; cluster navigation
- Risks: weak framing copy; hub pages that only repeat entity cards
- Recommended actions:
  - Give each region hub a clear qualification rule and why-it-exists explanation.
  - Make sure the hub links to a small set of strongest city detail pages rather than every possible candidate.

| Dimension | Score | Rationale |
| --- | ---: | --- |
| `uniqueness` | 3 | Region hubs gain uniqueness mainly from the entity mix and framing copy. |
| `information_density` | 3 | Category hub section order contains 3 modules. |
| `trust_clarity` | 4 | Region hubs should explain what qualifies an entity for that grouping. |
| `internal_navigation` | 4 | Region hubs are natural bridge pages between overview surfaces and detail pages. |
| `serp_intent_match` | 4 | Region comparisons often align with list-style or cluster-search intent. |
| `indexing_control` | 4 | Region hubs can usually remain fully indexed if the hub count stays controlled. |

### ranking_hub

- Sample URL: `https://example.com/rankings/`
- Risk: `low`
- Strongest signals: strong intent; high navigation value; explains ranking families
- Risks: hub page that only lists links without framing; unclear representative vs full logic
- Recommended actions:
  - Keep methodology and ranking-family explanations visible near the top of the page.
  - Use the ranking hub as an internal-link authority surface for the strongest detail pages.

| Dimension | Score | Rationale |
| --- | ---: | --- |
| `uniqueness` | 4 | Ranking hub uniqueness comes from family labels, selection logic, and why each ranking exists. |
| `information_density` | 3 | Ranking hub section order contains 2 modules. |
| `trust_clarity` | 4 | Ranking hubs should explain representative vs full ordering and link to methodology. |
| `internal_navigation` | 5 | Ranking hubs are primary routing surfaces into detail and category pages. |
| `serp_intent_match` | 4 | Best/worst/comparison ranking intent is usually strong and legible. |
| `indexing_control` | 5 | Ranking hubs should always be in the core indexed surface. |

### ranking_detail

- Sample URL: `https://example.com/rankings/representative/`
- Risk: `medium`
- Strongest signals: specific list intent; good comparison surface
- Risks: thin ranking table with no rationale; duplicate ranking families with little differentiation
- Recommended actions:
  - Add clear framing about why the ranking exists and what it excludes.
  - Link ranking winners and notable outliers into the detail-page family.

| Dimension | Score | Rationale |
| --- | ---: | --- |
| `uniqueness` | 3 | Ranking detail pages need explanatory framing or they collapse into generic sorted tables. |
| `information_density` | 3 | Ranking detail section order contains 2 modules. |
| `trust_clarity` | 4 | Ranking details should make the ranking logic, exclusions, and tradeoffs explicit. |
| `internal_navigation` | 4 | Strong ranking pages should route readers into top detail pages and methodology. |
| `serp_intent_match` | 4 | Ranking detail pages often match specific list intent well. |
| `indexing_control` | 4 | A small set of ranking detail pages can usually remain fully indexed. |


## Backlog

1. [medium] `entity_detail` `/entities/[slug]` — Audit a representative sample of cities for uniqueness, trust wording, and next-step links.
2. [medium] `category_hub` `/categories/[slug]` — Give each region hub a clear qualification rule and why-it-exists explanation.
3. [medium] `ranking_detail` `/rankings/[family]` — Add clear framing about why the ranking exists and what it excludes.

## Recommended Usage

- Run this after major page-family changes or before widening the sitemap.
- Pair it with `docs/seo-signal-response-map.md` when Search Console signals start to move.
- Use `docs/checklists/page-family-audit-checklist.md` for manual sample-page review.

