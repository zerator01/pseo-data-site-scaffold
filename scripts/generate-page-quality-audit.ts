import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const CONFIG_PATH = path.join(ROOT, 'scaffold.config.json');
const ENTITIES_PATH = path.join(ROOT, 'data', 'processed', 'entities.json');
const OUTPUT_MD_PATH = path.join(ROOT, 'docs', 'ops', 'generated', 'page-quality-audit.md');
const OUTPUT_JSON_PATH = path.join(ROOT, 'docs', 'ops', 'generated', 'page-quality-audit.json');

interface MetricFamily {
  key: string;
  label: string;
}

interface ConfigFile {
  siteName: string;
  siteUrl: string;
  entitySingular: string;
  entityPlural: string;
  entityRouteBase: string;
  categorySingular: string;
  categoryPlural: string;
  categoryRouteBase: string;
  defaultCategoryHubSlug: string;
  representativeRankingLabel: string;
  fullRankingLabel: string;
  metricFamilies: MetricFamily[];
  homeSectionOrder: string[];
  entityDetailSectionOrder: string[];
  categoryHubSectionOrder: string[];
  rankingHubSectionOrder: string[];
  rankingDetailSectionOrder: string[];
}

interface EntityRecord {
  slug: string;
  name: string;
  category: string;
  score: number;
  summary?: string;
  faq?: Array<{ question: string; answer: string }>;
  metrics?: Record<string, number>;
}

interface DimensionScore {
  score: number;
  rationale: string;
}

interface FamilyAudit {
  family: string;
  routePattern: string;
  sampleUrl: string;
  candidateCount: number;
  dimensions: Record<string, DimensionScore>;
  averageScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  strongestSignals: string[];
  risks: string[];
  recommendedActions: string[];
}

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
}

function ensureDir(filePath: string) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function scoreFromSectionCount(sectionCount: number, strong = 5, medium = 3) {
  if (sectionCount >= strong) return 4;
  if (sectionCount >= medium) return 3;
  return 2;
}

function averageScore(dimensions: Record<string, DimensionScore>) {
  const values = Object.values(dimensions).map((dimension) => dimension.score);
  return Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(2));
}

function riskFromAverage(score: number): 'low' | 'medium' | 'high' {
  if (score >= 4) return 'low';
  if (score >= 3) return 'medium';
  return 'high';
}

function createFamilyAudit(input: Omit<FamilyAudit, 'averageScore' | 'riskLevel'>): FamilyAudit {
  const average = averageScore(input.dimensions);
  return {
    ...input,
    averageScore: average,
    riskLevel: riskFromAverage(average),
  };
}

function topEntity(entities: EntityRecord[]) {
  return [...entities].sort((left, right) => right.score - left.score)[0];
}

function countDistinctCategories(entities: EntityRecord[]) {
  return new Set(entities.map((entity) => entity.category)).size;
}

