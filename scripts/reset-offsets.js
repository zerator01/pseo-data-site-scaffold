const fs = require('fs');
const path = require('path');
const dataPath = path.join(process.cwd(), 'data', 'tarot-cards.json');
const cards = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

for (let card of cards) {
  card.titleOffsetBottom = "4.0%";
  if (card.slug === 'the-lovers') card.titleOffsetBottom = "2.0%";
  if (card.slug === 'the-fool') card.titleOffsetBottom = "4.5%";
  if (card.slug === 'death') card.titleOffsetBottom = "3.8%";
  if (card.slug === 'the-high-priestess') card.titleOffsetBottom = "3.8%";
  if (card.slug === 'the-empress') card.titleOffsetBottom = "4.0%";
}

fs.writeFileSync(dataPath, JSON.stringify(cards, null, 2));
console.log("Reset all 78 cards to pristine 4.0% baseline.");
