const fs = require('fs');
const cards = JSON.parse(fs.readFileSync('data/tarot-cards.json', 'utf8'));

for (let c of cards) {
  if (c.slug === 'the-empress') c.titleOffsetBottom = "3.8%";
}

fs.writeFileSync('data/tarot-cards.json', JSON.stringify(cards, null, 2));