function main() {
  const config = readJson<ConfigFile>(CONFIG_PATH);
  const entities = readJson<EntityRecord[]>(ENTITIES_PATH);
  const topSampleEntity = topEntity(entities);
  const categoryCount = countDistinctCategories(entities);
  const faqCoverage = entities.filter((entity) => (entity.faq?.length ?? 0) > 0).length;
  const summaryCoverage = entities.filter((entity) => Boolean(entity.summary?.trim())).length;
  const metricCoverage = entities.filter((entity) => Object.keys(entity.metrics ?? {}).length > 0).length;
  const baseUrl = config.siteUrl.replace(/\/$/, '');
  const entitySampleUrl = topSampleEntity
    ? `${baseUrl}/${config.entityRouteBase}/${topSampleEntity.slug}/`
    : `${baseUrl}/${config.entityRouteBase}/sample/`;
  const categorySampleUrl = `${baseUrl}/${config.categoryRouteBase}/${config.defaultCategoryHubSlug}/`;

  const families: FamilyAudit[] = [
    createFamilyAudit({
      family: 'home',
      routePattern: '/',
      sampleUrl: `${baseUrl}/`,
      candidateCount: 1,
      dimensions: {
        uniqueness: {
          score: scoreFromSectionCount(config.homeSectionOrder.length, 6, 4),
          rationale: `Home section order contains ${config.homeSectionOrder.length} modules.`,
        },
        information_density: {
          score: scoreFromSectionCount(config.homeSectionOrder.length, 6, 4),
          rationale: 'Home exposes multiple navigation and comparison surfaces instead of a single hero block.',
        },
        trust_clarity: {
          score: 4,
          rationale: 'Home is expected to route readers toward methodology, rankings, and representative examples.',
        },
        internal_navigation: {
          score: 4,
          rationale: 'Navigation matrix and next-step modules should create obvious paths into page families.',
        },
        serp_intent_match: {
          score: 3,
          rationale: 'Home usually serves broad brand and comparison intent, not a single long-tail need.',
        },
        indexing_control: {
          score: 5,
          rationale: 'Home should always remain in the core indexed set.',
        },
      },
      strongestSignals: ['core navigation surface', 'brand and methodology entry point'],
      risks: ['hero-only homepage', 'weak links into strongest page family'],
      recommendedActions: [
        'Confirm the homepage routes users into the strongest ranking and detail surfaces.',
        'Keep methodology and source-trust links visible above the fold or in the first scroll.',
      ],
    }),
    createFamilyAudit({
      family: 'entity_detail',
      routePattern: `/${config.entityRouteBase}/[slug]`,
      sampleUrl: entitySampleUrl,
      candidateCount: entities.length,
      dimensions: {
        uniqueness: {
          score: summaryCoverage === entities.length && faqCoverage === entities.length ? 4 : 3,
          rationale: `${summaryCoverage}/${entities.length} sample entities have summaries and ${faqCoverage}/${entities.length} have FAQs.`,
        },
        information_density: {
          score: metricCoverage === entities.length ? 4 : 3,
          rationale: `${metricCoverage}/${entities.length} sample entities expose metrics plus a narrative summary.`,
        },
        trust_clarity: {
          score: 4,
          rationale: 'Entity pages are expected to pair metrics with explanation instead of standalone scores.',
        },
        internal_navigation: {
          score: scoreFromSectionCount(config.entityDetailSectionOrder.length, 5, 4),
          rationale: `Entity detail section order contains ${config.entityDetailSectionOrder.length} modules.`,
        },
        serp_intent_match: {
          score: 4,
          rationale: `${config.entitySingular} detail pages usually serve the strongest long-tail comparison intent.`,
        },
        indexing_control: {
          score: 3,
          rationale: 'Entity pages need selective sitemap entry and family-level quality review, not full-surface indexing by default.',
        },
      },
      strongestSignals: ['specific long-tail intent', 'metrics plus narrative', 'next-step navigation'],
      risks: ['templated narrative drift', 'too many similar detail pages entering the sitemap at once'],
      recommendedActions: [
        `Audit a representative sample of ${config.entityPlural.toLowerCase()} for uniqueness, trust wording, and next-step links.`,
        `Keep the indexed ${config.entityPlural.toLowerCase()} pool smaller than the total published ${config.entityPlural.toLowerCase()} surface.`,
      ],
    }),
    createFamilyAudit({
      family: 'category_hub',
      routePattern: `/${config.categoryRouteBase}/[slug]`,
      sampleUrl: categorySampleUrl,
      candidateCount: categoryCount,
      dimensions: {
        uniqueness: {
          score: 3,
          rationale: `${config.categorySingular} hubs gain uniqueness mainly from the entity mix and framing copy.`,
        },
        information_density: {
          score: scoreFromSectionCount(config.categoryHubSectionOrder.length, 4, 3),
          rationale: `Category hub section order contains ${config.categoryHubSectionOrder.length} modules.`,
        },
        trust_clarity: {
          score: 4,
          rationale: `${config.categorySingular} hubs should explain what qualifies an entity for that grouping.`,
        },
        internal_navigation: {
          score: 4,
          rationale: `${config.categorySingular} hubs are natural bridge pages between overview surfaces and detail pages.`,
        },
        serp_intent_match: {
          score: 4,
          rationale: `${config.categorySingular} comparisons often align with list-style or cluster-search intent.`,
        },
        indexing_control: {
          score: 4,
          rationale: `${config.categorySingular} hubs can usually remain fully indexed if the hub count stays controlled.`,
        },
      },
      strongestSignals: ['comparison hub intent', 'cluster navigation'],
      risks: ['weak framing copy', 'hub pages that only repeat entity cards'],
      recommendedActions: [
        `Give each ${config.categorySingular.toLowerCase()} hub a clear qualification rule and why-it-exists explanation.`,
        `Make sure the hub links to a small set of strongest ${config.entitySingular.toLowerCase()} detail pages rather than every possible candidate.`,
      ],
    }),
    createFamilyAudit({
      family: 'ranking_hub',
      routePattern: '/rankings/',
      sampleUrl: `${baseUrl}/rankings/`,
      candidateCount: 1,
      dimensions: {
        uniqueness: {
          score: 4,
          rationale: 'Ranking hub uniqueness comes from family labels, selection logic, and why each ranking exists.',
        },
        information_density: {
          score: scoreFromSectionCount(config.rankingHubSectionOrder.length, 3, 2),
          rationale: `Ranking hub section order contains ${config.rankingHubSectionOrder.length} modules.`,
        },
        trust_clarity: {
          score: 4,
          rationale: 'Ranking hubs should explain representative vs full ordering and link to methodology.',
        },
        internal_navigation: {
          score: 5,
          rationale: 'Ranking hubs are primary routing surfaces into detail and category pages.',
        },
        serp_intent_match: {
          score: 4,
          rationale: 'Best/worst/comparison ranking intent is usually strong and legible.',
        },
        indexing_control: {
          score: 5,
          rationale: 'Ranking hubs should always be in the core indexed surface.',
        },
      },
      strongestSignals: ['strong intent', 'high navigation value', 'explains ranking families'],
      risks: ['hub page that only lists links without framing', 'unclear representative vs full logic'],
      recommendedActions: [
        'Keep methodology and ranking-family explanations visible near the top of the page.',
        'Use the ranking hub as an internal-link authority surface for the strongest detail pages.',
      ],
    }),
    createFamilyAudit({
      family: 'ranking_detail',
      routePattern: '/rankings/[family]',
      sampleUrl: `${baseUrl}/rankings/representative/`,
      candidateCount: 2,
      dimensions: {
        uniqueness: {
          score: 3,
          rationale: 'Ranking detail pages need explanatory framing or they collapse into generic sorted tables.',
        },
        information_density: {
          score: scoreFromSectionCount(config.rankingDetailSectionOrder.length, 3, 2),
          rationale: `Ranking detail section order contains ${config.rankingDetailSectionOrder.length} modules.`,
        },
        trust_clarity: {
          score: 4,
          rationale: 'Ranking details should make the ranking logic, exclusions, and tradeoffs explicit.',
        },
        internal_navigation: {
          score: 4,
          rationale: 'Strong ranking pages should route readers into top detail pages and methodology.',
        },
        serp_intent_match: {
          score: 4,
          rationale: 'Ranking detail pages often match specific list intent well.',
        },
        indexing_control: {
          score: 4,
          rationale: 'A small set of ranking detail pages can usually remain fully indexed.',
        },
      },
      strongestSignals: ['specific list intent', 'good comparison surface'],
      risks: ['thin ranking table with no rationale', 'duplicate ranking families with little differentiation'],
      recommendedActions: [
        'Add clear framing about why the ranking exists and what it excludes.',
        'Link ranking winners and notable outliers into the detail-page family.',
      ],
    }),
  ];

  const highRiskFamilies = families.filter((family) => family.riskLevel === 'high');
  const mediumRiskFamilies = families.filter((family) => family.riskLevel === 'medium');
  const auditBacklog = families
    .filter((family) => family.averageScore < 4)
    .map((family) => ({
      family: family.family,
      routePattern: family.routePattern,
      action: family.recommendedActions[0],
      priority: family.riskLevel === 'high' ? 'high' : 'medium',
    }));

  const outputJson = {
    generated_at: new Date().toISOString(),
    site_name: config.siteName,
    entity_count: entities.length,
    category_count: categoryCount,
    metric_family_count: config.metricFamilies.length,
    framework_dimensions: [
      'uniqueness',
      'information_density',
      'trust_clarity',
      'internal_navigation',
      'serp_intent_match',
      'indexing_control',
    ],
    families,
    summary: {
      low_risk_count: families.filter((family) => family.riskLevel === 'low').length,
      medium_risk_count: mediumRiskFamilies.length,
      high_risk_count: highRiskFamilies.length,
    },
    backlog: auditBacklog,
  };

  const outputMarkdown = `# Page Quality Audit

- Generated at: ${outputJson.generated_at}
- Site: ${config.siteName}
- ${config.entityPlural}: ${entities.length}
- ${config.categoryPlural}: ${categoryCount}
- Metric families: ${config.metricFamilies.length}

## Framework Dimensions

1. \`uniqueness\`: does the page family say something that nearby pages do not?
2. \`information_density\`: does the page carry enough evidence, not just decorative modules?
3. \`trust_clarity\`: are methodology, boundaries, and estimate language clear?
4. \`internal_navigation\`: does the page create a meaningful next step?
5. \`serp_intent_match\`: does the template match a real search intent?
6. \`indexing_control\`: should this family be fully indexed, selectively indexed, or held back?

## Family Scorecard

| Family | Route | Candidates | Avg Score | Risk | Sample URL |
| --- | --- | ---: | ---: | --- | --- |
${families
  .map(
    (family) =>
      `| \`${family.family}\` | \`${family.routePattern}\` | ${family.candidateCount} | ${family.averageScore.toFixed(2)} | ${family.riskLevel} | \`${family.sampleUrl}\` |`
  )
  .join('\n')}

