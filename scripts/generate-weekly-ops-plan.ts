import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const MANIFEST_PATH = path.join(ROOT, 'data', 'data-manifest.json');
const ENTITY_PATH = path.join(ROOT, 'data', 'processed', 'entities.json');
const QA_QUEUE_PATH = path.join(ROOT, 'docs', 'ops', 'generated', 'qa-sampling-queue.json');
const DIGEST_PATH = path.join(ROOT, 'docs', 'ops', 'generated', 'refresh-digest.md');
const OUTPUT_PATH = path.join(ROOT, 'docs', 'ops', 'generated', 'weekly-ops-plan.md');

interface ManifestFile {
  dataset_version: string;
  refresh_policy?: {
    cadence?: string;
    publish_mode?: string;
    review_required?: boolean;
  };
}

interface EntityRecord {
  slug: string;
  name: string;
  score: number;
}

interface QueueItem {
  slug: string;
  name: string;
  reviewFocus: string;
}

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
}

function ensureDir(filePath: string) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function readFileSafe(filePath: string): string {
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : '';
}

function isoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

function extractGateSummary(digest: string): string {
  const match = digest.match(/Gate summary:\s*`([^`]+)`/);
  return match?.[1] ?? 'hold_for_review';
}

function main() {
  const manifest = readJson<ManifestFile>(MANIFEST_PATH);
  const entities = readJson<EntityRecord[]>(ENTITY_PATH);
  const queue = readJson<QueueItem[]>(QA_QUEUE_PATH);
  const digest = readFileSafe(DIGEST_PATH);
  const topEntity = [...entities].sort((left, right) => right.score - left.score)[0];
  const edgeEntity = [...entities].sort((left, right) => left.score - right.score)[0];
  const gateSummary = extractGateSummary(digest);

  const tasks = [
    'Refresh core data and review anomaly output',
    `Review the QA sampling queue with focus on ${queue[0]?.name ?? topEntity?.name ?? 'top pages'}`,
    gateSummary === 'hold_for_review' || manifest.refresh_policy?.review_required
      ? 'Decide whether the current publish gate should stay manual-review-only'
      : 'Confirm the current publish gate can remain semi-automatic',
    `Audit one high-confidence page (${topEntity?.name ?? 'top entity'}) and one edge-case page (${edgeEntity?.name ?? 'edge entity'})`,
    'Update the ops automation backlog with one candidate to automate next',
  ];

  const content = `# Weekly Ops Plan

- Generated at: ${new Date().toISOString()}
- Planning window start: ${isoDate()}
- Dataset version: \`${manifest.dataset_version}\`
- Refresh cadence: \`${manifest.refresh_policy?.cadence ?? 'n/a'}\`
- Publish mode: \`${manifest.refresh_policy?.publish_mode ?? 'n/a'}\`

## Focus This Week

- Protect data quality and publish confidence before expanding surface area
- Use representative QA samples to catch weak page narratives early
- Turn one repeated manual step into a clearer automation candidate

## Planned Tasks

${tasks.map((task) => `- [ ] ${task}`).join('\n')}

## Inputs To Review

- \`docs/ops/generated/refresh-digest.md\`
- \`docs/ops/generated/qa-sampling-queue.md\`
- \`docs/ops/generated/weekly-ops-summary.md\`
- \`docs/ops/ops-execution-log.md\`

## Success Check

- Weekly review can show which planned tasks were completed, blocked, or rolled forward
`;

  ensureDir(OUTPUT_PATH);
  fs.writeFileSync(OUTPUT_PATH, `${content}\n`);
  console.log(`Wrote weekly ops plan to ${path.relative(ROOT, OUTPUT_PATH)}.`);
}

main();
