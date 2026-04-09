import Link from 'next/link';
import type { EntityIndexItem } from '@/lib/data/entities';
import { PROJECT_CONFIG, ROUTES } from '@/lib/site';

export function EntityCard({ entity }: { entity: EntityIndexItem }) {
  return (
    <Link href={ROUTES.entityDetail(entity.slug)} className="card">
      <strong>{entity.name}</strong>
      <span>
        {PROJECT_CONFIG.categorySingular}: {entity.categoryLabel}
      </span>
      <span>Score {entity.score}</span>
      <span>
        {entity.state} · Pop. {entity.population.toLocaleString('en-US')}
      </span>
    </Link>
  );
}
