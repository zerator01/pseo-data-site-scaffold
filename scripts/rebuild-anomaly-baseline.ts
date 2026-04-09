import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const ENTITIES_PATH = path.join(ROOT, 'data', 'processed', 'entities.json');
const MANIFEST_PATH = path.join(ROOT, 'data', 'data-manifest.json');
const BASELINE_PATH = path.join(ROOT, 'data', 'governance', 'anomaly-baseline.json');

interface EntityRecord {
  slug: string;
  score: number;
  population: number;
}

interface BaselineFile {
  thresholds?: {
    row_count_pct: number;
    score_avg_pct: number;
    population_avg_pct: number;
    top_slugs_change_count: number;
  };
}

interface ManifestFile {
  dataset_version?: string;
}

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
}

function writeJson(filePath: string, value: unknown) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function average(values: number[]) {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function main() {
  const entities = readJson<EntityRecord[]>(ENTITIES_PATH);
  const manifest = readJson<ManifestFile>(MANIFEST_PATH);
  const existingBaseline = fs.existsSync(BASELINE_PATH)
    ? readJson<BaselineFile>(BASELINE_PATH)
    : {};

  const scores = entities.map((entity) => entity.score);
  const populations = entities.map((entity) => entity.population);

  writeJson(BASELINE_PATH, {
    dataset_version: manifest.dataset_version ?? '2026.04.10.1',
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
    thresholds: existingBaseline.thresholds ?? {
      row_count_pct: 20,
      score_avg_pct: 15,
      population_avg_pct: 20,
      top_slugs_change_count: 2,
    },
  });

  console.log(`Rebuilt anomaly baseline at ${path.relative(ROOT, BASELINE_PATH)}.`);
}

main();
