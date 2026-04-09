import fs from 'fs';
import path from 'path';

const MANIFEST_PATH = path.join(process.cwd(), 'data', 'data-manifest.json');

interface DataManifest {
  core_dataset: {
    year: string;
    fetched_at: string;
    source: string;
  };
  secondary_dataset?: {
    latest_date?: string;
    fetched_at?: string;
    source?: string;
  };
  last_build: string;
}

let manifestCache: DataManifest | null = null;

function getManifest(): DataManifest {
  if (manifestCache) {
    return manifestCache;
  }

  const raw = fs.readFileSync(MANIFEST_PATH, 'utf-8');
  manifestCache = JSON.parse(raw) as DataManifest;
  return manifestCache;
}

export function getDataUpdateLabel(): string {
  const buildDate = new Date(getManifest().last_build);
  return buildDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

export function getLastModifiedDate(): Date {
  return new Date(getManifest().core_dataset.fetched_at);
}

export function getPrimaryDatasetYear(): string {
  return getManifest().core_dataset.year;
}
