export const dynamic = 'force-static';
import type { MetadataRoute } from 'next';
import cards from '@/../data/tarot-cards.json';
import { TAROT_GROUPS } from '@/lib/tarot-groups';
import { ROUTES, SITE_URL } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const coreRoutes = [
    '/',
    '/cards',
    ROUTES.about,
    ROUTES.methodology,
    ROUTES.privacy,
    '/reading',
  ];

  const tarotCardRoutes = cards.map((card) => `/cards/${card.slug}`);
  const tarotGroupRoutes = TAROT_GROUPS.map((group) => `/cards/groups/${group.slug}`);

  return [...coreRoutes, ...tarotGroupRoutes, ...tarotCardRoutes].map((url) => ({
    url: `${SITE_URL}${url}`,
    lastModified,
    changeFrequency: 'weekly',
    priority:
      url === '/'
        ? 1
        : url === '/cards'
          ? 0.9
          : url.startsWith('/cards/groups/')
            ? 0.85
            : url.startsWith('/cards/')
              ? 0.8
              : 0.7,
  }));
}
