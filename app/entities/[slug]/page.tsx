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

function getScoreBand(rank: number, total: number) {
  if (rank === 1) {
    return 'leader';
  }

  if (rank === total) {
    return 'edge_case';
  }

  return 'middle';
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

  const rankedEntities = [...getEntityIndex()].sort((left, right) => right.score - left.score);
  const rank = rankedEntities.findIndex((item) => item.slug === entity.slug) + 1;
  const total = rankedEntities.length;
  const metricPairs = METRIC_FAMILIES.map((metric) => ({
    ...metric,
    value: entity.metrics[metric.key] ?? 0,
  })).sort((left, right) => right.value - left.value);
  const strongestMetric = metricPairs[0];
  const weakestMetric = metricPairs[metricPairs.length - 1];
  const scoreBand = getScoreBand(rank, total);
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
        <h2>Score Interpretation</h2>
        <p className="lede">
          {entity.name} ranks {rank} of {total} sample {PROJECT_CONFIG.entityPlural.toLowerCase()}.
          Its strongest signal is {strongestMetric.label} at {strongestMetric.value}, while{' '}
          {weakestMetric.label} is the main tradeoff at {weakestMetric.value}.
        </p>
        <p>
          {scoreBand === 'leader'
            ? `This page works as a top-ranked narrative because the score is supported by a clear strength profile instead of a single unexplained number.`
            : scoreBand === 'edge_case'
              ? `This page still justifies publication because the weaker overall score points to a specific tradeoff pattern rather than random noise.`
              : `This page is useful because it sits between the strongest and weakest examples, making the tradeoffs easier to compare.`}
        </p>
      </section>
    ),
    faq: (
      <section className="panel" key="faq">
        <h2>Sample Questions</h2>
        <div className="list">
          {entity.faq.map((item) => (
            <div key={item.question} className="listItem">
              <strong>{item.question}</strong>
              <span>{item.answer}</span>
            </div>
          ))}
        </div>
      </section>
    ),
    related_entities: (
      <section className="panel" key="related_entities">
        <h2>Closest comparisons</h2>
        <div className="list">
          {related.map((item) => (
            <Link key={item.slug} href={ROUTES.entityDetail(item.slug)} className="listItem">
              <strong>{item.name}</strong>
              <span>
                Score {item.score} · {item.categoryLabel}
              </span>
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
      {sections.faq}

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
