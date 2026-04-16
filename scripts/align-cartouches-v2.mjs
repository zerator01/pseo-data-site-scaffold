import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const dataPath = path.join(process.cwd(), 'data', 'tarot-cards.json');
const cards = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

async function findCartoucheFlatOffset(imagePath) {
  try {
    const { data, info } = await sharp(imagePath)
      .raw()
      .toBuffer({ resolveWithObject: true });

    const width = info.width;
    const height = info.height;
    
    const bottomStart = Math.floor(height * 0.80); // examine bottom 20%
    const scanLeft = Math.floor(width * 0.25);
    const scanRight = Math.floor(width * 0.75);

    let rowGoldDensity = new Array(height).fill(0);

    for (let y = bottomStart; y < height; y++) {
      let goldCount = 0;
      for (let x = scanLeft; x < scanRight; x++) {
        const idx = (y * width + x) * info.channels;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        
        if (r > 150 && g > 130 && r > b) {
          goldCount++;
        }
      }
      rowGoldDensity[y] = goldCount;
    }

    let maxDensity = Math.max(...rowGoldDensity);
    if (maxDensity === 0) return "4%"; 

    // We define the "flat ribbon" as the contiguous block of rows where the gold density is VERY HIGH (e.g. > 80% of max width).
    // The top flourishes will have lower density because they taper off into triangles and ornaments.
    const solidThreshold = maxDensity * 0.8; 
    
    let ribbonTopY = -1;
    let ribbonBottomY = -1;

    // Scan from bottom to top
    let inRibbon = false;
    for (let y = height - 1; y >= bottomStart; y--) {
      if (rowGoldDensity[y] >= solidThreshold) {
        if (!inRibbon) {
          ribbonBottomY = y;
          inRibbon = true;
        }
        ribbonTopY = y;
      } else {
        if (inRibbon) {
          // As soon as the density drops (meaning we've hit the tapering top crest/flourish), we stop!
          break;
        }
      }
    }

    if (ribbonTopY !== -1 && ribbonBottomY !== -1) {
      const centerY = Math.floor((ribbonTopY + ribbonBottomY) / 2);
      
      // Because text has line height, the baseline often looks better if we nudge it down slightly
      // Just 0.5% lower than true center
      let bottomPercent = 100 - ((centerY / height) * 100);
      bottomPercent -= 0.5;
      
      if (bottomPercent < 0) bottomPercent = 0;
      return bottomPercent.toFixed(1) + "%";
    }

    return "4%";
  } catch (err) {
    return "4%";
  }
}

async function run() {
  console.log("Analyzing 78 images using strict solid-width algorithm...");
  let changed = 0;
  for (let card of cards) {
    let localPath = "";
    if (card.arcana === 'major') {
      localPath = path.join(process.cwd(), 'public', 'cards-goldcrop-webp', 'major', card.image.split('/').pop());
    } else {
      localPath = path.join(process.cwd(), 'public', 'cards-goldcrop-webp', 'minor', card.suit, card.image.split('/').pop());
    }

    if (fs.existsSync(localPath)) {
      const idealOffset = await findCartoucheFlatOffset(localPath);
      
      if (card.titleOffsetBottom !== idealOffset) {
        card.titleOffsetBottom = idealOffset;
        changed++;
        console.log(`Fixed ${card.slug}: ${idealOffset}`);
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
