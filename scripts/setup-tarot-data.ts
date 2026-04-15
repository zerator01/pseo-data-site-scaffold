import fs from 'fs';
import path from 'path';

// Define suits and numbers
const suits = ['Wands', 'Cups', 'Swords', 'Pentacles'];
const pipNumbers = ['Ace', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'];
const courtCards = ['Page', 'Knight', 'Queen', 'King'];

const majorArcanaNames = [
  'The Fool', 'The Magician', 'The High Priestess', 'The Empress', 'The Emperor',
  'The Hierophant', 'The Lovers', 'The Chariot', 'Strength', 'The Hermit',
  'Wheel of Fortune', 'Justice', 'The Hanged Man', 'Death', 'Temperance',
  'The Devil', 'The Tower', 'The Star', 'The Moon', 'The Sun',
  'Judgement', 'The World'
];

interface TarotCard {
  id: string;
  name: string;
  slug: string;
  number: number;
  arcana: 'major' | 'minor';
  suit: string | null;
  image: string;
  keywords: { upright: string[], reversed: string[] };
  meaning: {
    upright: any;
    reversed: any;
  };
  symbolism: string;
  yesno: 'yes' | 'no' | 'maybe';
}

const cards: TarotCard[] = [];

// Generate Major Arcana
majorArcanaNames.forEach((name, index) => {
  const slug = name.toLowerCase().replace(/\s+/g, '-');
  cards.push({
    id: `major-${index.toString().padStart(2, '0')}`,
    name,
    slug,
    number: index,
    arcana: 'major',
    suit: null,
    image: `/cards/major/${index.toString().padStart(2, '0')}-${slug}.webp`,
    keywords: {
      upright: ['keyword1', 'keyword2', 'keyword3'],
      reversed: ['keyword4', 'keyword5', 'keyword6']
    },
    meaning: {
      upright: {
        general: `${name} represents ... (upright general)`,
        love: `${name} in love means ...`,
        career: `${name} in career means ...`,
        health: `${name} in health means ...`,
        finance: `${name} in finance means ...`
      },
      reversed: {
        general: `${name} reversed represents ...`,
        love: `${name} reversed in love means ...`,
        career: `${name} reversed in career means ...`,
        health: `${name} reversed in health means ...`,
        finance: `${name} reversed in finance means ...`
      }
    },
    symbolism: `Symbolism of ${name}...`,
    yesno: 'yes'
  });
});

// Generate Minor Arcana
suits.forEach(suit => {
  const allSuitCards = [...pipNumbers, ...courtCards];
  allSuitCards.forEach((name, index) => {
    const cardName = `${name} of ${suit}`;
    const slug = `${name.toLowerCase()}-of-${suit.toLowerCase()}`;
    const number = index + 1; // Ace is 1
    
    cards.push({
      id: `minor-${suit.toLowerCase()}-${number.toString().padStart(2, '0')}`,
      name: cardName,
      slug,
      number,
      arcana: 'minor',
      suit,
      image: `/cards/minor/${suit.toLowerCase()}/${number.toString().padStart(2, '0')}-${slug}.webp`,
      keywords: {
        upright: ['keyword1', 'keyword2'],
        reversed: ['keyword3', 'keyword4']
      },
      meaning: {
        upright: {
          general: `${cardName} represents ...`,
          love: `${cardName} in love...`,
          career: `${cardName} in career...`,
          health: `${cardName} in health...`,
          finance: `${cardName} in finance...`
        },
        reversed: {
          general: `${cardName} reversed represents ...`,
          love: `${cardName} reversed in love...`,
          career: `${cardName} reversed in career...`,
          health: `${cardName} reversed in health...`,
          finance: `${cardName} reversed in finance...`
        }
      },
      symbolism: `Symbolism of ${cardName}...`,
      yesno: 'maybe'
    });
  });
});

const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

fs.writeFileSync(path.join(dataDir, 'tarot-cards.json'), JSON.stringify(cards, null, 2));

const spreads = [
  {
    id: "three-card",
    name: "Three Card Spread",
    slug: "three-card",
    description: "Past, Present, Future — the most popular beginner spread.",
    positions: [
      { index: 0, label: "Past", description: "What has led to this moment" },
      { index: 1, label: "Present", description: "Your current situation" },
      { index: 2, label: "Future", description: "What is likely to happen" }
    ],
    layout: "horizontal"
  },
  {
    id: "celtic-cross",
    name: "Celtic Cross",
    slug: "celtic-cross",
    description: "10-card spread covering all aspects of a situation.",
    positions: [
      { index: 0, label: "The Present", description: "Current situation" },
      { index: 1, label: "The Challenge", description: "What steps you back" },
      { index: 2, label: "The Past", description: "Past events affecting issue" },
      { index: 3, label: "The Future", description: "Near future events" },
      { index: 4, label: "Above", description: "Conscious mind, goals" },
      { index: 5, label: "Below", description: "Subconscious mind, root cause" },
      { index: 6, label: "Advice", description: "What you should do or know" },
      { index: 7, label: "External Influences", description: "Environment, friends, family" },
      { index: 8, label: "Hopes and Fears", description: "What you hope/fear will happen" },
      { index: 9, label: "Outcome", description: "Ultimate outcome if nothing changes" }
    ],
    layout: "cross"
  }
];

fs.writeFileSync(path.join(dataDir, 'spreads.json'), JSON.stringify(spreads, null, 2));
console.log('Successfully generated tarot data stubs.');
