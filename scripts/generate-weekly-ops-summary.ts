import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const MANIFEST_PATH = path.join(ROOT, 'data', 'data-manifest.json');
const ENTITY_PATH = path.join(ROOT, 'data', 'processed', 'entities.json');
const OVERRIDE_PATH = path.join(ROOT, 'data', 'governance', 'override-registry.json');
const SNAPSHOT_PATH = path.join(ROOT, 'docs', 'ops', 'generated', 'ops-snapshot.json');
const OUTPUT_PATH = path.join(ROOT, 'docs', 'ops', 'generated', 'weekly-ops-summary.md');

interface EntityRecord {
  slug: string;
  name: string;
  score: number;
}

interface ManifestFile {
  dataset_version: string;
  last_refresh?: string;
  refresh_policy?: {
    cadence?: string;
    publish_mode?: string;
    review_required?: boolean;
  };
}

interface OverrideRecord {
  status?: string;
}

interface Snapshot {
  generated_at: string;
  entity_count: number;
  active_override_count: number;
  pending_override_count: number;
  top_entity_slug: string | null;
}

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
}

function ensureDir(filePath: string) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function readPreviousSnapshot(): Snapshot | null {
  if (!fs.existsSync(SNAPSHOT_PATH)) {
    return null;
  }

  return readJson<Snapshot>(SNAPSHOT_PATH);
}

function main() {
  const manifest = readJson<ManifestFile>(MANIFEST_PATH);
  const entities = readJson<EntityRecord[]>(ENTITY_PATH);
  const overrides = readJson<OverrideRecord[]>(OVERRIDE_PATH);
  const topEntities = [...entities].sort((left, right) => right.score - left.score).slice(0, 3);
  const pendingOverrideCount = overrides.filter((record) => record.status === 'pending-review').length;
  const activeOverrideCount = overrides.filter((record) => record.status === 'active').length;
  const previousSnapshot = readPreviousSnapshot();
  const currentSnapshot: Snapshot = {
    generated_at: new Date().toISOString(),
    entity_count: entities.length,
    active_override_count: activeOverrideCount,
    pending_override_count: pendingOverrideCount,
    top_entity_slug: topEntities[0]?.slug ?? null,
  };

  const entityDelta = previousSnapshot
    ? currentSnapshot.entity_count - previousSnapshot.entity_count
    : 0;
  const overrideDelta = previousSnapshot
    ? currentSnapshot.active_override_count - previousSnapshot.active_override_count
    : 0;
  const topEntityChanged =
    previousSnapshot && previousSnapshot.top_entity_slug !== currentSnapshot.top_entity_slug;

  const content = `# Weekly Ops Summary

- Generated at: ${currentSnapshot.generated_at}
- Dataset version: \`${manifest.dataset_version}\`
- Last refresh: \`${manifest.last_refresh ?? 'n/a'}\`
- Refresh cadence: \`${manifest.refresh_policy?.cadence ?? 'n/a'}\`
- Publish mode: \`${manifest.refresh_policy?.publish_mode ?? 'n/a'}\`

## What Changed Since Last Snapshot

- Entity count: ${currentSnapshot.entity_count} (${entityDelta >= 0 ? '+' : ''}${entityDelta})
- Active overrides: ${currentSnapshot.active_override_count} (${overrideDelta >= 0 ? '+' : ''}${overrideDelta})
- Pending override reviews: ${currentSnapshot.pending_override_count}
- Top entity changed: ${topEntityChanged ? 'yes' : 'no'}

## Top-Line Watchlist

${topEntities.map((entity, index) => `${index + 1}. ${entity.name} (\`${entity.slug}\`) score ${entity.score}`).join('\n')}

## Suggested Operator Actions

- Review the latest refresh digest in \`docs/ops/generated/refresh-digest.md\`
- Work through the QA queue in \`docs/ops/generated/qa-sampling-queue.md\`
- Record publish or hold decisions in \`docs/data-audit-log.md\`
`;

  ensureDir(OUTPUT_PATH);
  fs.writeFileSync(SNAPSHOT_PATH, `${JSON.stringify(currentSnapshot, null, 2)}\n`);
  fs.writeFileSync(OUTPUT_PATH, `${content}\n`);
  console.log(`Wrote weekly ops summary to ${path.relative(ROOT, OUTPUT_PATH)}.`);
}

main();
