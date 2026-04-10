import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const PLAN_PATH = path.join(ROOT, 'docs', 'ops', 'generated', 'weekly-ops-plan.json');
const EXECUTION_LOG_PATH = path.join(ROOT, 'docs', 'ops', 'ops-execution-log.md');
const REVIEW_OUTPUT_PATH = path.join(ROOT, 'docs', 'ops', 'generated', 'weekly-ops-review.md');

interface OpsTask {
  id: string;
  title: string;
  owner: string;
  executor_type: string;
  executor_id: string;
  status: string;
  due: string;
  carry_forward_reason: string | null;
  source: string;
}

interface ExecutionRecord {
  task_id: string;
  status: string;
  owner: string;
  executor_type: string;
  executor_id: string;
  due: string;
  carry_forward_reason: string;
  notes: string;
}

function ensureDir(filePath: string) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function readFileSafe(filePath: string): string {
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : '';
}

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
}

function parseExecutionLog(log: string): ExecutionRecord[] {
  return log
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('| `'))
    .map((line) => line.split('|').map((part) => part.trim()).filter(Boolean))
    .filter((parts) => parts.length >= 8)
    .map((parts) => ({
      task_id: parts[0].replaceAll('`', ''),
      status: parts[1],
      owner: parts[2],
      executor_type: parts[3],
      executor_id: parts[4],
      due: parts[5],
      carry_forward_reason: parts[6],
      notes: parts[7],
    }));
}

function main() {
  const planFile = readJson<{ tasks: OpsTask[] }>(PLAN_PATH);
  const log = readFileSafe(EXECUTION_LOG_PATH);
  const execution = parseExecutionLog(log);
  const executionByTaskId = new Map(execution.map((record) => [record.task_id, record]));

  const completedPlanned = planFile.tasks.filter(
    (task) => executionByTaskId.get(task.id)?.status === 'done'
  );
  const blockedPlanned = planFile.tasks.filter(
    (task) => executionByTaskId.get(task.id)?.status === 'blocked'
  );
  const carriedForward = planFile.tasks.filter(
    (task) => executionByTaskId.get(task.id)?.status === 'carried_forward'
  );
  const openPlanned = planFile.tasks.filter((task) => {
    const status = executionByTaskId.get(task.id)?.status;
    return !status || status === 'planned' || status === 'in_progress';
  });
  const extraCompleted = execution.filter(
    (record) => record.status === 'done' && !planFile.tasks.some((task) => task.id === record.task_id)
  );

  const completionRate =
    planFile.tasks.length === 0
      ? 0
      : Math.round((completedPlanned.length / planFile.tasks.length) * 100);

  const content = `# Weekly Ops Review

- Generated at: ${new Date().toISOString()}
- Planned task count: ${planFile.tasks.length}
- Completed planned tasks: ${completedPlanned.length}
- Completion rate: ${completionRate}%

## Completed

${completedPlanned.length > 0 ? completedPlanned.map((task) => `- \`${task.id}\` ${task.title}`).join('\n') : '- No planned tasks marked complete yet.'}

## Blocked

${blockedPlanned.length > 0 ? blockedPlanned.map((task) => `- \`${task.id}\` ${task.title}`).join('\n') : '- No tasks are currently marked blocked.'}

## Carried Forward

${carriedForward.length > 0 ? carriedForward.map((task) => `- \`${task.id}\` ${task.title}`).join('\n') : '- No tasks have been explicitly carried forward yet.'}

## Still Open

${openPlanned.length > 0 ? openPlanned.map((task) => `- \`${task.id}\` ${task.title}`).join('\n') : '- All planned tasks have a terminal status.'}

## Extra Completed Work

${extraCompleted.length > 0 ? extraCompleted.map((record) => `- \`${record.task_id}\` ${record.notes || 'Completed outside the original plan'}`).join('\n') : '- No extra completed tasks recorded outside the plan.'}

## Next-Cycle Prompt

- Carry open tasks forward only when the rationale is still valid.
- Mark dropped work explicitly instead of silently deleting it.
- Use \`carry_forward_reason\` to explain why a task survives into the next cycle.
`;

  ensureDir(REVIEW_OUTPUT_PATH);
  fs.writeFileSync(REVIEW_OUTPUT_PATH, `${content}\n`);
  console.log(`Wrote weekly ops review to ${path.relative(ROOT, REVIEW_OUTPUT_PATH)}.`);
}

main();
