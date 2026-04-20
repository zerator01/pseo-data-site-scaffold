export const SITE_NAME = 'DailyTarot';
export const SITE_URL = 'https://dailytarot.org';
export const SITE_DESCRIPTION =
  'DailyTarot is a structured tarot reading library with deep upright and reversed card meanings for love, career, money, health, symbolism, and yes-or-no guidance.';

export const ROUTES = {
  cards: '/cards/',
  cardDetail: (slug: string) => `/cards/${slug}/`,
  cardGroup: (slug: string) => `/cards/groups/${slug}/`,
  rankings: '/rankings/',
  methodology: '/methodology/',
  about: '/about/',
  privacy: '/privacy/',
} as const;
