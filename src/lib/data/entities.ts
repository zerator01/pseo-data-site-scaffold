import fs from 'fs';
import path from 'path';
import { RANKING_FAMILIES } from '@/lib/site';

export interface EntityIndexItem {
  id: string;
  slug: string;
  name: string;
  category: string;
  categoryLabel: string;
  score: number;
  population: number;
  state: string;
}

export interface EntityDetail extends EntityIndexItem {
  metrics: Record<string, number>;
  summary: string;
  faq: Array<{ question: string; answer: string }>;
}

const DATA_DIR = path.join(process.cwd(), 'data', 'processed');

function loadJson<T>(filename: string): T {
  const filePath = path.join(DATA_DIR, filename);
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
}

let entityIndexCache: EntityIndexItem[] | null = null;
let entityDetailCache: EntityDetail[] | null = null;
let entityBySlugCache: Map<string, EntityDetail> | null = null;

export function getEntityIndex(): EntityIndexItem[] {
  if (entityIndexCache === null) {
    entityIndexCache = loadJson<EntityIndexItem[]>('entity-index.json');
  }

  return entityIndexCache;
}

export function getAllEntities(): EntityDetail[] {
  if (entityDetailCache === null) {
    entityDetailCache = loadJson<EntityDetail[]>('entities.json');
  }

  return entityDetailCache;
}

export function getEntityBySlug(slug: string): EntityDetail | undefined {
  if (entityBySlugCache === null) {
    entityBySlugCache = new Map(getAllEntities().map((item) => [item.slug, item]));
  }

  return entityBySlugCache.get(slug);
}

export function getRepresentativeEntities(limit = 10): EntityIndexItem[] {
  return [...getEntityIndex()]
    .filter((item) => item.population >= 150000)
    .sort((left, right) => right.score - left.score)
    .slice(0, limit);
}

export function getCategoryHubItems() {
  const groups = new Map<
    string,
    { slug: string; label: string; items: EntityIndexItem[] }
  >();

  for (const item of getEntityIndex()) {
    const existing = groups.get(item.category);

    if (existing) {
      existing.items.push(item);
      continue;
    }

    groups.set(item.category, {
      slug: item.category,
      label: item.categoryLabel,
      items: [item],
    });
  }

  return [...groups.values()].sort((left, right) => right.items.length - left.items.length);
}

export function getCategoryHubBySlug(slug: string) {
  return getCategoryHubItems().find((group) => group.slug === slug);
}

export function getRelatedEntities(slug: string, limit = 3): EntityIndexItem[] {
  const entity = getEntityBySlug(slug);

  if (!entity) {
    return [];
  }

  return getEntityIndex()
    .filter((item) => item.slug !== slug && item.category === entity.category)
    .sort((left, right) => Math.abs(right.score - entity.score) - Math.abs(left.score - entity.score))
    .slice(0, limit);
}

export const RANKING_CATEGORIES = RANKING_FAMILIES;

export function getRankingByCategory(slug: string): EntityIndexItem[] {
  if (slug === 'representative') {
    return getRepresentativeEntities(50);
  }

  if (slug === 'full') {
    return [...getEntityIndex()].sort((left, right) => right.score - left.score);
  }

  return [];
}
