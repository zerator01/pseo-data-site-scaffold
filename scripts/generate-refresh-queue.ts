import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const SOURCE_REGISTRY_PATH = path.join(ROOT, 'data', 'source-registry.json');
const JSON_OUTPUT_PATH = path.join(ROOT, 'docs', 'ops', 'generated', 'data-refresh-queue.json');
const MARKDOWN_OUTPUT_PATH = path.join(ROOT, 'docs', 'ops', 'generated', 'data-refresh-queue.md');

type RefreshCadence = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'ad_hoc';
type RefreshStatus = 'fresh' | 'due' | 'overdue' | 'blocked' | 'review_needed';
type RefreshMode = 'manual' | 'semi_manual' | 'automated';

interface SourceRegistryEntry {
  source_key: string;
  site_key: string;
  dataset: string;
  display_name: string;
  owner: string;
  coverage: string;
  source_type: 'sample' | 'public_data' | 'editorial' | 'governance';
  refresh_cadence: RefreshCadence;
  refresh_mode: RefreshMode;
  status?: RefreshStatus;
  last_refreshed_at?: string | null;
  next_refresh_due_at?: string | null;
  stale_after_days?: number | null;
  review_required: boolean;
  blocking_checks: string[];
  notes?: string;
}

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
}

function writeJson(filePath: string, value: unknown) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function writeMarkdown(filePath: string, value: string) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${value.trim()}\n`);
}

function cadenceDays(cadence: RefreshCadence) {
  switch (cadence) {
    case 'daily':
      return 1;
    case 'weekly':
      return 7;
    case 'monthly':
      return 30;
    case 'quarterly':
      return 90;
    case 'ad_hoc':
    default:
      return null;
  }
}

function startOfDay(date: Date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

function daysUntil(dateString: string | null | undefined) {
  if (!dateString) {
    return null;
  }

  const today = startOfDay(new Date());
  const target = startOfDay(new Date(dateString));
  return Math.round((target.getTime() - today.getTime()) / 86400000);
}

function resolveDueDate(entry: SourceRegistryEntry) {
  if (entry.next_refresh_due_at) {
    return entry.next_refresh_due_at;
  }

  if (!entry.last_refreshed_at) {
    return null;
  }

  const intervalDays = cadenceDays(entry.refresh_cadence);

  if (intervalDays === null) {
    return null;
  }

  return addDays(new Date(entry.last_refreshed_at), intervalDays).toISOString();
}

function resolveStatus(entry: SourceRegistryEntry, dueAt: string | null) {
  if (entry.status === 'blocked' || entry.status === 'review_needed') {
    return entry.status;
  }

  if (!dueAt || entry.refresh_cadence === 'ad_hoc') {
    return entry.status ?? 'fresh';
  }

  const remainingDays = daysUntil(dueAt);

  if (remainingDays === null) {
    return entry.status ?? 'fresh';
  }

  if (remainingDays < 0) {
    return 'overdue';
  }

  if (remainingDays <= 3) {
    return 'due';
  }

  return 'fresh';
}

function formatDate(value: string | null) {
  if (!value) {
    return 'n/a';
  }

  return value.slice(0, 10);
}

function statusWeight(status: RefreshStatus) {
  switch (status) {
    case 'overdue':
      return 0;
    case 'due':
      return 1;
    case 'blocked':
      return 2;
    case 'review_needed':
      return 3;
    case 'fresh':
    default:
      return 4;
  }
}

function main() {
  if (!fs.existsSync(SOURCE_REGISTRY_PATH)) {
    console.error(`Missing source registry: ${SOURCE_REGISTRY_PATH}`);
    process.exit(1);
  }

  const entries = readJson<SourceRegistryEntry[]>(SOURCE_REGISTRY_PATH);

  const queue = entries
    .map((entry) => {
      const nextRefreshDueAt = resolveDueDate(entry);
      const resolvedStatus = resolveStatus(entry, nextRefreshDueAt);
      const remainingDays = daysUntil(nextRefreshDueAt);

      return {
        source_key: entry.source_key,
        site_key: entry.site_key,
        dataset: entry.dataset,
        display_name: entry.display_name,
        owner: entry.owner,
        coverage: entry.coverage,
        source_type: entry.source_type,
        refresh_cadence: entry.refresh_cadence,
        refresh_mode: entry.refresh_mode,
        status: resolvedStatus,
        last_refreshed_at: entry.last_refreshed_at ?? null,
        next_refresh_due_at: nextRefreshDueAt,
        days_until_due: remainingDays,
        review_required: entry.review_required,
        blocking_checks: entry.blocking_checks,
        notes: entry.notes ?? '',
      };
    })
    .sort((left, right) => {
      const statusDiff = statusWeight(left.status) - statusWeight(right.status);

      if (statusDiff !== 0) {
        return statusDiff;
      }

      return (left.days_until_due ?? 9999) - (right.days_until_due ?? 9999);
    });

  const summary = {
    generated_at: new Date().toISOString(),
    total_sources: queue.length,
    overdue_count: queue.filter((item) => item.status === 'overdue').length,
    due_count: queue.filter((item) => item.status === 'due').length,
    blocked_count: queue.filter((item) => item.status === 'blocked').length,
    review_needed_count: queue.filter((item) => item.status === 'review_needed').length,
    fresh_count: queue.filter((item) => item.status === 'fresh').length,
  };

  writeJson(JSON_OUTPUT_PATH, {
    summary,
    queue,
  });

  writeMarkdown(
    MARKDOWN_OUTPUT_PATH,
    [
      '# Data Refresh Queue',
      '',
      `- Generated at: ${summary.generated_at}`,
      `- Total sources: ${summary.total_sources}`,
      `- Overdue: ${summary.overdue_count}`,
      `- Due soon: ${summary.due_count}`,
      `- Blocked: ${summary.blocked_count}`,
      `- Review needed: ${summary.review_needed_count}`,
      '',
      '| Source | Dataset | Status | Mode | Due | Last refresh | Owner | Notes |',
      '| --- | --- | --- | --- | --- | --- | --- | --- |',
      ...queue.map(
        (item) =>
          `| ${item.display_name} | \`${item.dataset}\` | ${item.status} | ${item.refresh_mode} | ${formatDate(item.next_refresh_due_at)} | ${formatDate(item.last_refreshed_at)} | ${item.owner} | ${item.notes || 'n/a'} |`
      ),
      '',
      '## Operator Use',
      '',
      '- Work overdue and due sources first.',
      '- Treat `blocked` and `review_needed` as human-decision states, not silent automation retries.',
      '- After a manual refresh, update `data/source-registry.json` and record the run under `state/data-refresh-runs/`.',
      '- After review, record the decision under `state/data-refresh-approvals/` before treating the refresh as publish-ready.',
    ].join('\n')
  );

  console.log(`Wrote data refresh queue for ${summary.total_sources} source(s).`);
}

main();
