# Page Quality Audit Framework

Use this framework when the site is crawlable but page families may still be too weak, too repetitive, or too poorly selected for indexing.

## Scoring Dimensions

Score each dimension from `1` to `5`.

### 1. Uniqueness

- `1`: mostly variable-swapped copy
- `3`: some page-specific explanation, but a strong template feel remains
- `5`: page family consistently adds differentiated, non-trivial context

### 2. Information Density

- `1`: decorative blocks or a thin table only
- `3`: some useful facts, but not enough to justify indexing at scale
- `5`: enough evidence, explanation, and comparison context to stand on its own

### 3. Trust Clarity

- `1`: claims are stronger than the evidence
- `3`: partial source or methodology explanation
- `5`: methodology, boundaries, estimate language, and caveats are obvious

### 4. Internal Navigation

- `1`: dead end
- `3`: one or two generic links
- `5`: clear next-step path into the strongest adjacent page family

### 5. SERP Intent Match

- `1`: page does not clearly map to a search need
- `3`: broad or ambiguous intent
- `5`: page family matches a specific comparison, ranking, or entity intent

### 6. Indexing Control

- `1`: page family is being exposed too widely with little review
- `3`: partial gating exists, but the selection logic is weak
- `5`: indexing surface is intentionally selected and easy to explain

## Review Sequence

1. Audit one high-confidence page in the family.
2. Audit one representative mid-tier page.
3. Audit one weak or edge-case page.
4. Compare whether the family still feels useful at the bottom, not just the top.
5. Decide whether the family should be:
   - fully indexed
   - selectively indexed
   - published but held out of the sitemap

## Minimum Outputs

Every audit pass should produce:

- a scorecard by page family
- a short family risk summary
- a concrete backlog of the next 3 to 5 page-quality fixes

## Warning Signs

- Search Console shows `Crawled - currently not indexed` concentrated in one page family.
- Strong pages are mixed into the sitemap with many weak siblings.
- Page narratives sound right but could be swapped between URLs with only minor edits.
- Templates expose scores or rankings without explaining tradeoffs or limitations.
- Pages do not create a meaningful next comparison path.
