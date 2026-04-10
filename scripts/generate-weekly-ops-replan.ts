import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const PLAN_PATH = path.join(ROOT, 'docs', 'ops', 'generated', 'weekly-ops-plan.json');
const SUMMARY_PATH = path.join(ROOT, 'docs', 'ops', 'generated', 'weekly-ops-summary.md');
const REVIEW_PATH = path.join(ROOT, 'docs', 'ops', 'generated', 'weekly-ops-review.md');
const EXECUTION_LOG_PATH = path.join(ROOT, 'docs', 'ops', 'ops-execution-log.md');
const JSON_OUTPUT_PATH = path.join(ROOT, 'docs', 'ops', 'generated', 'weekly-ops-replan-input.json');
const MARKDOWN_OUTPUT_PATH = path.join(ROOT, 'docs', 'ops', 'generated', 'weekly-ops-replan.md');

type TaskStatus =
  | 'planned'
  | 'in_progress'
  | 'done'
  | 'blocked'
  | 'carried_forward'
  | 'dropped';

interface OpsTask {
  id: string;
  title: string;
  owner: string;
  executor_type: 'human' | 'agent' | 'system';
  executor_id: string;
  status: TaskStatus;
  due: string;
  carry_forward_reason: string | null;
  source: string;
}

interface ExecutionRecord {
  task_id: string;
  status: TaskStatus;
  owner: string;
  executor_type: string;
  executor_id: string;
  due: string;
  carry_forward_reason: string;
  notes: string;
}

interface ReplanDecision {
  task_id: string;
  title: string;
  latest_status: TaskStatus;
  due: string;
  owner: string;
  executor_type: string;
  executor_id: string;
  carry_forward_reason: string | null;
  notes: string;
  recommended_action: 'keep' | 'carry_forward' | 'drop' | 're-scope' | 'complete';
  rationale: string;
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
      status: parts[1] as TaskStatus,
      owner: parts[2],
      executor_type: parts[3],
      executor_id: parts[4],
      due: parts[5],
      carry_forward_reason: parts[6],
      notes: parts[7],
    }));
}

function buildDecision(task: OpsTask, execution: ExecutionRecord | undefined): ReplanDecision {
  const latestStatus = execution?.status ?? task.status;
  const carryForwardReason = execution?.carry_forward_reason || task.carry_forward_reason;
  const notes = execution?.notes ?? '';

  if (latestStatus === 'done') {
    return {
      task_id: task.id,
      title: task.title,
      latest_status: latestStatus,
      due: execution?.due ?? task.due,
      owner: execution?.owner ?? task.owner,
      executor_type: execution?.executor_type ?? task.executor_type,
      executor_id: execution?.executor_id ?? task.executor_id,
      carry_forward_reason: carryForwardReason || null,
      notes,
      recommended_action: 'complete',
      rationale: 'Task is already complete and should only stay in the next cycle if it is intentionally recurring.',
    };
  }

  if (latestStatus === 'blocked') {
    return {
      task_id: task.id,
      title: task.title,
      latest_status: latestStatus,
      due: execution?.due ?? task.due,
      owner: execution?.owner ?? task.owner,
      executor_type: execution?.executor_type ?? task.executor_type,
      executor_id: execution?.executor_id ?? task.executor_id,
      carry_forward_reason: carryForwardReason || null,
      notes,
      recommended_action: 're-scope',
      rationale: 'Blocked work should not roll forward unchanged. Either reduce scope, switch executor, or explicitly drop it.',
    };
  }

  if (latestStatus === 'carried_forward') {
    return {
      task_id: task.id,
      title: task.title,
      latest_status: latestStatus,
      due: execution?.due ?? task.due,
      owner: execution?.owner ?? task.owner,
      executor_type: execution?.executor_type ?? task.executor_type,
      executor_id: execution?.executor_id ?? task.executor_id,
      carry_forward_reason: carryForwardReason || null,
      notes,
      recommended_action: 'carry_forward',
      rationale: 'Task was explicitly marked to survive into the next cycle. Validate that the stated reason still holds.',
    };
  }

  if (latestStatus === 'in_progress') {
    return {
      task_id: task.id,
      title: task.title,
      latest_status: latestStatus,
      due: execution?.due ?? task.due,
      owner: execution?.owner ?? task.owner,
      executor_type: execution?.executor_type ?? task.executor_type,
      executor_id: execution?.executor_id ?? task.executor_id,
      carry_forward_reason: carryForwardReason || null,
      notes,
      recommended_action: 'carry_forward',
      rationale: 'Task is active but unfinished. Carry it forward only if it still maps to the highest-priority outcome.',
    };
  }

  if (latestStatus === 'dropped') {
    return {
      task_id: task.id,
      title: task.title,
      latest_status: latestStatus,
      due: execution?.due ?? task.due,
      owner: execution?.owner ?? task.owner,
      executor_type: execution?.executor_type ?? task.executor_type,
      executor_id: execution?.executor_id ?? task.executor_id,
      carry_forward_reason: carryForwardReason || null,
      notes,
      recommended_action: 'drop',
      rationale: 'Task was explicitly dropped and should not silently re-enter the next plan.',
    };
  }

  return {
    task_id: task.id,
    title: task.title,
    latest_status: latestStatus,
    due: execution?.due ?? task.due,
    owner: execution?.owner ?? task.owner,
    executor_type: execution?.executor_type ?? task.executor_type,
    executor_id: execution?.executor_id ?? task.executor_id,
    carry_forward_reason: carryForwardReason || null,
    notes,
    recommended_action: 'keep',
    rationale: 'Task is still planned but lacks a strong execution signal. Re-validate priority before carrying it forward unchanged.',
  };
}

