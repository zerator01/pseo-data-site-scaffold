export const dynamic = 'force-static';
import fs from 'fs';
import path from 'path';
import type { MetadataRoute } from 'next';
import cards from '@/../data/tarot-cards.json';
import { TAROT_GROUPS } from '@/lib/tarot-groups';
import { getAllPairSlugs } from '@/lib/combinations';
import { ROUTES, SITE_URL } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = fs.statSync(path.join(process.cwd(), 'data', 'tarot-cards.json')).mtime;
  const rankingRoutes = [
    '/rankings/most-positive',
    '/rankings/warning-cards',
    '/rankings/major-arcana-index',
  ];

  const coreRoutes = [
    '/',
    '/cards',
    '/rankings',
    ROUTES.about,
    ROUTES.methodology,
    ROUTES.privacy,
    '/reading',
  ];

  const tarotCardRoutes = cards.map((card) => `/cards/${card.slug}`);
  const tarotGroupRoutes = TAROT_GROUPS.map((group) => `/cards/groups/${group.slug}`);
  const combinationRoutes = getAllPairSlugs().map((pair) => `/combinations/${pair}`);

  return [...coreRoutes, ...rankingRoutes, ...tarotGroupRoutes, ...tarotCardRoutes, ...combinationRoutes].map((url) => ({
    url: `${SITE_URL}${url}`,
    lastModified,
    changeFrequency: 'weekly',
    priority:
      url === '/'
        ? 1
        : url === '/cards'
          ? 0.9
          : url === '/rankings'
            ? 0.85
          : url.startsWith('/cards/groups/')
            ? 0.85
            : url.startsWith('/cards/')
              ? 0.8
              : url.startsWith('/combinations/')
                ? 0.65
              : 0.7,
  }));
}
