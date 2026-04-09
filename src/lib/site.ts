export const PROJECT_CONFIG = {
  "projectName": "my-data-site",
  "siteName": "My Data Site",
  "siteUrl": "https://example.com",
  "siteDescription": "A data-led pSEO site built on the scaffold starter.",
  "siteTagline": "Runnable starter for data-led pSEO sites",
  "heroTitle": "Build a real scaffold, not another vague page factory.",
  "heroDescription": "This starter demonstrates layered indexing, anti-orphan hubs, representative rankings, centralized schema, and documented methodology with sample data.",
  "entitySingular": "City",
  "entityPlural": "Cities",
  "entityDirectoryLabel": "City directory",
  "entityRouteBase": "entities",
  "categorySingular": "Region",
  "categoryPlural": "Regions",
  "categoryRouteBase": "categories",
  "defaultCategoryHubLabel": "Region Hub",
  "defaultCategoryHubSlug": "port-city",
  "representativeRankingLabel": "Representative Rankings",
  "representativeRankingDescription": "A user-facing sample ranking that filters out tiny edge cases.",
  "fullRankingLabel": "Full Rankings",
  "fullRankingDescription": "The raw mathematical ordering of all entities in the sample dataset.",
  "metricFamilies": [
    {
      "key": "cost_index",
      "label": "Cost Index"
    },
    {
      "key": "access_index",
      "label": "Access Index"
    },
    {
      "key": "momentum_index",
      "label": "Momentum Index"
    }
  ],
  "homeSectionOrder": [
    "hero",
    "navigation_matrix",
    "category_hubs",
    "featured_entities",
    "ranking_families",
    "next_steps"
  ],
  "entityDetailSectionOrder": [
    "hero",
    "metrics",
    "route_rationale",
    "related_entities",
    "next_steps"
  ],
  "categoryHubSectionOrder": [
    "hero",
    "entity_grid",
    "next_steps"
  ],
  "rankingHubSectionOrder": [
    "hero",
    "ranking_grid"
  ],
  "rankingDetailSectionOrder": [
    "hero",
    "ranking_table"
  ]
} as const;

export const SITE_NAME = PROJECT_CONFIG.siteName;
export const SITE_URL = PROJECT_CONFIG.siteUrl;
export const SITE_DESCRIPTION = PROJECT_CONFIG.siteDescription;

export const ROUTES = {
  entityDirectory: `/${PROJECT_CONFIG.entityRouteBase}/`,
  entityDetail: (slug: string) => `/${PROJECT_CONFIG.entityRouteBase}/${slug}/`,
  legacyEntityDetail: (slug: string) => `/entity/${slug}/`,
  categoryHub: (slug: string) => `/${PROJECT_CONFIG.categoryRouteBase}/${slug}/`,
  defaultCategoryHub: `/${PROJECT_CONFIG.categoryRouteBase}/${PROJECT_CONFIG.defaultCategoryHubSlug}/`,
  rankings: '/rankings/',
  representativeRankings: '/rankings/representative/',
  methodology: '/methodology/',
  about: '/about/',
  privacy: '/privacy/',
} as const;

export const RANKING_FAMILIES = [
  {
    slug: 'representative',
    name: PROJECT_CONFIG.representativeRankingLabel,
    description: PROJECT_CONFIG.representativeRankingDescription,
  },
  {
    slug: 'full',
    name: PROJECT_CONFIG.fullRankingLabel,
    description: PROJECT_CONFIG.fullRankingDescription,
  },
] as const;

export const METRIC_FAMILIES = PROJECT_CONFIG.metricFamilies;
export const HOME_SECTION_ORDER = PROJECT_CONFIG.homeSectionOrder;
export const ENTITY_DETAIL_SECTION_ORDER = PROJECT_CONFIG.entityDetailSectionOrder;
export const CATEGORY_HUB_SECTION_ORDER = PROJECT_CONFIG.categoryHubSectionOrder;
export const RANKING_HUB_SECTION_ORDER = PROJECT_CONFIG.rankingHubSectionOrder;
export const RANKING_DETAIL_SECTION_ORDER = PROJECT_CONFIG.rankingDetailSectionOrder;
