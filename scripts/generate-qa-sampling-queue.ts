import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const ENTITY_PATH = path.join(ROOT, 'data', 'processed', 'entities.json');
const JSON_OUTPUT_PATH = path.join(ROOT, 'docs', 'ops', 'generated', 'qa-sampling-queue.json');
const MARKDOWN_OUTPUT_PATH = path.join(ROOT, 'docs', 'ops', 'generated', 'qa-sampling-queue.md');

interface EntityRecord {
  slug: string;
  name: string;
  category: string;
  categoryLabel: string;
  score: number;
  population: number;
}

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
}

function ensureDir(filePath: string) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function uniqueBySlug(records: EntityRecord[]): EntityRecord[] {
  const seen = new Set<string>();
  return records.filter((record) => {
    if (seen.has(record.slug)) {
      return false;
    }

    seen.add(record.slug);
    return true;
  });
}

function main() {
  const entities = readJson<EntityRecord[]>(ENTITY_PATH);
  const sorted = [...entities].sort((left, right) => right.score - left.score);
  const median = sorted[Math.floor(sorted.length / 2)];
  const categoryCoverage = new Map<string, EntityRecord>();

  for (const entity of sorted) {
    if (!categoryCoverage.has(entity.category)) {
      categoryCoverage.set(entity.category, entity);
    }
  }

  const queue = uniqueBySlug([
    sorted[0],
    median,
    sorted[sorted.length - 1],
    ...categoryCoverage.values(),
  ]).map((entity) => ({
    slug: entity.slug,
    name: entity.name,
    category: entity.category,
    categoryLabel: entity.categoryLabel,
    score: entity.score,
    population: entity.population,
    reviewFocus:
      entity === sorted[0]
        ? 'top-ranked narrative check'
        : entity === sorted[sorted.length - 1]
          ? 'edge-case and low-confidence review'
          : entity === median
            ? 'median-page readability check'
            : 'category coverage and next-step navigation',
  }));

  ensureDir(JSON_OUTPUT_PATH);
  fs.writeFileSync(JSON_OUTPUT_PATH, `${JSON.stringify(queue, null, 2)}\n`);

  const markdown = `# QA Sampling Queue

- Generated at: ${new Date().toISOString()}
- Review count: ${queue.length}

| Entity | Slug | Category | Score | Review Focus |
| --- | --- | --- | --- | --- |
${queue
  .map(
    (item) =>
      `| ${item.name} | \`${item.slug}\` | ${item.categoryLabel} | ${item.score} | ${item.reviewFocus} |`
  )
  .join('\n')}
`;

  fs.writeFileSync(MARKDOWN_OUTPUT_PATH, `${markdown}\n`);
  console.log(`Wrote QA sampling queue to ${path.relative(ROOT, MARKDOWN_OUTPUT_PATH)}.`);
}

main();