function buildPrompt(summary: string, review: string, decisions: ReplanDecision[]): string {
  return `You are replanning the next weekly operations cycle for a solo operator who may delegate execution to agents.

Use only the inputs in this packet.

Rules:
- Keep owner as \`zerator\` unless there is a compelling reason to change it.
- Use \`executor_type\` values \`human\`, \`agent\`, or \`system\`.
- Prefer \`executor_id: openclaw\` for analysis-heavy tasks and \`executor_id: zerator\` for operator decisions.
- Do not silently re-add dropped work.
- Re-scope blocked work instead of copying it unchanged.
- Only carry unfinished tasks forward when the rationale still matches the current summary and review.
- Return at most 5 tasks for the next weekly plan.

Current weekly summary:
${summary}

Current weekly review:
${review}

Replan decisions:
${decisions.map((decision) => `- ${decision.task_id}: ${decision.recommended_action} | ${decision.rationale}`).join('\n')}

Return JSON in this shape:
{
  "focus": ["...", "..."],
  "tasks": [
    {
      "id": "task_id",
      "title": "Task title",
      "owner": "zerator",
      "executor_type": "human|agent|system",
      "executor_id": "zerator|openclaw|github_actions",
      "status": "planned",
      "due": "YYYY-MM-DD",
      "carry_forward_reason": null,
      "source": "ops_replan"
    }
  ],
  "planning_notes": ["...", "..."]
}`;
}

function toMarkdown(summary: string, review: string, decisions: ReplanDecision[], prompt: string): string {
  const carryForward = decisions.filter((decision) => decision.recommended_action === 'carry_forward');
  const reScope = decisions.filter((decision) => decision.recommended_action === 're-scope');
  const drop = decisions.filter((decision) => decision.recommended_action === 'drop');

  return `# Weekly Ops Replan Brief

- Generated at: ${new Date().toISOString()}
- Purpose: package the current cycle into a model-ready replanning brief

## Replan Signals

- Carry forward candidates: ${carryForward.length}
- Re-scope candidates: ${reScope.length}
- Drop candidates: ${drop.length}

## Task Decisions

| Task ID | Latest Status | Recommended Action | Executor | Due | Carry Forward Reason |
| --- | --- | --- | --- | --- | --- |
${decisions
  .map(
    (decision) =>
      `| \`${decision.task_id}\` | ${decision.latest_status} | ${decision.recommended_action} | ${decision.executor_type}:${decision.executor_id} | ${decision.due} | ${decision.carry_forward_reason ?? ''} |`
  )
  .join('\n')}

## Operator Notes

${decisions.map((decision) => `- \`${decision.task_id}\`: ${decision.rationale}${decision.notes ? ` Notes: ${decision.notes}` : ''}`).join('\n')}

## Inputs Included

- \`docs/ops/generated/weekly-ops-summary.md\`
- \`docs/ops/generated/weekly-ops-review.md\`
- \`docs/ops/generated/weekly-ops-plan.json\`
- \`docs/ops/ops-execution-log.md\`

## LLM Replan Prompt

\`\`\`text
${prompt}
\`\`\`
`;
}

function main() {
  const planFile = readJson<{ tasks: OpsTask[] }>(PLAN_PATH);
  const summary = readFileSafe(SUMMARY_PATH).trim();
  const review = readFileSafe(REVIEW_PATH).trim();
  const execution = parseExecutionLog(readFileSafe(EXECUTION_LOG_PATH));
  const executionByTaskId = new Map(execution.map((record) => [record.task_id, record]));
  const decisions = planFile.tasks.map((task) => buildDecision(task, executionByTaskId.get(task.id)));
  const prompt = buildPrompt(summary, review, decisions);
  const payload = {
    generated_at: new Date().toISOString(),
    summary,
    review,
    decisions,
    prompt,
  };

  ensureDir(JSON_OUTPUT_PATH);
  fs.writeFileSync(JSON_OUTPUT_PATH, `${JSON.stringify(payload, null, 2)}\n`);
  fs.writeFileSync(MARKDOWN_OUTPUT_PATH, `${toMarkdown(summary, review, decisions, prompt)}\n`);
  console.log(`Wrote weekly ops replan brief to ${path.relative(ROOT, MARKDOWN_OUTPUT_PATH)}.`);
}

main();
