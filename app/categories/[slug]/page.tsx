import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { EntityCard } from '@/components/EntityCard';
import { NextSteps } from '@/components/NextSteps';
import { getCategoryHubBySlug, getCategoryHubItems } from '@/lib/data/entities';
import {
  getCategoryHubNextSteps,
  getCategoryHubSectionOrder,
  renderOrderedSections,
} from '@/lib/page-sections';
import { PROJECT_CONFIG, ROUTES } from '@/lib/site';

export const dynamicParams = false;

export function generateStaticParams() {
  return getCategoryHubItems().map((group) => ({ slug: group.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const group = getCategoryHubBySlug(params.slug);

  if (!group) {
    return {};
  }

  return {
    title: `${group.label} hub`,
    description: `Sample anti-orphan hub for ${group.label}.`,
  };
}

export default function CategoryHubPage({
  params,
}: {
  params: { slug: string };
}) {
  const group = getCategoryHubBySlug(params.slug);

  if (!group) {
    notFound();
  }

  const sections = {
    hero: (
      <section className="panel" key="hero">
        <div className="eyebrow">{PROJECT_CONFIG.categorySingular} hub</div>
        <h1>{group.label}</h1>
        <p className="lede">
          This hub demonstrates the anti-orphan pattern. Long-tail detail pages should have a
          deliberate parent surface like this instead of relying on sitemap discovery alone.
        </p>
      </section>
    ),
    entity_grid: (
      <section className="panel" key="entity_grid">
        <div className="grid">
          {group.items.map((item) => (
            <EntityCard key={item.slug} entity={item} />
          ))}
        </div>
      </section>
    ),
    next_steps: <NextSteps key="next_steps" items={getCategoryHubNextSteps()} />,
  } as const;

  return (
    <main className="sectionStack">
      <nav className="crumbs">
        <Link href="/">Home</Link>
        <span>/</span>
        <span>{group.label}</span>
      </nav>

      {renderOrderedSections(getCategoryHubSectionOrder(), sections)}
    </main>
  );
}
