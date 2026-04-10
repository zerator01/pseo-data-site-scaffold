import fs from 'fs';
import path from 'path';

const root = process.cwd();
const configPath = path.join(root, 'scaffold.config.json');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeFile(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
}

function replaceAll(template, replacements) {
  let result = template;

  for (const [key, value] of Object.entries(replacements)) {
    result = result.replaceAll(`{{${key}}}`, String(value));
  }

  return result;
}

function validateConfig(config) {
  const required = [
    'projectName',
    'siteName',
    'siteUrl',
    'siteDescription',
    'siteTagline',
    'heroTitle',
    'heroDescription',
    'entitySingular',
    'entityPlural',
    'entityDirectoryLabel',
    'entityRouteBase',
    'categorySingular',
    'categoryPlural',
    'categoryRouteBase',
    'defaultCategoryHubLabel',
    'defaultCategoryHubSlug',
    'representativeRankingLabel',
    'representativeRankingDescription',
    'fullRankingLabel',
    'fullRankingDescription',
    'metricFamilies',
    'homeSectionOrder',
    'entityDetailSectionOrder',
    'categoryHubSectionOrder',
    'rankingHubSectionOrder',
    'rankingDetailSectionOrder',
  ];

  const missing = required.filter((key) => !config[key]);

  if (missing.length > 0) {
    throw new Error(`Missing scaffold config keys: ${missing.join(', ')}`);
  }
}

function updatePackageJson(config) {
  const packagePath = path.join(root, 'package.json');
  const packageJson = readJson(packagePath);
  packageJson.name = config.projectName;
  writeFile(packagePath, `${JSON.stringify(packageJson, null, 2)}\n`);
}

function updateSiteConfig(config) {
  const filePath = path.join(root, 'src', 'lib', 'site.ts');
  const configJson = JSON.stringify(
    {
      projectName: config.projectName,
      siteName: config.siteName,
      siteUrl: config.siteUrl,
      siteDescription: config.siteDescription,
      siteTagline: config.siteTagline,
      heroTitle: config.heroTitle,
      heroDescription: config.heroDescription,
      entitySingular: config.entitySingular,
      entityPlural: config.entityPlural,
      entityDirectoryLabel: config.entityDirectoryLabel,
      entityRouteBase: config.entityRouteBase,
      categorySingular: config.categorySingular,
      categoryPlural: config.categoryPlural,
      categoryRouteBase: config.categoryRouteBase,
      defaultCategoryHubLabel: config.defaultCategoryHubLabel,
      defaultCategoryHubSlug: config.defaultCategoryHubSlug,
      representativeRankingLabel: config.representativeRankingLabel,
      representativeRankingDescription: config.representativeRankingDescription,
      fullRankingLabel: config.fullRankingLabel,
      fullRankingDescription: config.fullRankingDescription,
      metricFamilies: config.metricFamilies,
      homeSectionOrder: config.homeSectionOrder,
      entityDetailSectionOrder: config.entityDetailSectionOrder,
      categoryHubSectionOrder: config.categoryHubSectionOrder,
      rankingHubSectionOrder: config.rankingHubSectionOrder,
      rankingDetailSectionOrder: config.rankingDetailSectionOrder,
    },
    null,
    2
  );

  const content = `export const PROJECT_CONFIG = ${configJson} as const;

export const SITE_NAME = PROJECT_CONFIG.siteName;
export const SITE_URL = PROJECT_CONFIG.siteUrl;
export const SITE_DESCRIPTION = PROJECT_CONFIG.siteDescription;

export const ROUTES = {
  entityDirectory: \`/\${PROJECT_CONFIG.entityRouteBase}/\`,
  entityDetail: (slug: string) => \`/\${PROJECT_CONFIG.entityRouteBase}/\${slug}/\`,
  legacyEntityDetail: (slug: string) => \`/entity/\${slug}/\`,
  categoryHub: (slug: string) => \`/\${PROJECT_CONFIG.categoryRouteBase}/\${slug}/\`,
  defaultCategoryHub: \`/\${PROJECT_CONFIG.categoryRouteBase}/\${PROJECT_CONFIG.defaultCategoryHubSlug}/\`,
  rankings: '/rankings/',
  representativeRankings: '/rankings/representative/',
  methodology: '/methodology/',
  about: '/about/',
  privacy: '/privacy/',
} as const;

export const RANKING_FAMILIES = [
  {
    slug: 'representative',
    name: PROJECT_CONFIG.representativeRankingLabel,
    description: PROJECT_CONFIG.representativeRankingDescription,
  },
  {
    slug: 'full',
    name: PROJECT_CONFIG.fullRankingLabel,
    description: PROJECT_CONFIG.fullRankingDescription,
  },
] as const;

export const METRIC_FAMILIES = PROJECT_CONFIG.metricFamilies;
export const HOME_SECTION_ORDER = PROJECT_CONFIG.homeSectionOrder;
export const ENTITY_DETAIL_SECTION_ORDER = PROJECT_CONFIG.entityDetailSectionOrder;
export const CATEGORY_HUB_SECTION_ORDER = PROJECT_CONFIG.categoryHubSectionOrder;
export const RANKING_HUB_SECTION_ORDER = PROJECT_CONFIG.rankingHubSectionOrder;
export const RANKING_DETAIL_SECTION_ORDER = PROJECT_CONFIG.rankingDetailSectionOrder;
`;

  writeFile(filePath, content);
}

