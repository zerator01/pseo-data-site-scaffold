import fs from 'fs';
import path from 'path';

const ENTITY_PATH = path.join(process.cwd(), 'data', 'processed', 'entities.json');
const BASELINE_PATH = path.join(process.cwd(), 'data', 'governance', 'anomaly-baseline.json');

interface EntityRecord {
  slug: string;
  score: number;
  population: number;
}

interface BaselineFile {
  dataset_version: string;
  metrics: {
    row_count: number;
    score_min: number;
    score_max: number;
    score_avg: number;
    population_min: number;
    population_max: number;
    population_avg: number;
    top_slugs: string[];
  };
  thresholds: {
    row_count_pct: number;
    score_avg_pct: number;
    population_avg_pct: number;
    top_slugs_change_count: number;
  };
}

function percentageChange(current: number, previous: number): number {
  if (previous === 0) {
    return current === 0 ? 0 : 100;
  }

  return (Math.abs(current - previous) / previous) * 100;
}

function average(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
}

function main() {
  if (!fs.existsSync(ENTITY_PATH)) {
    console.error('Missing entity dataset:', ENTITY_PATH);
    process.exit(1);
  }

  if (!fs.existsSync(BASELINE_PATH)) {
    console.error('Missing anomaly baseline:', BASELINE_PATH);
    process.exit(1);
  }

  const entities = readJson<EntityRecord[]>(ENTITY_PATH);
  const baseline = readJson<BaselineFile>(BASELINE_PATH);

  const current = {
    row_count: entities.length,
    score_avg: average(entities.map((entity) => entity.score)),
    population_avg: average(entities.map((entity) => entity.population)),
    top_slugs: [...entities]
      .sort((left, right) => right.score - left.score)
      .slice(0, baseline.metrics.top_slugs.length)
      .map((entity) => entity.slug),
  };

  const topSlugDiffCount = current.top_slugs.filter(
    (slug, index) => slug !== baseline.metrics.top_slugs[index]
  ).length;

  const problems: string[] = [];

  if (
    percentageChange(current.row_count, baseline.metrics.row_count) >
    baseline.thresholds.row_count_pct
  ) {
    problems.push(
      `row_count changed from ${baseline.metrics.row_count} to ${current.row_count}`
    );
  }

  if (
    percentageChange(current.score_avg, baseline.metrics.score_avg) >
    baseline.thresholds.score_avg_pct
  ) {
    problems.push(
      `score_avg changed from ${baseline.metrics.score_avg.toFixed(2)} to ${current.score_avg.toFixed(2)}`
    );
  }

  if (
    percentageChange(current.population_avg, baseline.metrics.population_avg) >
    baseline.thresholds.population_avg_pct
  ) {
    problems.push(
      `population_avg changed from ${baseline.metrics.population_avg.toFixed(2)} to ${current.population_avg.toFixed(2)}`
    );
  }

  if (topSlugDiffCount > baseline.thresholds.top_slugs_change_count) {
    problems.push(
      `top ranking drift exceeded threshold: ${topSlugDiffCount} slots changed`
    );
  }

  if (problems.length > 0) {
    console.error('Anomaly check failed against baseline version', baseline.dataset_version);
    for (const problem of problems) {
      console.error('-', problem);
    }
    process.exit(1);
  }

  console.log('Anomaly check passed.');
  console.log(
    JSON.stringify(
      {
        baseline_version: baseline.dataset_version,
        current,
      },
      null,
      2
    )
  );
}

main();
