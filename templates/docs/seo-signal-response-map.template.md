# SEO Signal Response Map

Use this document to translate Search Console and crawl signals into concrete product or code actions.

## Primary Mapping

| Signal | First Interpretation | First Actions |
| --- | --- | --- |
| `Crawled - currently not indexed` | Page family is accessible, but value/selection is not convincing enough yet | Check one family at a time. Shrink sitemap to strongest URLs. Increase page differentiation before expanding again. |
| `Discovered - currently not indexed` | Google knows the URL exists but crawl priority is weak | Improve internal links, sitemap inclusion, and crawl paths from stronger hubs. |
| `Duplicate without user-selected canonical` | Multiple URLs look too similar or canonicals are unclear | Audit canonical logic, redirects, alternate routes, and near-duplicate page families. |
| `Soft 404` | Page exists technically but looks empty or not worth indexing | Strengthen content density, remove weak pages from sitemap, or intentionally deindex thin surfaces. |
| `Blocked by robots.txt` | Configuration issue or intentional exclusion | Confirm whether the family should be crawlable. If not intentional, fix the rule before further QA. |
| `Page with redirect` | URL normalization or legacy route issue | Check whether the redirected URL still appears in the sitemap or internal links. |

## Family-Level Triage Order

1. Confirm there is no `noindex`, `robots`, redirect, or canonical mistake.
2. Check whether the signal clusters in a single page family.
3. Audit the strongest page and the weakest page in that family.
4. Decide whether the family needs:
   - copy differentiation
   - trust clarification
   - sitemap reduction
   - stronger internal links
   - explicit canonical cleanup

## Anti-Pattern

Do not answer weak indexing signals by immediately submitting more URLs.

First ask:

- Are we feeding too many pages from the same family?
- Are the pages too similar below the hero section?
- Is the page useful only at the top of the ranking, but weak in the middle and tail?
- Are we asking Google to index pages before we have a clear reason they should rank?

## Operating Rule

For pSEO sites, indexing is a product decision, not just a crawl decision.

That means every SEO signal should map to:

- a template-level decision
- a sitemap-level decision
- an internal-linking decision
- and only then, a search-console resubmission step
