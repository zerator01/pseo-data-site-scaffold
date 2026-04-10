import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const MANIFEST_PATH = path.join(ROOT, 'data', 'data-manifest.json');
const ENTITY_PATH = path.join(ROOT, 'data', 'processed', 'entities.json');
const BASELINE_PATH = path.join(ROOT, 'data', 'governance', 'anomaly-baseline.json');
const OVERRIDE_PATH = path.join(ROOT, 'data', 'governance', 'override-registry.json');
const OUTPUT_PATH = path.join(ROOT, 'docs', 'ops', 'generated', 'refresh-digest.md');

interface EntityRecord {
  slug: string;
  name: string;
  score: number;
  population: number;
}

interface ManifestFile {
  dataset_version: string;
  previous_dataset_version?: string;
  last_refresh?: string;
  refresh_policy?: {
    cadence?: string;
    publish_mode?: string;
    review_required?: boolean;
  };
}

interface BaselineFile {
  dataset_version: string;
  metrics: {
    row_count: number;
    score_avg: number;
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

interface OverrideRecord {
  status?: string;
}

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
}

function ensureDir(filePath: string) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function average(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function percentageChange(current: number, previous: number): number {
  if (previous === 0) {
    return current === 0 ? 0 : 100;
  }

  return (Math.abs(current - previous) / previous) * 100;
}

function anomalyProblems(entities: EntityRecord[], baseline: BaselineFile): string[] {
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
    problems.push(`row_count drifted from ${baseline.metrics.row_count} to ${current.row_count}`);
  }

  if (
    percentageChange(current.score_avg, baseline.metrics.score_avg) >
    baseline.thresholds.score_avg_pct
  ) {
    problems.push(
      `score_avg drifted from ${baseline.metrics.score_avg.toFixed(2)} to ${current.score_avg.toFixed(2)}`
    );
  }

  if (
    percentageChange(current.population_avg, baseline.metrics.population_avg) >
    baseline.thresholds.population_avg_pct
  ) {
    problems.push(
      `population_avg drifted from ${baseline.metrics.population_avg.toFixed(2)} to ${current.population_avg.toFixed(2)}`
    );
  }

  if (topSlugDiffCount > baseline.thresholds.top_slugs_change_count) {
    problems.push(`top ranking drift changed ${topSlugDiffCount} slot(s)`);
  }

  return problems;
}

function main() {
  const manifest = readJson<ManifestFile>(MANIFEST_PATH);
  const entities = readJson<EntityRecord[]>(ENTITY_PATH);
  const baseline = readJson<BaselineFile>(BASELINE_PATH);
  const overrides = readJson<OverrideRecord[]>(OVERRIDE_PATH);

  const topEntities = [...entities].sort((left, right) => right.score - left.score).slice(0, 3);
  const problems = anomalyProblems(entities, baseline);
  const pendingOverrideCount = overrides.filter((record) => record.status === 'pending-review').length;
  const gateSummary =
    problems.length > 0
      ? 'block_publish'
      : manifest.refresh_policy?.review_required
        ? 'hold_for_review'
        : 'auto_publish';

  const content = `# Refresh Digest

- Generated at: ${new Date().toISOString()}
- Dataset version: \`${manifest.dataset_version}\`
- Previous dataset version: \`${manifest.previous_dataset_version ?? 'n/a'}\`
- Last refresh: \`${manifest.last_refresh ?? 'n/a'}\`
- Refresh cadence: \`${manifest.refresh_policy?.cadence ?? 'n/a'}\`
- Publish mode: \`${manifest.refresh_policy?.publish_mode ?? 'n/a'}\`
- Gate summary: \`${gateSummary}\`

## Current Snapshot

- Row count: ${entities.length}
- Average score: ${average(entities.map((entity) => entity.score)).toFixed(2)}
- Average population: ${Math.round(average(entities.map((entity) => entity.population))).toLocaleString()}
- Pending override reviews: ${pendingOverrideCount}

## Top Entities

${topEntities.map((entity, index) => `${index + 1}. ${entity.name} (\`${entity.slug}\`) score ${entity.score}`).join('\n')}

## Anomaly Notes

${problems.length > 0 ? problems.map((problem) => `- ${problem}`).join('\n') : '- No anomaly thresholds exceeded.'}
`;

  ensureDir(OUTPUT_PATH);
  fs.writeFileSync(OUTPUT_PATH, `${content}\n`);
  console.log(`Wrote refresh digest to ${path.relative(ROOT, OUTPUT_PATH)}.`);
}

main();
