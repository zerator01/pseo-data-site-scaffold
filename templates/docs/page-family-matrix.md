# Page Family Matrix

Use this when the site is not just `city -> detail`.

Common family types:

- Hub pages
  - example: `/rankings`, `/states`, `/occupations`
- Main entity pages
  - example: `/city/[slug]`, `/school/[slug]`, `/occupation/[slug]`
- Secondary entity pages
  - example: `/state/[abbr]`, `/industry/[slug]`
- Cross pages
  - example: `/salary/[role]/[city]`, `/breed/[slug]/[city]`
- Ranking pages
  - example: `/rankings/best-overall`, `/rankings/highest-disposable-income`

Questions to answer before implementation:

1. What is the main entity?
2. Is there a secondary entity that deserves its own hub/detail page?
3. Do we need cross pages, or will they create too much thin content?
4. Which page family owns the strongest intent and should get the best internal links?
