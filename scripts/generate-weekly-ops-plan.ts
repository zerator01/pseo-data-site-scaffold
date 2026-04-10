import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const MANIFEST_PATH = path.join(ROOT, 'data', 'data-manifest.json');
const ENTITY_PATH = path.join(ROOT, 'data', 'processed', 'entities.json');
const QA_QUEUE_PATH = path.join(ROOT, 'docs', 'ops', 'generated', 'qa-sampling-queue.json');
const DIGEST_PATH = path.join(ROOT, 'docs', 'ops', 'generated', 'refresh-digest.md');
const JSON_OUTPUT_PATH = path.join(ROOT, 'docs', 'ops', 'generated', 'weekly-ops-plan.json');
const MARKDOWN_OUTPUT_PATH = path.join(ROOT, 'docs', 'ops', 'generated', 'weekly-ops-plan.md');

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

interface OpsTask {
  id: string;
  title: string;
  owner: string;
  executor_type: 'human' | 'agent' | 'system';
  executor_id: string;
  status: 'planned' | 'in_progress' | 'done' | 'blocked' | 'carried_forward' | 'dropped';
  due: string;
  carry_forward_reason: string | null;
  source: 'ops_cycle';
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

function isoDate(offsetDays = 0): string {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + offsetDays);
  return date.toISOString().slice(0, 10);
}

function extractGateSummary(digest: string): string {
  const match = digest.match(/Gate summary:\s*`([^`]+)`/);
  return match?.[1] ?? 'hold_for_review';
}

function buildTasks(
  manifest: ManifestFile,
  entities: EntityRecord[],
  queue: QueueItem[],
  digest: string
): OpsTask[] {
  const topEntity = [...entities].sort((left, right) => right.score - left.score)[0];
  const edgeEntity = [...entities].sort((left, right) => left.score - right.score)[0];
  const gateSummary = extractGateSummary(digest);
  const focusEntity = queue[0]?.name ?? topEntity?.name ?? 'top pages';

  return [
    {
      id: 'refresh_core_data',
      title: 'Refresh core data and review anomaly output',
      owner: 'zerator',
      executor_type: 'human',
      executor_id: 'zerator',
      status: 'planned',
      due: isoDate(1),
      carry_forward_reason: null,
      source: 'ops_cycle',
    },
    {
      id: 'review_qa_sampling_queue',
      title: `Review the QA sampling queue with focus on ${focusEntity}`,
      owner: 'zerator',
      executor_type: 'agent',
      executor_id: 'openclaw',
      status: 'planned',
      due: isoDate(2),
      carry_forward_reason: null,
      source: 'ops_cycle',
    },
    {
      id: 'decide_publish_gate_mode',
      title:
        gateSummary === 'hold_for_review' || manifest.refresh_policy?.review_required
          ? 'Decide whether the current publish gate should stay manual-review-only'
          : 'Confirm the current publish gate can remain semi-automatic',
      owner: 'zerator',
      executor_type: 'human',
      executor_id: 'zerator',
      status: 'planned',
      due: isoDate(3),
      carry_forward_reason: null,
      source: 'ops_cycle',
    },
    {
      id: 'audit_representative_pages',
      title: `Audit one high-confidence page (${topEntity?.name ?? 'top entity'}) and one edge-case page (${edgeEntity?.name ?? 'edge entity'})`,
      owner: 'zerator',
      executor_type: 'agent',
      executor_id: 'openclaw',
      status: 'planned',
      due: isoDate(4),
      carry_forward_reason: null,
      source: 'ops_cycle',
    },
    {
      id: 'update_automation_backlog',
      title: 'Update the ops automation backlog with one candidate to automate next',
      owner: 'zerator',
      executor_type: 'human',
      executor_id: 'zerator',
      status: 'planned',
      due: isoDate(5),
      carry_forward_reason: null,
      source: 'ops_cycle',
    },
  ];
}

function toMarkdown(tasks: OpsTask[], manifest: ManifestFile): string {
  return `# Weekly Ops Plan

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

| Task ID | Title | Owner | Executor Type | Executor | Status | Due | Carry Forward Reason |
| --- | --- | --- | --- | --- | --- | --- | --- |
${tasks
  .map(
    (task) =>
      `| \`${task.id}\` | ${task.title} | ${task.owner} | ${task.executor_type} | ${task.executor_id} | ${task.status} | ${task.due} | ${task.carry_forward_reason ?? ''} |`
  )
  .join('\n')}

## Inputs To Review

- \`docs/ops/generated/refresh-digest.md\`
- \`docs/ops/generated/qa-sampling-queue.md\`
- \`docs/ops/generated/weekly-ops-summary.md\`
- \`docs/ops/ops-execution-log.md\`
`;
}

function main() {
  const manifest = readJson<ManifestFile>(MANIFEST_PATH);
  const entities = readJson<EntityRecord[]>(ENTITY_PATH);
  const queue = readJson<QueueItem[]>(QA_QUEUE_PATH);
  const digest = readFileSafe(DIGEST_PATH);
  const tasks = buildTasks(manifest, entities, queue, digest);

  ensureDir(JSON_OUTPUT_PATH);
  fs.writeFileSync(JSON_OUTPUT_PATH, `${JSON.stringify({ generated_at: new Date().toISOString(), tasks }, null, 2)}\n`);
  fs.writeFileSync(MARKDOWN_OUTPUT_PATH, `${toMarkdown(tasks, manifest)}\n`);
  console.log(`Wrote weekly ops plan to ${path.relative(ROOT, MARKDOWN_OUTPUT_PATH)}.`);
}

main();
