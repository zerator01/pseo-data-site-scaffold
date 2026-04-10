import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const ENTITY_PATH = path.join(ROOT, 'data', 'processed', 'entities.json');
const SNAPSHOT_PATH = path.join(ROOT, 'docs', 'ops', 'generated', 'page-narrative-snapshot.json');
const JSON_OUTPUT_PATH = path.join(ROOT, 'docs', 'ops', 'generated', 'page-narrative-diff.json');
const MARKDOWN_OUTPUT_PATH = path.join(ROOT, 'docs', 'ops', 'generated', 'page-narrative-diff.md');

interface EntityRecord {
  slug: string;
  name: string;
  category: string;
  categoryLabel: string;
  score: number;
  summary: string;
  faq?: Array<{ question: string; answer: string }>;
}

interface NarrativeSnapshotItem {
  slug: string;
  name: string;
  score: number;
  summary: string;
  faq: Array<{ question: string; answer: string }>;
  topComparisonSlugs: string[];
}

interface NarrativeSnapshot {
  generated_at: string;
  entity_count: number;
  items: NarrativeSnapshotItem[];
}

interface NarrativeDiffItem {
  slug: string;
  name: string;
  changes: string[];
}

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
}

function ensureDir(filePath: string) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function readPreviousSnapshot(): NarrativeSnapshot | null {
  if (!fs.existsSync(SNAPSHOT_PATH)) {
    return null;
  }

  return readJson<NarrativeSnapshot>(SNAPSHOT_PATH);
}

function getTopComparisonSlugs(entity: EntityRecord, entities: EntityRecord[], limit = 3) {
  const sameCategory = entities.filter(
    (item) => item.slug !== entity.slug && item.category === entity.category
  );
  const fallbackPool =
    sameCategory.length > 0 ? sameCategory : entities.filter((item) => item.slug !== entity.slug);

  return [...fallbackPool]
    .sort((left, right) => Math.abs(left.score - entity.score) - Math.abs(right.score - entity.score))
    .slice(0, limit)
    .map((item) => item.slug);
}

function normalizeFaq(faq: NarrativeSnapshotItem['faq']) {
  return faq.map((item) => `${item.question} -> ${item.answer}`).join('\n');
}

function compareSnapshots(
  previous: NarrativeSnapshot | null,
  current: NarrativeSnapshot
): NarrativeDiffItem[] {
  if (!previous) {
    return current.items.map((item) => ({
      slug: item.slug,
      name: item.name,
      changes: ['No previous snapshot found. Treat this as the baseline capture.'],
    }));
  }

  const previousBySlug = new Map(previous.items.map((item) => [item.slug, item]));
  const diffs: NarrativeDiffItem[] = [];

  for (const item of current.items) {
    const previousItem = previousBySlug.get(item.slug);

    if (!previousItem) {
      diffs.push({
        slug: item.slug,
        name: item.name,
        changes: ['Entity is new in the current snapshot.'],
      });
      continue;
    }

    const changes: string[] = [];

    if (previousItem.summary !== item.summary) {
      changes.push(`Summary changed.`);
    }

    if (normalizeFaq(previousItem.faq) !== normalizeFaq(item.faq)) {
      changes.push(`Visible FAQ content changed.`);
    }

    if (previousItem.topComparisonSlugs.join(',') !== item.topComparisonSlugs.join(',')) {
      changes.push(
        `Top comparison links changed from [${previousItem.topComparisonSlugs.join(', ')}] to [${item.topComparisonSlugs.join(', ')}].`
      );
    }

    if (changes.length > 0) {
      diffs.push({
        slug: item.slug,
        name: item.name,
        changes,
      });
    }
  }

  for (const item of previous.items) {
    if (!current.items.find((currentItem) => currentItem.slug === item.slug)) {
      diffs.push({
        slug: item.slug,
        name: item.name,
        changes: ['Entity is missing from the current snapshot.'],
      });
    }
  }

  return diffs;
}

function main() {
  const entities = readJson<EntityRecord[]>(ENTITY_PATH);
  const previousSnapshot = readPreviousSnapshot();
  const currentSnapshot: NarrativeSnapshot = {
    generated_at: new Date().toISOString(),
    entity_count: entities.length,
    items: entities
      .map((entity) => ({
        slug: entity.slug,
        name: entity.name,
        score: entity.score,
        summary: entity.summary,
        faq: entity.faq ?? [],
        topComparisonSlugs: getTopComparisonSlugs(entity, entities),
      }))
      .sort((left, right) => right.score - left.score),
  };

  const diffs = compareSnapshots(previousSnapshot, currentSnapshot);
  const outputJson = {
    generated_at: currentSnapshot.generated_at,
    compared_to: previousSnapshot?.generated_at ?? null,
    entity_count: currentSnapshot.entity_count,
    changed_count: diffs.length,
    diffs,
  };

  const markdown = `# Page Narrative Diff

- Generated at: ${currentSnapshot.generated_at}
- Compared to previous snapshot: ${previousSnapshot?.generated_at ?? 'none'}
- Entity count: ${currentSnapshot.entity_count}
- Changed entities: ${diffs.length}

## Review Guidance

- Review \`summary\`, visible FAQ content, and top comparison links before publish.
- Keep publish approval manual when these diffs touch trust framing or methodology-adjacent copy.

## Changed Entities

${
  diffs.length > 0
    ? diffs
        .map(
          (item) => `### ${item.name} (\`${item.slug}\`)\n\n${item.changes.map((change) => `- ${change}`).join('\n')}`
        )
        .join('\n\n')
    : '- No visible narrative changes detected against the previous snapshot.'
}
`;

  ensureDir(SNAPSHOT_PATH);
  fs.writeFileSync(SNAPSHOT_PATH, `${JSON.stringify(currentSnapshot, null, 2)}\n`);
  fs.writeFileSync(JSON_OUTPUT_PATH, `${JSON.stringify(outputJson, null, 2)}\n`);
  fs.writeFileSync(MARKDOWN_OUTPUT_PATH, `${markdown}\n`);
  console.log(`Wrote page narrative diff to ${path.relative(ROOT, MARKDOWN_OUTPUT_PATH)}.`);
}

main();
