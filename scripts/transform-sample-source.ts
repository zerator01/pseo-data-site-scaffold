import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const RAW_PATH = path.join(ROOT, 'data', 'raw', 'source-sample.json');
const ENTITY_INDEX_PATH = path.join(ROOT, 'data', 'processed', 'entity-index.json');
const ENTITIES_PATH = path.join(ROOT, 'data', 'processed', 'entities.json');
const MANIFEST_PATH = path.join(ROOT, 'data', 'data-manifest.json');

interface RawEntity {
  id: string;
  slug: string;
  name: string;
  category: string;
  category_label: string;
  state: string;
  population: number;
  score: number;
  metrics: Record<string, number>;
  summary: string;
  faq?: Array<{ question: string; answer: string }>;
}

interface RawPayload {
  generated_at: string;
  entities: RawEntity[];
}

interface DataManifest {
  dataset_version?: string;
  previous_dataset_version?: string | null;
  core_dataset?: Record<string, unknown>;
  [key: string]: unknown;
}

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
}

function writeJson(filePath: string, value: unknown) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function bumpDatasetVersion(previous?: string | null) {
  if (!previous) {
    return '2026.04.10.1';
  }

  const match = previous.match(/^(\d{4}\.\d{2}\.\d{2})\.(\d+)$/);
  if (!match) {
    return '2026.04.10.1';
  }

  return `${match[1]}.${Number(match[2]) + 1}`;
}

function buildDefaultFaq(entityName: string) {
  return [
    {
      question: `Why is ${entityName} in the sample dataset?`,
      answer:
        'It exists to prove out route structure, score interpretation, and next-step navigation in the starter.',
    },
    {
      question: 'Should this data ship to production as-is?',
      answer:
        'No. Replace sample values with source-backed records and update the source registry before launch.',
    },
  ];
}

function main() {
  if (!fs.existsSync(RAW_PATH)) {
    console.error(`Missing raw sample source: ${RAW_PATH}`);
    process.exit(1);
  }

  const raw = readJson<RawPayload>(RAW_PATH);
  const entities = raw.entities.map((entity) => ({
    id: entity.id,
    slug: entity.slug,
    name: entity.name,
    category: entity.category,
    categoryLabel: entity.category_label,
    state: entity.state,
    population: entity.population,
    score: entity.score,
    metrics: entity.metrics,
    summary: entity.summary,
    faq: entity.faq?.length ? entity.faq : buildDefaultFaq(entity.name),
  }));

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

  const manifest = readJson<DataManifest>(MANIFEST_PATH);
  const nextVersion = bumpDatasetVersion(manifest.dataset_version);
  const transformedAt = new Date().toISOString();
  const upstreamDate = raw.generated_at.slice(0, 10);

  writeJson(ENTITY_INDEX_PATH, entityIndex);
  writeJson(ENTITIES_PATH, entities);
  writeJson(MANIFEST_PATH, {
    ...manifest,
    previous_dataset_version: manifest.dataset_version ?? null,
    dataset_version: nextVersion,
    core_dataset: {
      ...(manifest.core_dataset ?? {}),
      year: upstreamDate.slice(0, 4),
      fetched_at: raw.generated_at,
      upstream_date: upstreamDate,
      source: 'Starter sample source snapshot',
    },
    last_refresh: transformedAt,
    last_build: transformedAt,
  });

  console.log(
    `Transformed ${entities.length} sample records into ${path.relative(ROOT, ENTITIES_PATH)}.`
  );
}

main();
