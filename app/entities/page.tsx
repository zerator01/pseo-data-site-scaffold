import { EntityCard } from '@/components/EntityCard';
import { getEntityIndex } from '@/lib/data/entities';
import { PROJECT_CONFIG } from '@/lib/site';

export default function EntitiesPage() {
  const entities = getEntityIndex();

  return (
    <main className="sectionStack">
      <section className="panel">
        <div className="eyebrow">{PROJECT_CONFIG.entityDirectoryLabel}</div>
        <h1>{PROJECT_CONFIG.entityPlural}</h1>
        <p className="lede">
          This directory is the simplest crawl-entry surface for your main detail family. It
          should complement, not replace, category and ranking hubs.
        </p>
      </section>

      <section className="panel">
        <div className="grid">
          {entities.map((entity) => (
            <EntityCard key={entity.slug} entity={entity} />
          ))}
        </div>
      </section>
    </main>
  );
}
