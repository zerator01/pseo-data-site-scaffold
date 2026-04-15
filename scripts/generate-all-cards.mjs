import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const APIMART_API_KEY = "sk-1WtbbHyxApD05Vk3dFxEbqTH16OBpI9ZG9Ia8pKBZJrozLsG";
const APIMART_BASE_URL = "https://api.apimart.ai/v1/chat/completions";
const MODEL_NAME = "gemini-3.1-flash-image-preview";

async function generateImage(filename, promptText) {
  console.log(`🎨 Requesting image via APIMart (model: ${MODEL_NAME})...`);
  try {
    const payload = JSON.stringify({
      model: MODEL_NAME,
      messages: [{ role: "user", content: `${promptText}. Aspect ratio: 2:3 (vertical orientation)` }]
    });

    const curlCmd = `curl -s -X POST "${APIMART_BASE_URL}" \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer ${APIMART_API_KEY}" \
      -d '${payload.replace(/'/g, "'\\''")}'`;

    const responseStr = execSync(curlCmd, { encoding: 'utf8', maxBuffer: 1024 * 1024 * 10 });
    
    let fullContent = "";
    
    // SSE parsing logic directly from nanobanana
    const lines = responseStr.split('\n');
    for (const line of lines) {
      if (line.startsWith('data: ') && !line.includes('[DONE]')) {
        try {
          const chunkData = JSON.parse(line.substring(6));
          if (chunkData.choices && chunkData.choices[0].delta && chunkData.choices[0].delta.content) {
            fullContent += chunkData.choices[0].delta.content;
          }
        } catch (e) {}
      }
    }

    if (!fullContent) {
      try {
        const data = JSON.parse(responseStr);
        if (data.choices && data.choices[0].message && data.choices[0].message.content) {
          fullContent = data.choices[0].message.content;
        }
      } catch(e) {}
    }

    let imageUrl = null;
    if (fullContent) {
      const markdownMatch = fullContent.match(/!\[.*?\]\(([^)]+)\)/i);
      if (markdownMatch && markdownMatch[1]) {
        imageUrl = markdownMatch[1];
      } else {
        const rawUrlMatch = fullContent.match(/(https?:\/\/[^\s]+|data:image\/[^\s]+)/i);
        if (rawUrlMatch) {
          imageUrl = rawUrlMatch[1];
        }
      }
    }

    if (!imageUrl) {
      console.error(`❌ Could not find image URL. Content: ${fullContent.substring(0, 200) || responseStr.substring(0, 200)}...`);
      return;
    }

    console.log(`🔗 Found Image URL, downloading...`);
    const destPath = path.join(process.cwd(), 'public', 'cards', filename);
    
    if (imageUrl.startsWith('data:image')) {
      const matches = imageUrl.match(/^data:image\/([a-zA-Z+]+);base64,(.*)$/);
      if (matches) {
        const buffer = Buffer.from(matches[2], 'base64');
        fs.writeFileSync(destPath, buffer);
      }
    } else {
      execSync(`curl -s -L -o "${destPath}" "${imageUrl}"`);
    }
    
    console.log(`✅ Successfully saved 2:3 vertical card to ${destPath}`);
  } catch (error) {
    console.error(`❌ Generate Error:`, error.message);
  }
}

async function run() {
  const prompt = '"Gilded Shadow" tarot card illustration. No text whatsoever, no letters, no roman numerals anywhere on the card. The bottom center must be left as an elegant empty dark space. No white borders. Deep black void background. Subject: A joyous dancing female figure wrapped lightly in a flowing veil, holding a wand in each hand. She is perfectly centered inside a massive glowing laurel wreath. In the four outer corners sit an angel, an eagle, a lion, and a bull. All line work is rendered in fine gold leaf with a luminous golden glow. Ornate Art Nouveau border frame inside the black void. Premium, sophisticated style.';
  
  await generateImage('major_21_theworld_apimart.png', prompt);
}

run();
