import fs from 'fs';
import path from 'path';

const OVERRIDE_PATH = path.join(process.cwd(), 'data', 'governance', 'override-registry.json');

type OverrideStatus = 'active' | 'retired' | 'pending-review';

interface OverrideRecord {
  override_id?: string;
  scope?: string;
  reason?: string;
  value_changed?: string;
  date_added?: string;
  reviewer?: string;
  recheck_by?: string;
  status?: OverrideStatus;
}

function isIsoDate(value: string | undefined): boolean {
  if (!value) {
    return false;
  }

  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function main() {
  if (!fs.existsSync(OVERRIDE_PATH)) {
    console.error('Missing override registry:', OVERRIDE_PATH);
    process.exit(1);
  }

  const records = JSON.parse(fs.readFileSync(OVERRIDE_PATH, 'utf8')) as OverrideRecord[];
  const allowedStatuses = new Set<OverrideStatus>(['active', 'retired', 'pending-review']);
  const ids = new Set<string>();
  const problems: string[] = [];

  for (const record of records) {
    if (!record.override_id) {
      problems.push('missing override_id');
    } else if (ids.has(record.override_id)) {
      problems.push(`duplicate override_id: ${record.override_id}`);
    } else {
      ids.add(record.override_id);
    }

    if (!record.scope) {
      problems.push(`missing scope on ${record.override_id || '(unknown)'}`);
    }

    if (!record.reason) {
      problems.push(`missing reason on ${record.override_id || '(unknown)'}`);
    }

    if (!record.value_changed) {
      problems.push(`missing value_changed on ${record.override_id || '(unknown)'}`);
    }

    if (!record.reviewer) {
      problems.push(`missing reviewer on ${record.override_id || '(unknown)'}`);
    }

    if (!isIsoDate(record.date_added)) {
      problems.push(`invalid date_added on ${record.override_id || '(unknown)'}`);
    }

    if (!isIsoDate(record.recheck_by)) {
      problems.push(`invalid recheck_by on ${record.override_id || '(unknown)'}`);
    }

    if (!record.status || !allowedStatuses.has(record.status)) {
      problems.push(`invalid status on ${record.override_id || '(unknown)'}`);
    }

    if (
      record.status === 'active' &&
      record.recheck_by &&
      new Date(record.recheck_by) < new Date()
    ) {
      problems.push(`active override past recheck date: ${record.override_id || '(unknown)'}`);
    }
  }

  if (problems.length > 0) {
    console.error('Override registry validation failed.');
    for (const problem of problems) {
      console.error('-', problem);
    }
    process.exit(1);
  }

  console.log(`Override registry validation passed for ${records.length} record(s).`);
}

main();
