import fs from 'fs';
import path from 'path';

const MANIFEST_PATH = path.join(process.cwd(), 'data', 'data-manifest.json');
const OVERRIDE_PATH = path.join(process.cwd(), 'data', 'governance', 'override-registry.json');
const BASELINE_PATH = path.join(process.cwd(), 'data', 'governance', 'anomaly-baseline.json');
const ENTITY_PATH = path.join(process.cwd(), 'data', 'processed', 'entities.json');

type PublishMode =
  | 'fully_automatic'
  | 'semi_automatic'
  | 'manual_review_required'
  | 'do_not_autopublish';

type GateDecision = 'auto_publish' | 'hold_for_review' | 'block_publish';

interface ManifestDataset {
  publish_mode?: PublishMode;
  requires_human_review?: boolean;
}

interface ManifestFile {
  refresh_policy?: {
    publish_mode?: PublishMode;
    review_required?: boolean;
  };
  core_dataset?: ManifestDataset;
  secondary_dataset?: ManifestDataset;
}

interface OverrideRecord {
  status?: 'active' | 'retired' | 'pending-review';
}

interface EntityRecord {
  slug: string;
  score: number;
  population: number;
}

interface BaselineFile {
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

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
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

function getAnomalyProblems(): string[] {
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
    problems.push('row_count threshold exceeded');
  }

  if (
    percentageChange(current.score_avg, baseline.metrics.score_avg) >
    baseline.thresholds.score_avg_pct
  ) {
    problems.push('score_avg threshold exceeded');
  }

  if (
    percentageChange(current.population_avg, baseline.metrics.population_avg) >
    baseline.thresholds.population_avg_pct
  ) {
    problems.push('population_avg threshold exceeded');
  }

  if (topSlugDiffCount > baseline.thresholds.top_slugs_change_count) {
    problems.push('top ranking drift threshold exceeded');
  }

  return problems;
}

function getOverrideFlags(): string[] {
  const overrides = readJson<OverrideRecord[]>(OVERRIDE_PATH);
  const flags: string[] = [];

  if (overrides.some((record) => record.status === 'pending-review')) {
    flags.push('override registry contains pending-review entries');
  }

  return flags;
}

function mostRestrictivePublishMode(modes: PublishMode[]): PublishMode {
  const order: PublishMode[] = [
    'fully_automatic',
    'semi_automatic',
    'manual_review_required',
    'do_not_autopublish',
  ];

  return [...modes].sort((left, right) => order.indexOf(right) - order.indexOf(left))[0];
}

function main() {
  if (
    !fs.existsSync(MANIFEST_PATH) ||
    !fs.existsSync(OVERRIDE_PATH) ||
    !fs.existsSync(BASELINE_PATH) ||
    !fs.existsSync(ENTITY_PATH)
  ) {
    console.error('Missing one or more publish gate inputs.');
    process.exit(1);
  }

  const manifest = readJson<ManifestFile>(MANIFEST_PATH);
  const publishModes = [
    manifest.refresh_policy?.publish_mode,
    manifest.core_dataset?.publish_mode,
    manifest.secondary_dataset?.publish_mode,
  ].filter(Boolean) as PublishMode[];

  const effectivePublishMode = mostRestrictivePublishMode(
    publishModes.length > 0 ? publishModes : ['manual_review_required']
  );

  const reviewRequired =
    Boolean(manifest.refresh_policy?.review_required) ||
    Boolean(manifest.core_dataset?.requires_human_review) ||
    Boolean(manifest.secondary_dataset?.requires_human_review);

  const anomalyProblems = getAnomalyProblems();
  const overrideFlags = getOverrideFlags();

  let decision: GateDecision = 'auto_publish';

  if (effectivePublishMode === 'do_not_autopublish') {
    decision = 'block_publish';
  } else if (
    effectivePublishMode === 'manual_review_required' ||
    effectivePublishMode === 'semi_automatic' ||
    reviewRequired ||
    overrideFlags.length > 0
  ) {
    decision = 'hold_for_review';
  }

  if (anomalyProblems.length > 0) {
    decision = 'block_publish';
  }

  console.log(
    JSON.stringify(
      {
        decision,
        effective_publish_mode: effectivePublishMode,
        review_required: reviewRequired,
        anomaly_problems: anomalyProblems,
        override_flags: overrideFlags,
      },
      null,
      2
    )
  );

  if (decision === 'block_publish') {
    process.exit(1);
  }
}

main();
