import fs from 'fs';
import path from 'path';

// Use the global environment variable that already exists in your zshrc
const API_KEY = process.env.OPENAI_API_KEY;
const ENDPOINT = 'https://api.openai.com/v1/images/generations';

const generateImage = async (filename, promptText) => {
  console.log(`Generating vertical 1024x1792 image for: ${filename}...`);

  try {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: promptText,
        n: 1,
        // DALL-E 3 specific vertical size - PERFECT for Tarot Cards (approx 9:16)
        size: "1024x1792" 
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`API Error: ${response.status} ${errText}`);
    }

    const data = await response.json();
    const imageUrl = data.data[0].url;

    // Download the image
    const imageRes = await fetch(imageUrl);
    const buffer = await imageRes.arrayBuffer();

    const destPath = path.join(process.cwd(), 'public', 'cards', filename);
    fs.writeFileSync(destPath, Buffer.from(buffer));
    console.log(`✅ Saved true vertical card back to ${filename}`);
  } catch (error) {
    console.error(`❌ Failed to generate ${filename}:`, error.message);
  }
};

async function run() {
  const prompt = `"Gilded Shadow" tarot card illustration. THIS MUST BE A TALL VERTICAL RECTANGLE. No text. Completely symmetrical pattern, perfect for a card back. Deep black void background. Design features intertwined Art Nouveau gold leaf vines, a central geometric Art Deco sun or eye motif, surrounded by mystical cosmic stars. Highly intricate, perfectly symmetrical from top to bottom and left to right. All line work is rendered in fine gold leaf with a luminous golden glow. No cartoony elements. Museum-quality craftsmanship, mystical, premium feel.`;
  await generateImage('card-back.png', prompt);
}

run();
