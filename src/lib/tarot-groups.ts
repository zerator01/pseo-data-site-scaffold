import cards from '@/../data/tarot-cards.json';

export const TAROT_GROUPS = [
  {
    slug: 'major-arcana',
    title: 'Major Arcana',
    description:
      'The 22 major arcana cards map the large turning points, psychological thresholds, and transformational lessons of the tarot deck.',
    matches: (card: (typeof cards)[number]) => card.arcana === 'major',
  },
  {
    slug: 'wands',
    title: 'Wands',
    description:
      'The Wands suit deals with action, desire, confidence, momentum, creativity, and how willpower moves into the visible world.',
    matches: (card: (typeof cards)[number]) => card.suit === 'Wands',
  },
  {
    slug: 'cups',
    title: 'Cups',
    description:
      'The Cups suit covers emotion, intimacy, intuition, imagination, and the way feelings move through relationships and inner life.',
    matches: (card: (typeof cards)[number]) => card.suit === 'Cups',
  },
  {
    slug: 'swords',
    title: 'Swords',
    description:
      'The Swords suit focuses on thought, truth, conflict, language, mental pressure, and the consequences of clear or distorted thinking.',
    matches: (card: (typeof cards)[number]) => card.suit === 'Swords',
  },
  {
    slug: 'pentacles',
    title: 'Pentacles',
    description:
      'The Pentacles suit addresses work, money, stability, the body, routine, craft, and long-term material stewardship.',
    matches: (card: (typeof cards)[number]) => card.suit === 'Pentacles',
  },
] as const;

export function getTarotGroup(slug: string) {
  return TAROT_GROUPS.find((group) => group.slug === slug);
}

export function getTarotGroupCards(slug: string) {
  const group = getTarotGroup(slug);
  return group ? cards.filter(group.matches) : [];
}
