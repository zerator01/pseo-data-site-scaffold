import Link from 'next/link';
import { EntityCard } from '@/components/EntityCard';
import { FreshnessBadge } from '@/components/FreshnessBadge';
import { NextSteps } from '@/components/NextSteps';
import {
  getCategoryHubItems,
  getRepresentativeEntities,
  RANKING_CATEGORIES,
} from '@/lib/data/entities';
import {
  getHomeNavigationItems,
  getHomeNextSteps,
  getHomeSectionOrder,
  renderOrderedSections,
} from '@/lib/page-sections';
import { PROJECT_CONFIG, ROUTES } from '@/lib/site';

export default function HomePage() {
  const featured = getRepresentativeEntities(3);
  const categoryHubs = getCategoryHubItems();
  const navigationItems = getHomeNavigationItems();
  const sections = {
    hero: (
      <section className="hero" key="hero">
        <div className="eyebrow">Data-led pSEO starter</div>
        <h1>{PROJECT_CONFIG.heroTitle}</h1>
        <p className="lede">{PROJECT_CONFIG.heroDescription}</p>
        <FreshnessBadge />
        <div className="buttonRow">
          <Link href={ROUTES.entityDirectory} className="button">
            Browse {PROJECT_CONFIG.entityPlural.toLowerCase()}
          </Link>
          <Link href={ROUTES.methodology} className="buttonGhost">
            Read the methodology
          </Link>
        </div>
      </section>
    ),
    navigation_matrix: (
      <section className="panel" key="navigation_matrix">
        <h2>Home Navigation Matrix</h2>
        <p className="lede">
          Your home page should route users into entity detail, hub, ranking, and trust
          surfaces. It should not just sell the idea of the product.
        </p>
        <div className="grid" style={{ marginTop: 20 }}>
          {navigationItems.map((item) => (
            <Link key={item.href} href={item.href} className="card">
              <strong>{item.title}</strong>
              <span>{item.description}</span>
            </Link>
          ))}
        </div>
      </section>
    ),
    category_hubs: (
      <section className="panel" key="category_hubs">
        <h2>{PROJECT_CONFIG.categoryPlural}</h2>
        <div className="list">
          {categoryHubs.map((hub) => (
            <Link key={hub.slug} href={ROUTES.categoryHub(hub.slug)} className="listItem">
              <strong>{hub.label}</strong>
              <span>{hub.items.length} entities</span>
            </Link>
          ))}
        </div>
      </section>
    ),
    featured_entities: (
      <section className="panel" key="featured_entities">
        <h2>Featured Representative {PROJECT_CONFIG.entityPlural}</h2>
        <div className="grid">
          {featured.map((entity) => (
            <EntityCard key={entity.slug} entity={entity} />
          ))}
        </div>
      </section>
    ),
    ranking_families: (
      <section className="panel" key="ranking_families">
        <h2>Ranking Families</h2>
        <div className="grid">
          {RANKING_CATEGORIES.map((ranking) => (
            <Link key={ranking.slug} href={`${ROUTES.rankings}${ranking.slug}/`} className="card">
              <strong>{ranking.name}</strong>
              <span>{ranking.description}</span>
            </Link>
          ))}
        </div>
      </section>
    ),
    next_steps: <NextSteps key="next_steps" items={getHomeNextSteps()} />,
  } as const;

  return (
    <main className="sectionStack">
      {renderOrderedSections(getHomeSectionOrder(), sections)}
    </main>
  );
}
