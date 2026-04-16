import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const dataPath = path.join(process.cwd(), 'data', 'tarot-cards.json');
const cards = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

async function findCartoucheOffset(imagePath) {
  try {
    const { data, info } = await sharp(imagePath)
      .raw()
      .toBuffer({ resolveWithObject: true });

    const width = info.width;
    const height = info.height;
    
    // We only care about the bottom 25% of the image
    const bottomStart = Math.floor(height * 0.75);
    
    // We only sample the center 40% horizontally to skip the side decorative borders completely
    const scanLeft = Math.floor(width * 0.30);
    const scanRight = Math.floor(width * 0.70);

    let rowGoldDensity = new Array(height).fill(0);

    for (let y = bottomStart; y < height; y++) {
      let goldCount = 0;
      for (let x = scanLeft; x < scanRight; x++) {
        const idx = (y * width + x) * info.channels;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        
        // Cartouche is solid, lighter gold/tan paper
        if (r > 150 && g > 130 && r > b) {
          goldCount++;
        }
      }
      rowGoldDensity[y] = goldCount;
    }

    let maxDensity = Math.max(...rowGoldDensity);
    if (maxDensity === 0) return "4%"; 

    const threshold = maxDensity * 0.4;
    
    // Find all bands
    let bands = [];
    let currentBand = null;

    for (let y = bottomStart; y < height; y++) {
      if (rowGoldDensity[y] > threshold) {
        if (!currentBand) {
          currentBand = { topY: y, bottomY: y };
        } else {
          currentBand.bottomY = y;
        }
      } else {
        if (currentBand) {
          bands.push(currentBand);
          currentBand = null;
        }
      }
    }
    if (currentBand) bands.push(currentBand);

    if (bands.length === 0) return "4%";

    // The cartouche is the thickest horizontal gold block in the center!
    bands.sort((a, b) => (b.bottomY - b.topY) - (a.bottomY - a.topY));
    
    const targetBand = bands[0];
    const centerY = Math.floor((targetBand.topY + targetBand.bottomY) / 2);
    // Add a slight adjustment downward because visually, letters rest on the bottom half of the cartouche ribbon
    const visualCenterY = centerY + ((targetBand.bottomY - targetBand.topY) * 0.1); 

    const bottomPercent = 100 - ((visualCenterY / height) * 100);
    return bottomPercent.toFixed(1) + "%";
  } catch (err) {
    return "4%";
  }
}

async function run() {
  console.log("Analyzing 78 images for thickest cartouche element...");
  let changed = 0;
  for (let card of cards) {
    let localPath = "";
    if (card.arcana === 'major') {
      localPath = path.join(process.cwd(), 'public', 'cards-goldcrop-webp', 'major', card.image.split('/').pop());
    } else {
      localPath = path.join(process.cwd(), 'public', 'cards-goldcrop-webp', 'minor', card.suit, card.image.split('/').pop());
    }

    if (fs.existsSync(localPath)) {
      const offset = await findCartoucheOffset(localPath);
      
      let offsetNum = parseFloat(offset.replace('%',''));
      // Constrain it to a sane cartouche location (1% to 15%)
      if (offsetNum < 0.5) offsetNum = 0.5;
      if (offsetNum > 20) offsetNum = 4.0;
      
      const idealOffset = offsetNum.toFixed(1) + "%";
      
      if (card.titleOffsetBottom !== idealOffset) {
        card.titleOffsetBottom = idealOffset;
        changed++;
        console.log(`Updated ${card.slug}: ${idealOffset}`);
      }
    }
  }

  if (changed > 0) {
    fs.writeFileSync(dataPath, JSON.stringify(cards, null, 2));
    console.log(`\nComplete! Updated ${changed} cards precisely.`);
  } else {
    console.log(`\nComplete! No changes needed.`);
  }
}

run();
