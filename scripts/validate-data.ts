import fs from 'fs';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'data', 'processed', 'entities.json');

interface EntityRecord {
  id?: string;
  slug?: string;
}

function main() {
  if (!fs.existsSync(DATA_PATH)) {
    console.error('Missing processed dataset:', DATA_PATH);
    process.exit(1);
  }

  const raw = JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));
  const items: EntityRecord[] = Array.isArray(raw) ? raw : raw.entities || [];

  let errors = 0;
  const slugs = new Set<string>();

  for (const item of items) {
    if (!item.id) {
      console.error('Missing id on record');
      errors++;
    }

    if (!item.slug) {
      console.error('Missing slug on record', item.id || '(unknown)');
      errors++;
      continue;
    }

    if (slugs.has(item.slug)) {
      console.error('Duplicate slug:', item.slug);
      errors++;
    }

    slugs.add(item.slug);
  }

  if (errors > 0) {
    console.error(`Validation failed with ${errors} error(s).`);
    process.exit(1);
  }

  console.log(`Validation passed for ${items.length} records.`);
}

main();
