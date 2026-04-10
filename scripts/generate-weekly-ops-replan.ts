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
  latest_status: TaskStatus;
  due: string;
  executor: string;
  carry_forward_reason: string | null;
  notes: string;
  recommended_action: 'keep' | 'carry_forward' | 'drop' | 're-scope' | 'complete';
  rationale: string;
}

interface CompactReplanContext {
  summary_headlines: string[];
  review_headlines: string[];
  decisions: ReplanDecision[];
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

function extractBullets(markdown: string, limit: number): string[] {
  return markdown
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('- '))
    .map((line) => line.slice(2).trim())
    .filter(Boolean)
    .slice(0, limit);
}

function buildDecision(task: OpsTask, execution: ExecutionRecord | undefined): ReplanDecision {
  const latestStatus = execution?.status ?? task.status;
  const carryForwardReason = execution?.carry_forward_reason || task.carry_forward_reason;
  const notes = execution?.notes ?? '';
  const executor = `${execution?.executor_type ?? task.executor_type}:${execution?.executor_id ?? task.executor_id}`;

  if (latestStatus === 'done') {
    return {
      task_id: task.id,
      latest_status: latestStatus,
      due: execution?.due ?? task.due,
      executor,
      carry_forward_reason: carryForwardReason || null,
      notes,
      recommended_action: 'complete',
      rationale: 'Already completed. Only keep if it is intentionally recurring.',
    };
  }

  if (latestStatus === 'blocked') {
    return {
      task_id: task.id,
      latest_status: latestStatus,
      due: execution?.due ?? task.due,
      executor,
      carry_forward_reason: carryForwardReason || null,
      notes,
      recommended_action: 're-scope',
      rationale: 'Blocked work should be reduced in scope, reassigned, or dropped.',
    };
  }

  if (latestStatus === 'carried_forward') {
    return {
      task_id: task.id,
      latest_status: latestStatus,
      due: execution?.due ?? task.due,
      executor,
      carry_forward_reason: carryForwardReason || null,
      notes,
      recommended_action: 'carry_forward',
      rationale: 'Explicitly marked to continue. Validate that the reason still holds.',
    };
  }

  if (latestStatus === 'in_progress') {
    return {
      task_id: task.id,
      latest_status: latestStatus,
      due: execution?.due ?? task.due,
      executor,
      carry_forward_reason: carryForwardReason || null,
      notes,
      recommended_action: 'carry_forward',
      rationale: 'Active but unfinished. Carry forward only if still highest priority.',
    };
  }

  if (latestStatus === 'dropped') {
    return {
      task_id: task.id,
      latest_status: latestStatus,
      due: execution?.due ?? task.due,
      executor,
      carry_forward_reason: carryForwardReason || null,
      notes,
      recommended_action: 'drop',
      rationale: 'Explicitly dropped. Do not silently re-add it.',
    };
  }

  return {
    task_id: task.id,
    latest_status: latestStatus,
    due: execution?.due ?? task.due,
    executor,
    carry_forward_reason: carryForwardReason || null,
    notes,
    recommended_action: 'keep',
    rationale: 'Still planned with no strong execution signal. Re-validate before carrying forward unchanged.',
  };
}

function buildCompactContext(summary: string, review: string, decisions: ReplanDecision[]): CompactReplanContext {
  return {
    summary_headlines: extractBullets(summary, 8),
    review_headlines: extractBullets(review, 10),
    decisions,
  };
}

function buildPrompt(context: CompactReplanContext): string {
  return `You are replanning the next weekly operations cycle for a solo operator who may delegate execution to agents.

Use only the structured inputs below. Do not assume missing history.

Rules:
- Keep owner as \`zerator\` unless there is a compelling reason to change it.
- Use \`executor_type\` values \`human\`, \`agent\`, or \`system\`.
- Prefer \`executor_id: openclaw\` for analysis-heavy tasks and \`executor_id: zerator\` for operator decisions.
- Do not silently re-add dropped work.
- Re-scope blocked work instead of copying it unchanged.
- Return at most 5 tasks for the next weekly plan.

Summary headlines:
${context.summary_headlines.map((line) => `- ${line}`).join('\n')}

Review headlines:
${context.review_headlines.map((line) => `- ${line}`).join('\n')}

Decision inputs:
${context.decisions
  .map(
    (decision) =>
      `- ${decision.task_id}: action=${decision.recommended_action}; status=${decision.latest_status}; due=${decision.due}; executor=${decision.executor}; rationale=${decision.rationale}${decision.carry_forward_reason ? `; carry_forward_reason=${decision.carry_forward_reason}` : ''}${decision.notes ? `; notes=${decision.notes}` : ''}`
  )
  .join('\n')}

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

function toMarkdown(context: CompactReplanContext, prompt: string): string {
  const carryForward = context.decisions.filter((decision) => decision.recommended_action === 'carry_forward');
  const reScope = context.decisions.filter((decision) => decision.recommended_action === 're-scope');
  const drop = context.decisions.filter((decision) => decision.recommended_action === 'drop');

  return `# Weekly Ops Replan Brief

- Generated at: ${new Date().toISOString()}
- Purpose: package the current cycle into a model-ready replanning brief

## Replan Signals

- Carry forward candidates: ${carryForward.length}
- Re-scope candidates: ${reScope.length}
- Drop candidates: ${drop.length}

## Compact Context Sent To LLM

### Summary Headlines

${context.summary_headlines.map((line) => `- ${line}`).join('\n')}

### Review Headlines

${context.review_headlines.map((line) => `- ${line}`).join('\n')}

### Decision Inputs

${context.decisions
  .map(
    (decision) =>
      `- \`${decision.task_id}\`: action=${decision.recommended_action}; status=${decision.latest_status}; due=${decision.due}; executor=${decision.executor}; rationale=${decision.rationale}${decision.carry_forward_reason ? `; carry_forward_reason=${decision.carry_forward_reason}` : ''}${decision.notes ? `; notes=${decision.notes}` : ''}`
  )
  .join('\n')}

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
  const compactContext = buildCompactContext(summary, review, decisions);
  const prompt = buildPrompt(compactContext);
  const payload = {
    generated_at: new Date().toISOString(),
    compact_context: compactContext,
    prompt,
  };

  ensureDir(JSON_OUTPUT_PATH);
  fs.writeFileSync(JSON_OUTPUT_PATH, `${JSON.stringify(payload, null, 2)}\n`);
  fs.writeFileSync(MARKDOWN_OUTPUT_PATH, `${toMarkdown(compactContext, prompt)}\n`);
  console.log(`Wrote weekly ops replan brief to ${path.relative(ROOT, MARKDOWN_OUTPUT_PATH)}.`);
}

main();
