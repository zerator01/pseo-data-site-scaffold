import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const APIMART_API_KEY = "sk-1WtbbHyxApD05Vk3dFxEbqTH16OBpI9ZG9Ia8pKBZJrozLsG";
const APIMART_BASE_URL = "https://api.apimart.ai/v1/chat/completions";
const MODEL_NAME = "claude-3-5-sonnet-20241022";

async function generateContentForCard(cardName) {
  console.log(`🧠 Generating pSEO metaphysical data for: ${cardName} using Claude Sonnet...`);

  const systemPrompt = `You are a world-class psychological occultist, heavily inspired by Carl Jung, Aleister Crowley, and modern behavioral psychology. 

Your task is to write a profound, dark, and highly sophisticated metaphysical profile for the tarot card "${cardName}".

CRITICAL "ANTI-SLOP" RULES you must follow strictly:
1. NO generic AI introductions or conclusions.
2. NO phrases like "In conclusion," "It is important to remember," "A tapestry of," "A beacon of."
3. DO NOT use overly positive, toxic-positivity language. Embrace the dark, the shadow, the complex, and the chaotic.
4. Use dense, evocative, philosophical prose (e.g., "The Chariot is not merely motion; it is the violent taming of psychological paradoxes...").
5. The text must be long and incredibly detailed. General meaning should read like an academic dissection of the human soul.
6. Make it feel written by a master occultist from the 1920s combined with a modern harsh reality check.

Respond ONLY with a valid JSON object strictly matching this schema:
{
  "keywords": {
    "upright": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
    "reversed": ["revWord1", "revWord2", "revWord3", "revWord4", "revWord5"]
  },
  "meaning": {
    "upright": {
      "general": "Profound, dark psychological overview (min 3 paragraphs)...",
      "love": "Harsh, realistic relationship dynamics...",
      "career": "Ambitious, cutthroat, or shadow-driven career dynamics...",
      "health": "Somatic and bodily reflections of the psyche...",
      "finance": "Materialism and resource mechanics..."
    },
    "reversed": {
      "general": "The breakdown of the shadow, the chaotic reversal (min 3 paragraphs)...",
      "love": "Toxic attachments, void, or explosive ruptures...",
      "career": "Stagnation, corruption, or ego death and collapse...",
      "health": "Psychosomatic decay...",
      "finance": "Financial ruin or material obsession..."
    }
  },
  "symbolism": "Deconstruct the Rider-Waite-Smith symbolism through a hermetic and Jungian lens...",
  "yesno": "Yes, No, or Maybe"
}`;

  const payload = JSON.stringify({
    model: MODEL_NAME,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: `Write the esoteric data for ${cardName}.` }
    ],
    max_tokens: 8192
  });

  const curlCmd = `curl -s -X POST "${APIMART_BASE_URL}" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer ${APIMART_API_KEY}" \
    -d '${payload.replace(/'/g, "'\\''")}'`;

  try {
    const responseStr = execSync(curlCmd, { encoding: 'utf8', maxBuffer: 1024 * 1024 * 10 });
    
    // Attempt parsing SSE lines just in case
    let fullContent = "";
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
      const data = JSON.parse(responseStr);
      if (data.error) {
         console.error(`❌ API Error:`, data.error.message);
         return null;
      }
      if (data.choices && data.choices[0].message && data.choices[0].message.content) {
         fullContent = data.choices[0].message.content;
      }
    }
    
    if (fullContent) {
      const cleanedJson = fullContent.replace(/^```[a-z]*\s*/i, '').replace(/\s*```$/, '');
      return JSON.parse(cleanedJson);
    }
  } catch(e) {
    console.error(`❌ Network or parse error:`, e.message);
  }
  return null;
}

async function main() {
  const args = process.argv.slice(2);
  const batchSize = Math.max(1, parseInt(args[0]) || 5);
  
  const dataPath = path.resolve(__dirname, '..', 'data', 'tarot-cards.json');
  let cards = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  
  console.log(`Starting to scrape content for up to ${batchSize} unpopulated cards...`);
  
  let processedCount = 0;
  
  for (let i = 0; i < cards.length; i++) {
    if (processedCount >= batchSize) {
      break;
    }
    
    const card = cards[i];
    
    // Check if the card still has the dummy placeholder keyword
    const isDummyData = card.keywords && card.keywords.upright && card.keywords.upright.includes("keyword1");
    
    if (isDummyData) {
      const gptData = await generateContentForCard(card.name);
      
      if (gptData) {
        // Merge the GPT data back into the card object
        cards[i] = {
          ...card,
          ...gptData, // overrides keywords, meaning, symbolism, yesno
        };
        
        console.log(`✅ Emplaced fresh SEO data for ${card.name}!`);
        
        // Write instantly so we don't lose data if the script crashes
        fs.writeFileSync(dataPath, JSON.stringify(cards, null, 2), 'utf-8');
        processedCount++;
        
        // Wait 2 seconds to respect rate limits
        await new Promise(res => setTimeout(res, 2000));
      } else {
        console.error(`⚠️ Failed to generate content for ${card.name}, skipping for now.`);
      }
    }
  }
  
  console.log(`\n🎉 Script finished. Processed ${processedCount} cards.`);
}

main().catch(console.error);
