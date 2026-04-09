import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
  getRankingByCategory,
  RANKING_CATEGORIES,
} from '@/lib/data/entities';
import {
  getRankingDetailSectionOrder,
  renderOrderedSections,
} from '@/lib/page-sections';
import { ROUTES } from '@/lib/site';

export const dynamicParams = false;

export function generateStaticParams() {
  return RANKING_CATEGORIES.map((ranking) => ({ category: ranking.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { category: string };
}): Metadata {
  const ranking = RANKING_CATEGORIES.find((item) => item.slug === params.category);

  if (!ranking) {
    return {};
  }

  return {
    title: ranking.name,
    description: ranking.description,
  };
}

export default function RankingDetailPage({
  params,
}: {
  params: { category: string };
}) {
  const ranking = RANKING_CATEGORIES.find((item) => item.slug === params.category);

  if (!ranking) {
    notFound();
  }

  const items = getRankingByCategory(ranking.slug);
  const sections = {
    hero: (
      <section className="panel" key="hero">
        <div className="eyebrow">{ranking.name}</div>
        <h1>{ranking.name}</h1>
        <p className="lede">{ranking.description}</p>
      </section>
    ),
    ranking_table: (
      <section className="panel" key="ranking_table">
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Category</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.slug}>
                <td>{index + 1}</td>
                <td>
                  <Link href={ROUTES.entityDetail(item.slug)}>{item.name}</Link>
                </td>
                <td>{item.categoryLabel}</td>
                <td>{item.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    ),
  } as const;

  return (
    <main className="sectionStack">
      <nav className="crumbs">
        <Link href="/">Home</Link>
        <span>/</span>
        <Link href={ROUTES.rankings}>Rankings</Link>
        <span>/</span>
        <span>{ranking.name}</span>
      </nav>

      {renderOrderedSections(getRankingDetailSectionOrder(), sections)}
    </main>
  );
}
