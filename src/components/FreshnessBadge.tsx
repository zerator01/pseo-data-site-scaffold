import { getDataUpdateLabel, getPrimaryDatasetYear } from '@/lib/freshness';

export function FreshnessBadge() {
  return (
    <div className="badgeRow">
      <span className="badge">Updated {getDataUpdateLabel()}</span>
      <span className="badge subtle">Dataset year {getPrimaryDatasetYear()}</span>
    </div>
  );
}
