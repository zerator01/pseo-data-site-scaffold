import type { MetadataRoute } from 'next';
import {
  getCategoryHubItems,
  getEntityIndex,
  getRepresentativeEntities,
  RANKING_CATEGORIES,
} from '@/lib/data/entities';
import { getLastModifiedDate } from '@/lib/freshness';
import { ROUTES, SITE_URL } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = getLastModifiedDate();

  const coreRoutes = [
    '/',
    ROUTES.about,
    ROUTES.methodology,
    ROUTES.privacy,
    ROUTES.entityDirectory,
    ROUTES.rankings,
  ];

  const categoryRoutes = getCategoryHubItems().map((group) => ROUTES.categoryHub(group.slug));
  const rankingRoutes = RANKING_CATEGORIES.map((ranking) => `${ROUTES.rankings}${ranking.slug}/`);
  const entityRoutes = getRepresentativeEntities(50).map((item) => ROUTES.entityDetail(item.slug));

  return [...coreRoutes, ...categoryRoutes, ...rankingRoutes, ...entityRoutes].map((url) => ({
    url: `${SITE_URL}${url}`,
    lastModified,
    changeFrequency: 'weekly',
    priority: url === '/' ? 1 : 0.7,
  }));
}
