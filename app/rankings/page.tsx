import Link from 'next/link';
import { RANKING_CATEGORIES } from '@/lib/data/entities';
import {
  getRankingHubSectionOrder,
  renderOrderedSections,
} from '@/lib/page-sections';
import { PROJECT_CONFIG, ROUTES } from '@/lib/site';

export default function RankingsHubPage() {
  const sections = {
    hero: (
      <section className="panel" key="hero">
        <div className="eyebrow">Rankings hub</div>
        <h1>Ranking families</h1>
        <p className="lede">
          {PROJECT_CONFIG.siteName} keeps user-facing representative rankings separate from full
          raw rankings. That distinction should exist by default in data-heavy pSEO sites.
        </p>
      </section>
    ),
    ranking_grid: (
      <section className="panel" key="ranking_grid">
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
  } as const;

  return (
    <main className="sectionStack">
      {renderOrderedSections(getRankingHubSectionOrder(), sections)}
    </main>
  );
}
