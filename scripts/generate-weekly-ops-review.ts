import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const PLAN_PATH = path.join(ROOT, 'docs', 'ops', 'generated', 'weekly-ops-plan.md');
const EXECUTION_LOG_PATH = path.join(ROOT, 'docs', 'ops', 'ops-execution-log.md');
const OUTPUT_PATH = path.join(ROOT, 'docs', 'ops', 'generated', 'weekly-ops-review.md');

function ensureDir(filePath: string) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function readFileSafe(filePath: string): string {
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : '';
}

function parsePlanTasks(plan: string): string[] {
  return plan
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('- [ ] '))
    .map((line) => line.replace('- [ ] ', '').trim());
}

function parseExecutionLog(log: string) {
  const completed = new Set<string>();
  const pending = new Set<string>();

  for (const rawLine of log.split('\n')) {
    const line = rawLine.trim();
    if (line.startsWith('- [x] ') || line.startsWith('- [X] ')) {
      completed.add(line.slice(6).trim());
    } else if (line.startsWith('- [ ] ')) {
      pending.add(line.slice(6).trim());
    }
  }

  return { completed, pending };
}

function main() {
  const plan = readFileSafe(PLAN_PATH);
  const log = readFileSafe(EXECUTION_LOG_PATH);
  const planTasks = parsePlanTasks(plan);
  const execution = parseExecutionLog(log);

  const completedPlanned = planTasks.filter((task) => execution.completed.has(task));
  const openPlanned = planTasks.filter((task) => !execution.completed.has(task));
  const extraCompleted = [...execution.completed].filter((task) => !planTasks.includes(task));

  const completionRate =
    planTasks.length === 0 ? 0 : Math.round((completedPlanned.length / planTasks.length) * 100);

  const content = `# Weekly Ops Review

- Generated at: ${new Date().toISOString()}
- Planned task count: ${planTasks.length}
- Completed planned tasks: ${completedPlanned.length}
- Completion rate: ${completionRate}%

## Completed

${completedPlanned.length > 0 ? completedPlanned.map((task) => `- ${task}`).join('\n') : '- No planned tasks marked complete yet.'}

## Still Open

${openPlanned.length > 0 ? openPlanned.map((task) => `- ${task}`).join('\n') : '- All planned tasks are marked complete.'}

## Extra Completed Work

${extraCompleted.length > 0 ? extraCompleted.map((task) => `- ${task}`).join('\n') : '- No extra completed tasks recorded outside the plan.'}

## Next-Cycle Prompt

- Carry open tasks forward only if they still matter this week
- Convert repeated manual work into backlog items in \`docs/ops/automation-backlog.md\`
- Use this review as input when regenerating \`docs/ops/generated/weekly-ops-plan.md\`
`;

  ensureDir(OUTPUT_PATH);
  fs.writeFileSync(OUTPUT_PATH, `${content}\n`);
  console.log(`Wrote weekly ops review to ${path.relative(ROOT, OUTPUT_PATH)}.`);
}

main();
