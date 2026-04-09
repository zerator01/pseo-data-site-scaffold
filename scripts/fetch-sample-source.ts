import fs from 'fs';
import path from 'path';

const CONFIG_PATH = path.join(process.cwd(), 'scaffold.config.json');
const OUTPUT_PATH = path.join(process.cwd(), 'data', 'raw', 'source-sample.json');

interface ScaffoldConfig {
  siteName: string;
  entitySingular: string;
  defaultCategoryHubLabel: string;
  defaultCategoryHubSlug: string;
  metricFamilies: Array<{
    key: string;
    label: string;
  }>;
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
        summary: `North Harbor is the sample high-confidence ${config.entitySingular.toLowerCase()} for ${config.siteName}.`,
      },
      {
        id: 'mesa-grove',
        slug: 'mesa-grove',
        name: 'Mesa Grove',
        category: 'comparison-hub',
        category_label: 'Comparison Hubs',
        state: 'Arizona',
        population: 310000,
        score: 81,
        metrics: buildMetrics([78, 77, 86]),
        summary: 'Mesa Grove demonstrates momentum-led tradeoffs inside the sample dataset.',
      },
      {
        id: 'riverbend',
        slug: 'riverbend',
        name: 'Riverbend',
        category: 'value-hub',
        category_label: 'Value Hubs',
        state: 'Ohio',
        population: 185000,
        score: 76,
        metrics: buildMetrics([84, 70, 74]),
        summary: 'Riverbend demonstrates value-led comparisons for representative rankings.',
      },
    ],
  };

  writeJson(OUTPUT_PATH, payload);
  console.log(`Wrote raw sample source to ${path.relative(process.cwd(), OUTPUT_PATH)}.`);
}

main();
