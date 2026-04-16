const fs = require('fs');
const cards = JSON.parse(fs.readFileSync('data/tarot-cards.json', 'utf8'));

// Based on visual review of the 3 hero cards hovering above, 4% is our new baseline,
// but we will explicitly inject it to prove the system works.
for (let c of cards) {
  if (c.slug === 'the-fool') c.titleOffsetBottom = "4.5%";
  if (c.slug === 'the-high-priestess') c.titleOffsetBottom = "3.8%";
  if (c.slug === 'death') c.titleOffsetBottom = "3.5%";
}

fs.writeFileSync('data/tarot-cards.json', JSON.stringify(cards, null, 2));
console.log("Offsets patched!");
