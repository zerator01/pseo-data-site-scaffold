import fs from 'fs';
import path from 'path';

const CONFIG_PATH = path.join(process.cwd(), 'scaffold.config.json');
const OUTPUT_PATH = path.join(process.cwd(), 'data', 'raw', 'source-sample.json');

interface ScaffoldConfig {
  siteName: string;
  entitySingular: string;
  categoryPlural: string;
  defaultCategoryHubLabel: string;
  defaultCategoryHubSlug: string;
  metricFamilies: Array<{
    key: string;
    label: string;
  }>;
}

interface SampleFaqItem {
  question: string;
  answer: string;
}

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
}

function writeJson(filePath: string, value: unknown) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function main() {
  const config = readJson<ScaffoldConfig>(CONFIG_PATH);
  const buildMetrics = (values: number[]) =>
    Object.fromEntries(config.metricFamilies.map((metric, index) => [metric.key, values[index] ?? 0]));
  const fallbackCategoryA = `Comparison ${config.categoryPlural}`;
  const fallbackCategoryB = `Value ${config.categoryPlural}`;
  const payload = {
    dataset: 'core_sample_dataset',
    generated_at: new Date().toISOString(),
    source_note: 'Repo-local starter input. Replace with real upstream fetch logic before launch.',
    entities: [
      {
        id: 'north-harbor',
        slug: 'north-harbor',
        name: 'North Harbor',
        category: config.defaultCategoryHubSlug,
        category_label: config.defaultCategoryHubLabel,
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
        ] satisfies SampleFaqItem[],
      },
      {
        id: 'mesa-grove',
        slug: 'mesa-grove',
        name: 'Mesa Grove',
        category: 'comparison-hub',
        category_label: fallbackCategoryA,
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
        ] satisfies SampleFaqItem[],
      },
      {
        id: 'riverbend',
        slug: 'riverbend',
        name: 'Riverbend',
        category: 'value-hub',
        category_label: fallbackCategoryB,
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
        ] satisfies SampleFaqItem[],
      },
    ],
  };

  writeJson(OUTPUT_PATH, payload);
  console.log(`Wrote raw sample source to ${path.relative(process.cwd(), OUTPUT_PATH)}.`);
}

main();