function writeJson(filePath, value) {
  writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function titleCase(value) {
  return String(value)
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function buildSampleEntities(config) {
  const buildMetrics = (values) =>
    Object.fromEntries(config.metricFamilies.map((metric, index) => [metric.key, values[index] ?? 0]));
  const fallbackCategoryA = {
    slug: 'comparison-hub',
    label: `Comparison ${config.categoryPlural}`,
  };
  const fallbackCategoryB = {
    slug: 'value-hub',
    label: `Value ${config.categoryPlural}`,
  };
  const categories = [
    {
      slug: config.defaultCategoryHubSlug,
      label: config.defaultCategoryHubLabel,
    },
    fallbackCategoryA,
    fallbackCategoryB,
  ];

  return [
    {
      id: 'north-harbor',
      slug: 'north-harbor',
      name: 'North Harbor',
      category: categories[0].slug,
      categoryLabel: categories[0].label,
      state: 'Washington',
      population: 420000,
      score: 88,
      metrics: buildMetrics([71, 92, 83]),
      summary: `North Harbor is the sample high-confidence ${config.entitySingular.toLowerCase()}. It demonstrates how a detail page can combine score context, supporting metrics, and next-step navigation without becoming a dead end.`,
      faq: [
        {
          question: `Why does North Harbor rank near the top in this ${config.siteName} sample?`,
          answer:
            'Its sample score is lifted by strong access and momentum metrics rather than a single extreme outlier.',
        },
        {
          question: 'Is the score based on public data or an estimate?',
          answer:
            'This starter uses sample data only. Real projects should document every source, fallback rule, and estimate boundary.',
        },
      ],
    },
    {
      id: 'mesa-grove',
      slug: 'mesa-grove',
      name: 'Mesa Grove',
      category: categories[1].slug,
      categoryLabel: categories[1].label,
      state: 'Arizona',
      population: 310000,
      score: 81,
      metrics: buildMetrics([78, 77, 86]),
      summary: `Mesa Grove shows how a representative ${config.entitySingular.toLowerCase()} can have strong momentum with slightly weaker affordability. The detail page should explain those tradeoffs instead of just printing a rank.`,
      faq: [
        {
          question: 'What makes Mesa Grove different from North Harbor?',
          answer:
            'Mesa Grove wins more from growth and medium-term upside than from access density.',
        },
        {
          question: `How should ${config.siteName} use these metrics?`,
          answer:
            'Treat them as placeholders for your own source-backed dimensions. Do not ship them as real-world claims.',
        },
      ],
    },
    {
      id: 'riverbend',
      slug: 'riverbend',
      name: 'Riverbend',
      category: categories[2].slug,
      categoryLabel: categories[2].label,
      state: 'Ohio',
      population: 185000,
      score: 76,
      metrics: buildMetrics([84, 70, 74]),
      summary: `Riverbend is the sample value case. It helps ${config.siteName} demonstrate representative rankings that do not always simply mirror the absolute top score.`,
      faq: [
        {
          question: `Why is Riverbend still useful in a ${config.entitySingular.toLowerCase()} comparison?`,
          answer:
            'Its sample affordability metric is strong enough to make it competitive for value-led comparisons.',
        },
        {
          question: `Should ${config.siteName} separate representative and full rankings?`,
          answer:
            'Yes. Representative rankings are for normal users, while full rankings preserve raw mathematical output.',
        },
      ],
    },
  ];
}

function buildRawSampleSource(config) {
  return {
    dataset: 'core_sample_dataset',
    generated_at: '2026-04-10T00:00:00.000Z',
    source_note: 'Repo-local starter input. Replace with real upstream fetch logic before launch.',
    entities: buildSampleEntities(config).map((entity) => ({
      id: entity.id,
      slug: entity.slug,
      name: entity.name,
      category: entity.category,
      category_label: entity.categoryLabel,
      state: entity.state,
      population: entity.population,
      score: entity.score,
      metrics: entity.metrics,
      summary: entity.summary,
      faq: entity.faq,
    })),
  };
}

function buildAnomalyBaseline(entities) {
  const scores = entities.map((entity) => entity.score);
  const populations = entities.map((entity) => entity.population);
  const average = (values) => values.reduce((sum, value) => sum + value, 0) / values.length;

  return {
    dataset_version: '2026.04.10.1',
    metrics: {
      row_count: entities.length,
      score_min: Math.min(...scores),
      score_max: Math.max(...scores),
      score_avg: Number(average(scores).toFixed(2)),
      population_min: Math.min(...populations),
      population_max: Math.max(...populations),
      population_avg: Number(average(populations).toFixed(2)),
      top_slugs: [...entities]
        .sort((left, right) => right.score - left.score)
        .slice(0, 3)
        .map((entity) => entity.slug),
    },
    thresholds: {
      row_count_pct: 20,
      score_avg_pct: 15,
      population_avg_pct: 20,
      top_slugs_change_count: 2,
    },
  };
}

function updateSampleData(config) {
  const entities = buildSampleEntities(config);
  const entityIndex = entities.map(
    ({ id, slug, name, category, categoryLabel, score, population, state }) => ({
      id,
      slug,
      name,
      category,
      categoryLabel,
      score,
      population,
      state,
    })
  );

  writeJson(path.join(root, 'data', 'processed', 'entity-index.json'), entityIndex);
  writeJson(path.join(root, 'data', 'processed', 'entities.json'), entities);
  writeJson(path.join(root, 'data', 'raw', 'source-sample.json'), buildRawSampleSource(config));
  writeJson(
    path.join(root, 'data', 'governance', 'anomaly-baseline.json'),
    buildAnomalyBaseline(entities)
  );
}

function writeFromTemplate(templateRelativePath, outputRelativePath, replacements) {
  const templatePath = path.join(root, 'templates', templateRelativePath);
  const outputPath = path.join(root, outputRelativePath);
  const template = fs.readFileSync(templatePath, 'utf8');
  writeFile(outputPath, replaceAll(template, replacements));
}

function main() {
  if (!fs.existsSync(configPath)) {
    throw new Error(`Missing scaffold config: ${configPath}`);
  }

  const config = readJson(configPath);
  validateConfig(config);

  const replacements = {
    PROJECT_NAME: config.siteName,
    ENTITY_TYPE: `${config.entityPlural.toLowerCase()} and ${config.entitySingular.toLowerCase()} detail pages`,
  };

  updatePackageJson(config);
  updateSiteConfig(config);
  updateSampleData(config);
  writeFromTemplate('README.template.md', 'README.md', replacements);
  writeFromTemplate('AGENTS.template.md', 'AGENTS.md', replacements);
  writeFromTemplate('docs/site-blueprint.template.md', 'docs/site-blueprint.md', replacements);
  writeFromTemplate(
    'docs/scaffold-config-reference.template.md',
    'docs/scaffold-config-reference.md',
    replacements
  );
  writeFromTemplate('docs/source-registry.template.md', 'docs/source-registry.md', replacements);
  writeFromTemplate('docs/metric-spec.template.md', 'docs/metric-spec.md', replacements);
  writeFromTemplate('docs/data-audit-log.template.md', 'docs/data-audit-log.md', replacements);
  writeFromTemplate('docs/data-refresh-policy.template.md', 'docs/data-refresh-policy.md', replacements);
  writeFromTemplate('docs/refresh-runbook.template.md', 'docs/refresh-runbook.md', replacements);
  writeFromTemplate('docs/ops/operating-model.template.md', 'docs/ops/operating-model.md', replacements);
  writeFromTemplate('docs/ops/publishing-sop.template.md', 'docs/ops/publishing-sop.md', replacements);
  writeFromTemplate(
    'docs/ops/quality-review-sop.template.md',
    'docs/ops/quality-review-sop.md',
    replacements
  );
  writeFromTemplate(
    'docs/ops/incident-response-sop.template.md',
    'docs/ops/incident-response-sop.md',
    replacements
  );
  writeFromTemplate(
    'docs/ops/automation-backlog.template.md',
    'docs/ops/automation-backlog.md',
    replacements
  );

  console.log(`Initialized scaffold for ${config.siteName} with sample ${titleCase(config.entityPlural)} data.`);
}

main();
