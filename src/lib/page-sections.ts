import type { ReactNode } from 'react';
import {
  CATEGORY_HUB_SECTION_ORDER,
  ENTITY_DETAIL_SECTION_ORDER,
  HOME_SECTION_ORDER,
  PROJECT_CONFIG,
  RANKING_DETAIL_SECTION_ORDER,
  RANKING_HUB_SECTION_ORDER,
  ROUTES,
} from '@/lib/site';

export type HomeSectionId =
  | 'hero'
  | 'navigation_matrix'
  | 'category_hubs'
  | 'featured_entities'
  | 'ranking_families'
  | 'next_steps';

export type EntityDetailSectionId =
  | 'hero'
  | 'metrics'
  | 'route_rationale'
  | 'related_entities'
  | 'next_steps';

export type CategoryHubSectionId = 'hero' | 'entity_grid' | 'next_steps';

export type RankingHubSectionId = 'hero' | 'ranking_grid';

export type RankingDetailSectionId = 'hero' | 'ranking_table';

export function getHomeSectionOrder(): readonly HomeSectionId[] {
  return HOME_SECTION_ORDER as readonly HomeSectionId[];
}

export function getEntityDetailSectionOrder(): readonly EntityDetailSectionId[] {
  return ENTITY_DETAIL_SECTION_ORDER as readonly EntityDetailSectionId[];
}

export function getCategoryHubSectionOrder(): readonly CategoryHubSectionId[] {
  return CATEGORY_HUB_SECTION_ORDER as readonly CategoryHubSectionId[];
}

export function getRankingHubSectionOrder(): readonly RankingHubSectionId[] {
  return RANKING_HUB_SECTION_ORDER as readonly RankingHubSectionId[];
}

export function getRankingDetailSectionOrder(): readonly RankingDetailSectionId[] {
  return RANKING_DETAIL_SECTION_ORDER as readonly RankingDetailSectionId[];
}

export function getHomeNavigationItems() {
  return [
    {
      href: ROUTES.entityDirectory,
      title: PROJECT_CONFIG.entityDirectoryLabel,
      description: 'Main detail page family.',
    },
    {
      href: ROUTES.defaultCategoryHub,
      title: PROJECT_CONFIG.defaultCategoryHubLabel,
      description: 'Anti-orphan collection point for long-tail detail pages.',
    },
    {
      href: ROUTES.representativeRankings,
      title: 'Representative ranking',
      description: 'Normal-user default view.',
    },
    {
      href: ROUTES.methodology,
      title: 'Methodology',
      description: 'Trust page with sources and boundaries.',
    },
  ];
}

export function getHomeNextSteps() {
  return [
    {
      href: ROUTES.entityDirectory,
      title: `Study the ${PROJECT_CONFIG.entitySingular.toLowerCase()} family`,
      description: 'Use this as the template for your main detail pages.',
    },
    {
      href: ROUTES.defaultCategoryHub,
      title: 'Study the hub family',
      description: 'Use hubs to prevent long-tail pages from becoming orphans.',
    },
    {
      href: ROUTES.representativeRankings,
      title: 'Study ranking separation',
      description: 'Keep representative and full rankings distinct.',
    },
  ];
}

export function getEntityDetailNextSteps(categoryLabel: string, categorySlug: string) {
  return [
    {
      href: ROUTES.categoryHub(categorySlug),
      title: `Back to ${categoryLabel}`,
      description: 'Return to the anti-orphan hub for this cluster.',
    },
    {
      href: ROUTES.representativeRankings,
      title: 'See the representative ranking',
      description: `Compare this ${PROJECT_CONFIG.entitySingular.toLowerCase()} against the user-facing default list.`,
    },
    {
      href: ROUTES.methodology,
      title: 'Inspect the scoring doctrine',
      description: 'Document why these metrics exist and where they come from.',
    },
  ];
}

export function getCategoryHubNextSteps() {
  return [
    {
      href: ROUTES.rankings,
      title: 'Review the ranking families',
      description: 'Use ranking hubs to separate representative and full views.',
    },
    {
      href: ROUTES.methodology,
      title: 'Audit the methodology',
      description: 'Keep hub copy aligned with source boundaries and scoring logic.',
    },
  ];
}

export function renderOrderedSections<T extends string>(
  order: readonly T[],
  sections: Record<T, ReactNode>
) {
  return order.map((id) => sections[id]).filter(Boolean);
}