## Family Findings

${families
  .map(
    (family) => `### ${family.family}

- Sample URL: \`${family.sampleUrl}\`
- Risk: \`${family.riskLevel}\`
- Strongest signals: ${family.strongestSignals.join('; ')}
- Risks: ${family.risks.join('; ')}
- Recommended actions:
${family.recommendedActions.map((action) => `  - ${action}`).join('\n')}

| Dimension | Score | Rationale |
| --- | ---: | --- |
${Object.entries(family.dimensions)
  .map(([dimension, value]) => `| \`${dimension}\` | ${value.score} | ${value.rationale} |`)
  .join('\n')}
`
  )
  .join('\n')}

## Backlog

${auditBacklog.length === 0
    ? '- No immediate family-level page quality backlog.'
    : auditBacklog
        .map(
          (item, index) =>
            `${index + 1}. [${item.priority}] \`${item.family}\` \`${item.routePattern}\` — ${item.action}`
        )
        .join('\n')}

## Recommended Usage

- Run this after major page-family changes or before widening the sitemap.
- Pair it with \`docs/seo-signal-response-map.md\` when Search Console signals start to move.
- Use \`docs/checklists/page-family-audit-checklist.md\` for manual sample-page review.
`;

  ensureDir(OUTPUT_MD_PATH);
  fs.writeFileSync(OUTPUT_JSON_PATH, `${JSON.stringify(outputJson, null, 2)}\n`);
  fs.writeFileSync(OUTPUT_MD_PATH, `${outputMarkdown}\n`);
  console.log(`Wrote page quality audit to ${path.relative(ROOT, OUTPUT_MD_PATH)}.`);
}

main();
