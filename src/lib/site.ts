export const PROJECT_CONFIG = {
  "projectName": "dailytarot",
  "siteName": "DailyTarot",
  "siteUrl": "https://dailytarot.org",
  "siteDescription": "DailyTarot is a structured tarot reading library with deep upright and reversed card meanings for love, career, money, health, symbolism, and yes-or-no guidance.",
  "siteTagline": "Deep tarot meanings without filler",
  "heroTitle": "Deep Tarot Card Meanings Without Filler",
  "heroDescription": "Browse 78 tarot cards with structured upright and reversed interpretations, symbolic analysis, and practical readings for relationships, work, money, and health.",
  "entitySingular": "Tarot Card",
  "entityPlural": "Tarot Cards",
  "entityDirectoryLabel": "Tarot card library",
  "entityRouteBase": "cards",
  "categorySingular": "Arcana Group",
  "categoryPlural": "Arcana Groups",
  "categoryRouteBase": "cards/groups",
  "defaultCategoryHubLabel": "Major Arcana",
  "defaultCategoryHubSlug": "major-arcana",
  "representativeRankingLabel": "Featured Tarot Paths",
  "representativeRankingDescription": "Reader-friendly entry points into the tarot deck.",
  "fullRankingLabel": "Full Tarot Index",
  "fullRankingDescription": "The complete tarot card archive with upright and reversed meanings.",
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
