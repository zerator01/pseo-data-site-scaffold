import tarotCards from '@/../data/tarot-cards.json';

type Card = typeof tarotCards[0];

export function canonicalPairSlug(leftSlug: string, rightSlug: string): string {
  return [leftSlug, rightSlug].sort((left, right) => left.localeCompare(right)).join('-and-');
}

export function parsePairSlug(pairSlug: string): [string, string] | null {
  const parts = pairSlug.split('-and-');
  if (parts.length !== 2 || parts[0] === parts[1]) return null;
  return [parts[0], parts[1]];
}

export function getAllPairSlugs(deck: readonly Card[] = tarotCards): string[] {
  const pairSlugs: string[] = [];

  for (let i = 0; i < deck.length; i += 1) {
    for (let j = i + 1; j < deck.length; j += 1) {
      pairSlugs.push(canonicalPairSlug(deck[i].slug, deck[j].slug));
    }
  }

  return pairSlugs;
}

export function generateCombinationNarrative(card1: Card, card2: Card): string {
  // We use deterministic blending to maintain anti-slop rules instead of AI fluff.
  
  const elementalAffinity = (suit1: string | null, suit2: string | null) => {
    if (!suit1 || !suit2) return 'archetypal';
    if (suit1 === suit2) return 'intensified';
    const pairs = [suit1, suit2].sort().join('-');
    if (pairs === 'cups-wands' || pairs === 'pentacles-swords') return 'volatile';
    if (pairs === 'cups-swords' || pairs === 'pentacles-wands') return 'balanced';
    return 'neutral';
  };

  const affinity = elementalAffinity(card1.suit, card2.suit);
  
  let opening = '';
  if (card1.arcana === 'major' && card2.arcana === 'major') {
    opening = `When ${card1.name} and ${card2.name} appear together, the reading shifts entirely into the realm of major life structures. This is not a passing mood or minor event; it represents a profound intersection of archetypal forces. ${card1.name} brings the theme of ${card1.keywords.upright[0]}, which is immediately challenged and expanded by ${card2.name}'s aura of ${card2.keywords.upright[0]}.`;
  } else if (card1.arcana !== card2.arcana) {
    const major = card1.arcana === 'major' ? card1.name : card2.name;
    const minor = card1.arcana === 'minor' ? card1.name : card2.name;
    opening = `The pairing of ${card1.name} with ${card2.name} shows how a massive life theme anchors into a specific, daily reality. The gravitational pull of ${major} dictates the overarching lesson, while ${minor} shows exactly how this energy will manifest in your immediate actions or feelings.`;
  } else {
    opening = `When ${card1.name} and ${card2.name} combine, the focus is highly practical and immediate. Both cards operate in the minor arcana, indicating that this dynamic is playing out in your day-to-day choices, habits, or interactions.`;
    if (affinity === 'intensified') opening += ' Because they share the same elemental suit, this energy is compounding heavily—pay close attention to where this element is dominating your life.';
    if (affinity === 'volatile') opening += ' Their elemental natures clash, requiring you to navigate conflicting desires or external friction.';
  }

  const synthesis = `At its core, ${card1.name} advises you to embrace ${card1.keywords.upright[1]} and ${card1.keywords.upright[2]}. When you introduce ${card2.name} into this field, you are forced to synthesize that approach with ${card2.keywords.upright[1]}. If you attempt to lean entirely on the energy of ${card1.name} while ignoring the demands of ${card2.name}, you risk falling into the shadow expression of the situation—experiencing ${card1.keywords.reversed[0]} paired with ${card2.keywords.reversed[0]}.`;

  const practical = `In practical terms, this combination suggests a specific path forward. The ${card1.yesno.split(',')[0]} energy of ${card1.name} meets the ${card2.yesno.split(',')[0]} nature of ${card2.name}. You should look at the symbolism of ${card1.symbolism.split('.')[0]} and apply it to the context of ${card2.meaning.upright.general.split('.')[0]}. Together, they demand a balanced view rather than an extreme reaction.`;

  return `${opening}

${synthesis}

${practical}`;
}

export function generateCombinationKeywords(card1: Card, card2: Card): string[] {
  return [
    card1.keywords.upright[0],
    card2.keywords.upright[0],
    `${card1.keywords.upright[1]} meets ${card2.keywords.upright[1]}`,
  ];
}
