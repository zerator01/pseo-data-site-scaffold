import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const INPUT_PATH = path.join(ROOT, 'docs', 'ops', 'generated', 'weekly-ops-replan-input.json');
const JSON_OUTPUT_PATH = path.join(ROOT, 'docs', 'ops', 'generated', 'weekly-ops-next-plan.json');
const MARKDOWN_OUTPUT_PATH = path.join(ROOT, 'docs', 'ops', 'generated', 'weekly-ops-next-plan.md');
const RAW_OUTPUT_PATH = path.join(ROOT, 'docs', 'ops', 'generated', 'weekly-ops-llm-response.json');

type ExecutorType = 'human' | 'agent' | 'system';
type TaskStatus = 'planned' | 'in_progress' | 'done' | 'blocked' | 'carried_forward' | 'dropped';

interface LlmTask {
  id: string;
  title: string;
  owner: string;
  executor_type: ExecutorType;
  executor_id: string;
  status: TaskStatus;
  due: string;
  carry_forward_reason: string | null;
  source: string;
}

interface LlmPlan {
  focus: string[];
  tasks: LlmTask[];
  planning_notes: string[];
}

interface ReplanPacket {
  generated_at: string;
  prompt: string;
}

function ensureDir(filePath: string) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
}

function extractJsonBlock(text: string): string {
  const trimmed = text.trim();
  const fencedMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fencedMatch?.[1]) {
    return fencedMatch[1].trim();
  }

  const start = trimmed.indexOf('{');
  if (start === -1) {
    throw new Error('No JSON object found in model response.');
  }

  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let index = start; index < trimmed.length; index += 1) {
    const char = trimmed[index];
    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (char === '\\') {
        escaped = true;
      } else if (char === '"') {
        inString = false;
      }
      continue;
    }

    if (char === '"') {
      inString = true;
      continue;
    }

    if (char === '{') {
      depth += 1;
    } else if (char === '}') {
      depth -= 1;
      if (depth === 0) {
        return trimmed.slice(start, index + 1);
      }
    }
  }

  throw new Error('Could not extract a complete JSON object from model response.');
}

function getResponseText(payload: unknown): string {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Model response payload is empty.');
  }

  const record = payload as Record<string, unknown>;

  if (typeof record.output_text === 'string' && record.output_text.trim()) {
    return record.output_text;
  }

  const output = Array.isArray(record.output) ? record.output : [];
  const collected: string[] = [];

  for (const item of output) {
    if (!item || typeof item !== 'object') {
      continue;
    }
    const content = Array.isArray((item as Record<string, unknown>).content)
      ? ((item as Record<string, unknown>).content as Array<Record<string, unknown>>)
      : [];
    for (const block of content) {
      const text =
        typeof block.text === 'string'
          ? block.text
          : typeof block.output_text === 'string'
            ? block.output_text
            : null;
      if (text) {
        collected.push(text);
      }
    }
  }

  if (collected.length > 0) {
    return collected.join('\n');
  }

  const choices = Array.isArray(record.choices) ? record.choices : [];
  const messageText = choices
    .map((choice) => {
      if (!choice || typeof choice !== 'object') {
        return '';
      }
      const message = (choice as Record<string, unknown>).message;
      if (!message || typeof message !== 'object') {
        return '';
      }
      const content = (message as Record<string, unknown>).content;
      if (typeof content === 'string') {
        return content;
      }
      if (Array.isArray(content)) {
        return content
          .map((part) => (part && typeof part === 'object' && typeof (part as Record<string, unknown>).text === 'string' ? (part as Record<string, unknown>).text : ''))
          .join('\n');
      }
      return '';
    })
    .filter(Boolean)
    .join('\n');

  if (messageText) {
    return messageText;
  }

  throw new Error('Could not extract text from model response payload.');
}

function normalizeTask(task: Record<string, unknown>, index: number): LlmTask {
  const id = typeof task.id === 'string' && task.id.trim() ? task.id.trim() : `llm_task_${index + 1}`;
  const title = typeof task.title === 'string' && task.title.trim() ? task.title.trim() : `Untitled task ${index + 1}`;
  const owner = typeof task.owner === 'string' && task.owner.trim() ? task.owner.trim() : 'zerator';
  const executorType =
    task.executor_type === 'human' || task.executor_type === 'agent' || task.executor_type === 'system'
      ? task.executor_type
      : 'human';
  const executorId =
    typeof task.executor_id === 'string' && task.executor_id.trim() ? task.executor_id.trim() : owner;
  const status =
    task.status === 'planned' ||
    task.status === 'in_progress' ||
    task.status === 'done' ||
    task.status === 'blocked' ||
    task.status === 'carried_forward' ||
    task.status === 'dropped'
      ? task.status
      : 'planned';
  const due =
    typeof task.due === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(task.due.trim())
      ? task.due.trim()
      : new Date().toISOString().slice(0, 10);
  const carryForwardReason =
    typeof task.carry_forward_reason === 'string' && task.carry_forward_reason.trim()
      ? task.carry_forward_reason.trim()
      : null;
  const source = typeof task.source === 'string' && task.source.trim() ? task.source.trim() : 'ops_replan';

  return {
    id,
    title,
    owner,
    executor_type: executorType,
    executor_id: executorId,
    status,
    due,
    carry_forward_reason: carryForwardReason,
    source,
  };
}

