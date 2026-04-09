/**
 * Optional data access pattern for large JSON datasets.
 *
 * Use this when direct static imports make builds heavy or unstable.
 * Prefer a lightweight index file first. Use this layer when detail
 * records are still too large for regular import paths.
 */

import fs from 'fs';
import path from 'path';

function lazyLoad<T>(filename: string, fallback: T): () => T {
  let cached: T | null = null;

  return () => {
    if (cached === null) {
      const filePath = path.join(process.cwd(), 'data', filename);

      try {
        cached = JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
      } catch (error) {
        console.error(`[data] failed to load ${filename}`, error);
        cached = fallback;
      }
    }

    return cached;
  };
}

export interface EntityIndexItem {
  slug: string;
  label: string;
}

export interface EntityDetail extends EntityIndexItem {
  summary?: string;
}

const _entityIndex = lazyLoad<EntityIndexItem[]>('entity-index.json', []);
const _entityDetails = lazyLoad<EntityDetail[]>('entities.json', []);

let _entityBySlug: Map<string, EntityDetail> | null = null;

function entityBySlug() {
  if (_entityBySlug === null) {
    _entityBySlug = new Map(_entityDetails().map((item) => [item.slug, item]));
  }

  return _entityBySlug;
}

export function getEntityIndex(): EntityIndexItem[] {
  return _entityIndex();
}

export function getEntityBySlug(slug: string): EntityDetail | undefined {
  return entityBySlug().get(slug);
}
