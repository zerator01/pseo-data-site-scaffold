import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { JsonLd } from '@/components/JsonLd';
import { NextSteps } from '@/components/NextSteps';
import {
  getEntityBySlug,
  getEntityIndex,
  getRelatedEntities,
} from '@/lib/data/entities';
import {
  generateBreadcrumbSchema,
  generateFAQSchema,
} from '@/lib/seo/schema';
import {
  getEntityDetailNextSteps,
  getEntityDetailSectionOrder,
  renderOrderedSections,
} from '@/lib/page-sections';
import { METRIC_FAMILIES, PROJECT_CONFIG, ROUTES } from '@/lib/site';

export const dynamicParams = false;

export function generateStaticParams() {
  return getEntityIndex().map((entity) => ({ slug: entity.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const entity = getEntityBySlug(params.slug);

  if (!entity) {
    return {};
  }

  return {
    title: `${entity.name} sample detail page`,
    description: entity.summary,
  };
}

export default function EntityDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const entity = getEntityBySlug(params.slug);

  if (!entity) {
    notFound();
  }

  const related = getRelatedEntities(entity.slug);
  const sections = {
    hero: (
      <section className="panel" key="hero">
        <div className="eyebrow">{PROJECT_CONFIG.entitySingular} detail</div>
        <h1>{entity.name}</h1>
        <p className="lede">{entity.summary}</p>
        <div className="badgeRow">
          <span className="badge">Score {entity.score}</span>
          <span className="badge subtle">{entity.categoryLabel}</span>
          <span className="badge subtle">{entity.state}</span>
        </div>
      </section>
    ),
    metrics: (
      <section className="metricGrid" key="metrics">
        {METRIC_FAMILIES.map((metric) => (
          <div key={metric.key} className="metricCard">
            <span className="muted">{metric.label}</span>
            <strong>{entity.metrics[metric.key]}</strong>
          </div>
        ))}
      </section>
    ),
    route_rationale: (
      <section className="panel" key="route_rationale">
        <h2>Why this route exists</h2>
        <p className="lede">
          A real detail page should interpret the score, explain tradeoffs, and route the user
          to the next useful comparison. It should not be a dead-end leaf.
        </p>
      </section>
    ),
    related_entities: (
      <section className="panel" key="related_entities">
        <h2>Related entities</h2>
        <div className="list">
          {related.map((item) => (
            <Link key={item.slug} href={ROUTES.entityDetail(item.slug)} className="listItem">
              <strong>{item.name}</strong>
              <span>Score {item.score}</span>
            </Link>
          ))}
        </div>
      </section>
    ),
    next_steps: (
      <NextSteps
        key="next_steps"
        items={getEntityDetailNextSteps(entity.categoryLabel, entity.category)}
      />
    ),
  } as const;

  return (
    <main className="sectionStack">
      <nav className="crumbs">
        <Link href="/">Home</Link>
        <span>/</span>
        <Link href={ROUTES.categoryHub(entity.category)}>{entity.categoryLabel}</Link>
        <span>/</span>
        <span>{entity.name}</span>
      </nav>

      {renderOrderedSections(getEntityDetailSectionOrder(), sections)}

      <JsonLd
        data={generateBreadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: entity.categoryLabel, url: ROUTES.categoryHub(entity.category) },
          { name: entity.name, url: ROUTES.entityDetail(entity.slug) },
        ])}
      />
      <JsonLd data={generateFAQSchema(entity.faq)} />
    </main>
  );
}