function normalizePlan(raw: Record<string, unknown>): LlmPlan {
  const focus = Array.isArray(raw.focus) ? raw.focus.filter((item): item is string => typeof item === 'string' && item.trim().length > 0) : [];
  const planningNotes = Array.isArray(raw.planning_notes)
    ? raw.planning_notes.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
    : [];
  const tasks = Array.isArray(raw.tasks)
    ? raw.tasks.filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === 'object').slice(0, 5).map(normalizeTask)
    : [];

  if (tasks.length === 0) {
    throw new Error('Model response did not include any valid tasks.');
  }

  return {
    focus,
    tasks,
    planning_notes: planningNotes,
  };
}

function toMarkdown(plan: LlmPlan, model: string, baseUrl: string): string {
  return `# Weekly Ops Next Plan

- Generated at: ${new Date().toISOString()}
- Source: LLM-assisted replanning
- Model: \`${model}\`
- Base URL: \`${baseUrl}\`

## Focus

${plan.focus.length > 0 ? plan.focus.map((item) => `- ${item}`).join('\n') : '- No focus items returned.'}

## Proposed Tasks

| Task ID | Title | Owner | Executor Type | Executor | Status | Due | Carry Forward Reason | Source |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
${plan.tasks
  .map(
    (task) =>
      `| \`${task.id}\` | ${task.title} | ${task.owner} | ${task.executor_type} | ${task.executor_id} | ${task.status} | ${task.due} | ${task.carry_forward_reason ?? ''} | ${task.source} |`
  )
  .join('\n')}

## Planning Notes

${plan.planning_notes.length > 0 ? plan.planning_notes.map((item) => `- ${item}`).join('\n') : '- No planning notes returned.'}
`;
}

async function callModel(prompt: string, baseUrl: string, apiKey: string, model: string, apiStyle: string): Promise<unknown> {
  const normalizedBaseUrl = baseUrl.replace(/\/$/, '');
  const headers = {
    'content-type': 'application/json',
    authorization: `Bearer ${apiKey}`,
  };

  if (apiStyle === 'chat_completions') {
    const response = await fetch(`${normalizedBaseUrl}/chat/completions`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      throw new Error(`chat_completions request failed with ${response.status}: ${await response.text()}`);
    }

    return response.json();
  }

  const response = await fetch(`${normalizedBaseUrl}/responses`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model,
      input: prompt,
    }),
  });

  if (!response.ok) {
    throw new Error(`responses request failed with ${response.status}: ${await response.text()}`);
  }

  return response.json();
}

async function main() {
  const apiKey = process.env.OPS_REPLAN_API_KEY;
  if (!apiKey) {
    throw new Error('OPS_REPLAN_API_KEY is required.');
  }

  const baseUrl = process.env.OPS_REPLAN_BASE_URL ?? 'https://api.openai.com/v1';
  const model = process.env.OPS_REPLAN_MODEL ?? 'gpt-5-mini';
  const apiStyle = process.env.OPS_REPLAN_API_STYLE ?? 'responses';
  const packet = readJson<ReplanPacket>(INPUT_PATH);

  const rawResponse = await callModel(packet.prompt, baseUrl, apiKey, model, apiStyle);
  const responseText = getResponseText(rawResponse);
  const parsedPlan = normalizePlan(JSON.parse(extractJsonBlock(responseText)) as Record<string, unknown>);
  const outputPayload = {
    generated_at: new Date().toISOString(),
    packet_generated_at: packet.generated_at,
    model,
    base_url: baseUrl,
    api_style: apiStyle,
    ...parsedPlan,
  };

  ensureDir(JSON_OUTPUT_PATH);
  fs.writeFileSync(RAW_OUTPUT_PATH, `${JSON.stringify(rawResponse, null, 2)}\n`);
  fs.writeFileSync(JSON_OUTPUT_PATH, `${JSON.stringify(outputPayload, null, 2)}\n`);
  fs.writeFileSync(MARKDOWN_OUTPUT_PATH, `${toMarkdown(parsedPlan, model, baseUrl)}\n`);
  console.log(`Wrote LLM next plan to ${path.relative(ROOT, MARKDOWN_OUTPUT_PATH)}.`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
