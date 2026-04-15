import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';

const APIMART_API_KEY = process.env.APIMART_API_KEY || "sk-1WtbbHyxApD05Vk3dFxEbqTH16OBpI9ZG9Ia8pKBZJrozLsG";
const APIMART_BASE_URL = (process.env.APIMART_URL || "https://api.apimart.ai/v1/chat/completions").replace(/\/$/, '');
const MODEL_NAME = process.env.APIMART_MODEL || "gemini-3.1-flash-image-preview";
const RUNS_DIR = path.join(process.cwd(), 'state', 'imagegen-runs');

const CARD_PRESETS = {
  "the-fool": {
    outputPath: "public/cards/major/major_00_the_fool_canvas_test.png",
    subject:
      "Central symbol: A youthful traveler stepping at the edge of a cliff, carrying a bindle over one shoulder, holding a rose, with a small dog beside them beneath a radiant sun."
  },
  "the-high-priestess": {
    outputPath: "public/cards/major/major_02_high_priestess_canvas_test.png",
    subject:
      "Central symbol: A serene priestess seated between two sacred pillars, crowned with a lunar diadem, holding a partially veiled scroll, with a crescent moon at her feet and an atmosphere of mystery, intuition, and hidden knowledge."
  },
  "ace-of-wands": {
    outputPath: "public/cards/minor/wands/ace_of_wands_canvas_test.png",
    subject:
      "Central symbol: A single living wand emerging from a cloud, sprouting fresh leaves and radiating sacred fire-like energy, with distant hills below and an atmosphere of ignition, vitality, and creative force."
  },
  "ace-of-cups": {
    outputPath: "public/cards/minor/cups/ace_of_cups_canvas_test.png",
    subject:
      "Central symbol: A single sacred chalice overflowing with luminous water, a descending dove above the cup, gentle ripples below, and subtle celestial radiance surrounding the vessel."
  },
  "ace-of-swords": {
    outputPath: "public/cards/minor/swords/01-ace-of-swords-canvas-test.png",
    subject:
      "Central symbol: A single upright sword crowned with a laurel and wreath, emerging from a cloud above distant mountains, with an atmosphere of truth, breakthrough, and uncompromising clarity."
  },
  "ace-of-pentacles": {
    outputPath: "public/cards/minor/pentacles/01-ace-of-pentacles-canvas-test.png",
    subject:
      "Central symbol: A single radiant pentacle offered from a cloud above a cultivated garden path leading toward distant mountains, with an atmosphere of grounded opportunity, prosperity, and tangible beginning."
  },
  "two-of-pentacles": {
    outputPath: "public/cards/minor/pentacles/02-two-of-pentacles-canvas-test.png",
    subject:
      "Central symbol: A nimble figure standing at the shoreline while balancing two pentacles joined by a flowing infinity loop, with storm-tossed waves, multiple ships rising and falling behind them, and a full dramatic sense of instability, rhythm, adaptation, and material life kept in motion."
  },
  "two-of-swords": {
    outputPath: "public/cards/minor/swords/02-two-of-swords-canvas-test.png",
    subject:
      "Central symbol: A blindfolded seated figure crossing two swords over their chest before a still sea and crescent moon, with an atmosphere of tension, suspension, and difficult choice."
  },
  "two-of-cups": {
    outputPath: "public/cards/minor/cups/two_of_cups_canvas_test.png",
    subject:
      "Central symbol: Two ornate chalices facing each other in perfect balance, joined by a caduceus and a winged lion emblem above, with mirrored ripples and subtle celestial radiance around them."
  },
  "three-of-swords": {
    outputPath: "public/cards/minor/swords/03-three-of-swords-canvas-test.png",
    subject:
      "Central symbol: Three swords piercing a suspended heart against a storm-filled sky, with an atmosphere of grief, severance, and painful revelation."
  },
  "three-of-pentacles": {
    outputPath: "public/cards/minor/pentacles/03-three-of-pentacles-canvas-test.png",
    subject:
      "Central symbol: Three figures collaborating beneath a vaulted stone arch marked by three pentacles, with an atmosphere of craftsmanship, teamwork, and skill made visible."
  },
  "four-of-cups": {
    outputPath: "public/cards/minor/cups/four_of_cups_canvas_test.png",
    subject:
      "Central symbol: A contemplative seated figure beneath a tree, three ornate cups arranged before them while a fourth cup is mysteriously offered from above, with still water, quiet celestial details, and an atmosphere of withdrawal and hesitation."
  },
  "four-of-swords": {
    outputPath: "public/cards/minor/swords/04-four-of-swords-canvas-test.png",
    subject:
      "Central symbol: A resting recumbent figure in sacred stillness beneath three suspended swords while a fourth lies below, with quiet architectural calm and an atmosphere of retreat, recovery, and contemplation."
  },
  "four-of-pentacles": {
    outputPath: "public/cards/minor/pentacles/04-four-of-pentacles-canvas-test.png",
    subject:
      "Central symbol: A guarded seated figure clutching one pentacle while balancing others beneath feet and crown, with a distant city and an atmosphere of control, caution, and holding tightly."
  },
  "six-of-wands": {
    outputPath: "public/cards/minor/wands/six_of_wands_canvas_test.png",
    subject:
      "Central symbol: A triumphant rider holding a victory wand crowned with a laurel wreath, moving through a ceremonial procession of raised staffs, with an atmosphere of public recognition, momentum, and earned success."
  },
  "five-of-cups": {
    outputPath: "public/cards/minor/cups/five_of_cups_canvas_test.png",
    subject:
      "Central symbol: A grieving cloaked figure facing three spilled ornate cups while two upright cups remain behind them, with a dark river, a distant bridge, and an atmosphere of sorrow and fixation on loss."
  },
  "six-of-cups": {
    outputPath: "public/cards/minor/cups/six_of_cups_canvas_test.png",
    subject:
      "Central symbol: Six ornate cups filled with flowers arranged in a nostalgic courtyard scene, with one figure offering a cup to another, evoking memory, innocence, tenderness, and reunion."
  },
  "five-of-swords": {
    outputPath: "public/cards/minor/swords/05-five-of-swords-canvas-test.png",
    subject:
      "Central symbol: A grim victorious figure gathering swords in the foreground while two defeated figures walk away beneath a troubled sky, with an atmosphere of conflict, humiliation, and costly triumph."
  },
  "five-of-pentacles": {
    outputPath: "public/cards/minor/pentacles/05-five-of-pentacles-canvas-test.png",
    subject:
      "Central symbol: Two struggling figures passing beneath a glowing stained-glass window marked with pentacles, with an atmosphere of hardship, exclusion, and endurance in cold conditions."
  },
  "six-of-swords": {
    outputPath: "public/cards/minor/swords/06-six-of-swords-canvas-test.png",
    subject:
      "Central symbol: A cloaked passenger and ferryman crossing dark water in a small boat carrying six upright swords, with an atmosphere of transition, distance, and solemn passage."
  },
  "six-of-pentacles": {
    outputPath: "public/cards/minor/pentacles/06-six-of-pentacles-canvas-test.png",
    subject:
      "Central symbol: A wealthy benefactor weighing scales while distributing coins to two kneeling figures, with an atmosphere of exchange, support, and unequal balance."
  },
  "seven-of-cups": {
    outputPath: "public/cards/minor/cups/seven_of_cups_canvas_test.png",
    subject:
      "Central symbol: Seven ornate cups appearing in a dreamlike vision, each cup revealing a different mysterious symbol, with a solitary figure confronting illusion, temptation, and overwhelming possibility."
  },
  "seven-of-swords": {
    outputPath: "public/cards/minor/swords/07-seven-of-swords-canvas-test.png",
    subject:
      "Central symbol: A stealthy figure carrying away five swords while glancing back toward two abandoned blades near a distant encampment, with an atmosphere of strategy, secrecy, and evasive action."
  },
  "seven-of-pentacles": {
    outputPath: "public/cards/minor/pentacles/07-seven-of-pentacles-canvas-test.png",
    subject:
      "Central symbol: A weary cultivator leaning on a tool while contemplating a flourishing vine bearing seven pentacles, with an atmosphere of patience, assessment, and long-term investment."
  },
  "eight-of-wands": {
    outputPath: "public/cards/minor/wands/eight_of_wands_canvas_test.png",
    subject:
      "Central symbol: Eight powerful wands flying diagonally in swift parallel motion across open space above distant land and water, with an atmosphere of acceleration, direct movement, and messages arriving without delay."
  },
  "eight-of-swords": {
    outputPath: "public/cards/minor/swords/08-eight-of-swords-canvas-test.png",
    subject:
      "Central symbol: A blindfolded bound figure standing within a ring of eight swords on barren ground, with an atmosphere of mental entrapment, fear, and constricted perception."
  },
  "eight-of-pentacles": {
    outputPath: "public/cards/minor/pentacles/08-eight-of-pentacles-canvas-test.png",
    subject:
      "Central symbol: A dedicated artisan in a candlelit workshop engraving pentacles in sacred sequence at a carved bench, surrounded by completed coins mounted with ritual order, precise tools, architectural shadow, and an atmosphere of devotion, repetition, disciplined mastery, and almost monastic concentration."
  },
  "nine-of-cups": {
    outputPath: "public/cards/minor/cups/nine_of_cups_canvas_test.png",
    subject:
      "Central symbol: Nine ornate cups displayed in a proud, harmonious arc behind a satisfied seated figure, conveying fulfillment, pleasure, gratitude, and the feeling of wishes realized."
  },
  "nine-of-swords": {
    outputPath: "public/cards/minor/swords/09-nine-of-swords-canvas-test.png",
    subject:
      "Central symbol: A distressed figure sitting upright in bed beneath nine suspended swords, with heavy darkness, patterned cloth, and an atmosphere of anxiety, remorse, and midnight torment."
  },
  "nine-of-pentacles": {
    outputPath: "public/cards/minor/pentacles/09-nine-of-pentacles-canvas-test.png",
    subject:
      "Central symbol: An elegantly dressed figure standing in a cultivated garden among nine pentacles with a falcon perched on one hand, with an atmosphere of refinement, independence, and earned abundance."
  },
  "ten-of-cups": {
    outputPath: "public/cards/minor/cups/ten_of_cups_canvas_test.png",
    subject:
      "Central symbol: Ten ornate cups arranged in a radiant arc above a peaceful family scene, with flowing water, a stable home, and an atmosphere of harmony, blessing, and emotional completion."
  },
  "ten-of-swords": {
    outputPath: "public/cards/minor/swords/10-ten-of-swords-canvas-test.png",
    subject:
      "Central symbol: A fallen figure pierced by ten swords upon dark ground beneath a stark horizon, with an atmosphere of ending, collapse, and finality before renewal."
  },
  "ten-of-pentacles": {
    outputPath: "public/cards/minor/pentacles/10-ten-of-pentacles-canvas-test.png",
    subject:
      "Central symbol: A multigenerational household gathered beneath an archway adorned with ten pentacles, with hounds, stonework, and an atmosphere of inheritance, continuity, and lasting wealth."
  },
  "the-hermit": {
    outputPath: "public/cards/major/major_09_the_hermit_canvas_test.png",
    subject:
      "Central symbol: A solitary hooded sage standing upon a high mountain peak, raising a radiant lantern and supporting themself with a staff, with deep stillness and an atmosphere of inner guidance, contemplation, and sacred withdrawal."
  },
  "wheel-of-fortune": {
    outputPath: "public/cards/major/major_10_wheel_of_fortune_canvas_test.png",
    subject:
      "Central symbol: A monumental celestial wheel turning in the void, adorned with symbolic markings and surrounded by mysterious winged guardians at the four corners, with an atmosphere of fate, cycles, change, and cosmic law."
  },
  "the-tower": {
    outputPath: "public/cards/major/major_16_the_tower_canvas_test.png",
    subject:
      "Central symbol: A towering stone structure struck by a bolt of divine lightning, its crown blasted away as flames and falling figures descend through the night, with an atmosphere of rupture, revelation, and catastrophic truth."
  },
  "the-star": {
    outputPath: "public/cards/major/major_17_the_star_canvas_test.png",
    subject:
      "Central symbol: A serene figure kneeling beside still water, pouring from two vessels beneath a great radiant star surrounded by smaller stars, with an atmosphere of hope, spiritual clarity, healing, and quiet renewal."
  },
  "engraved-the-fool": {
    outputPath: "public/cards/major-engraved/major_00_the_fool_engraved_test.png",
    style: "engraved",
    subject:
      "Central symbol: A youthful traveler stepping at the edge of a cliff, carrying a bindle over one shoulder, holding a rose, with a small dog beside them beneath a radiant sun and distant mountains."
  },
  "engraved-the-chariot": {
    outputPath: "public/cards/major-engraved/major_07_the_chariot_engraved_test.png",
    style: "engraved",
    subject:
      "Central symbol: A fierce armored charioteer standing within a ceremonial chariot, driven by two opposing sphinxes beneath a celestial canopy, with a sense of force, command, and sacred momentum."
  },
  "engraved-the-star": {
    outputPath: "public/cards/major-engraved/major_17_the_star_engraved_test.png",
    style: "engraved",
    subject:
      "Central symbol: A serene figure kneeling beside still water, pouring from two vessels beneath a great radiant star surrounded by smaller stars, with an atmosphere of hope, spiritual clarity, healing, and quiet renewal."
  },
  "fullbleed-the-fool": {
    outputPath: "public/cards-fullbleed-tests/major_00_the_fool_fullbleed_test.png",
    style: "fullbleed",
    subject:
      "Central symbol: A youthful traveler stepping at the edge of a cliff, carrying a bindle over one shoulder, holding a rose, with a small dog beside them beneath a radiant sun and distant mountains."
  },
  "fullbleed-the-chariot": {
    outputPath: "public/cards-fullbleed-tests/major_07_the_chariot_fullbleed_test.png",
    style: "fullbleed",
    subject:
      "Central symbol: A fierce armored charioteer standing within a ceremonial chariot, driven by two opposing sphinxes beneath a celestial canopy, with a sense of force, command, and sacred momentum."
  },
  "fullbleed-the-star": {
    outputPath: "public/cards-fullbleed-tests/major_17_the_star_fullbleed_test.png",
    style: "fullbleed",
    subject:
      "Central symbol: A serene figure kneeling beside still water, pouring from two vessels beneath a great radiant star surrounded by smaller stars, with an atmosphere of hope, spiritual clarity, healing, and quiet renewal."
  },
  "fullbleed-v2-the-fool": {
    outputPath: "public/cards-fullbleed-v2/major/00-the-fool-fullbleed-v2-sample.png",
    style: "fullbleed-v2",
    subject:
      "Central symbol: A youthful traveler stepping at the edge of a cliff, carrying a bindle over one shoulder, holding a rose, with a small dog beside them beneath a radiant sun and distant mountains."
  },
  "fullbleed-v2-the-high-priestess": {
    outputPath: "public/cards-fullbleed/major/02-the-high-priestess-fullbleed.png",
    style: "fullbleed-v2",
    subject:
      "Central symbol: A serene priestess seated between two sacred pillars, crowned with a lunar diadem, holding a partially veiled scroll with completely blank surface, with a crescent moon at her feet and an atmosphere of mystery, intuition, and hidden knowledge."
  },
  "fullbleed-v2-the-empress": {
    outputPath: "public/cards-fullbleed/major/03-the-empress-fullbleed.png",
    style: "fullbleed-v2",
    subject:
      "Central symbol: A regal empress seated in a field of wheat and lush growth, holding a scepter and surrounded by natural abundance, with an atmosphere of fertility, beauty, nourishment, and sovereign calm."
  },
  "fullbleed-king-of-cups": {
    outputPath: "public/cards-fullbleed/minor/cups/14-king-of-cups-fullbleed.png",
    style: "fullbleed",
    subject:
      "Central symbol: A calm regal figure seated upon a throne rising from the sea, holding an ornate chalice and scepter, with flowing water, subtle sea movement, and an atmosphere of emotional mastery, compassion, and composed authority."
  },
  "fullbleed-eight-of-swords": {
    outputPath: "public/cards-fullbleed/minor/swords/08-eight-of-swords-fullbleed.png",
    style: "fullbleed",
    subject:
      "Central symbol: A blindfolded bound figure standing within a ring of eight swords on barren ground, with an atmosphere of mental entrapment, fear, and constricted perception."
  },
  "king-of-cups": {
    outputPath: "public/cards/minor/cups/king_of_cups_canvas_test.png",
    subject:
      "Central symbol: A calm regal figure seated upon a throne rising from the sea, holding an ornate chalice and scepter, with flowing water, subtle sea movement, and an atmosphere of emotional mastery, compassion, and composed authority."
  },
  "page-of-swords": {
    outputPath: "public/cards/minor/swords/11-page-of-swords-canvas-test.png",
    subject:
      "Central symbol: A vigilant youthful figure holding a raised sword against a windswept landscape, with alert posture, moving clouds, and an atmosphere of curiosity, tension, and sharpened perception."
  },
  "page-of-pentacles": {
    outputPath: "public/cards/minor/pentacles/11-page-of-pentacles-canvas-test.png",
    subject:
      "Central symbol: A focused youthful figure standing in an open field and gazing intently at a held pentacle, with an atmosphere of study, opportunity, and careful potential."
  },
  "knight-of-wands": {
    outputPath: "public/cards/minor/wands/knight_of_wands_canvas_test.png",
    subject:
      "Central symbol: A bold armored knight charging forward on a rearing horse while brandishing a flowering wand, with sweeping motion, desert winds, and an atmosphere of passion, courage, and unstoppable advance."
  },
  "knight-of-swords": {
    outputPath: "public/cards/minor/swords/12-knight-of-swords-canvas-test.png",
    subject:
      "Central symbol: An armored knight charging at full speed on a galloping horse with sword thrust forward into fierce wind, with storm clouds and an atmosphere of urgency, force, and relentless pursuit."
  },
  "knight-of-pentacles": {
    outputPath: "public/cards/minor/pentacles/12-knight-of-pentacles-canvas-test.png",
    subject:
      "Central symbol: A steadfast armored knight seated on a still horse while holding a pentacle before cultivated land, with an atmosphere of responsibility, persistence, and methodical progress."
  },
  "queen-of-pentacles": {
    outputPath: "public/cards/minor/pentacles/13-queen-of-pentacles-canvas-test.png",
    subject:
      "Central symbol: A nurturing queen seated upon a richly carved throne cradling a pentacle amid garden abundance, with an atmosphere of care, embodiment, and grounded sovereignty."
  },
  "queen-of-swords": {
    outputPath: "public/cards/minor/swords/13-queen-of-swords-canvas-test.png",
    subject:
      "Central symbol: A regal queen seated on a high throne holding an upright sword with one hand extended in discernment, with open sky and an atmosphere of precision, sovereignty, and lucid judgment."
  },
  "king-of-pentacles": {
    outputPath: "public/cards/minor/pentacles/14-king-of-pentacles-canvas-test.png",
    subject:
      "Central symbol: A commanding king seated upon an opulent throne surrounded by vines and carved bulls while holding a pentacle, with an atmosphere of wealth, stability, and material command."
  },
  "king-of-swords": {
    outputPath: "public/cards/minor/swords/14-king-of-swords-canvas-test.png",
    subject:
      "Central symbol: A commanding king seated upon a formal throne holding an upright sword, with airy banners, elevated symmetry, and an atmosphere of law, intellect, and disciplined authority."
  }
};

function parseArgs(argv) {
  const parsed = { _: [] };
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token.startsWith('--')) {
      const key = token.slice(2);
      const next = argv[i + 1];
      if (!next || next.startsWith('--')) {
        parsed[key] = true;
      } else {
        parsed[key] = next;
        i += 1;
      }
    } else {
      parsed._.push(token);
    }
  }
  return parsed;
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function writeJson(filePath, payload) {
  fs.writeFileSync(filePath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function makeRunId(slug) {
  return `${new Date().toISOString().replace(/[:.]/g, '-')}-${slug}`;
}

function buildPrompt(subject, style = 'gilded') {
  if (style === 'engraved') {
    return `A tarot card illustration for a major arcana card. Masterpiece following the 'Gilded Shadow' design philosophy in its ornate dimensional variant. Strict tarot card proportion, tall vertical 2:3 card ratio, rounded corners, and the full card fully visible. Abyssal obsidian background, anchored by a single opulent, meticulously crafted, highly ornamental gold border with rich decorative detail and a blank ornate title cartouche at the bottom center. Preserve the same lavish mystical black-and-gold tarot card look as an ornate gilded major arcana card. The border must feel intricate, radiant, ceremonial, and luxurious. Inside the card, keep the scene predominantly gold-on-black, but allow only a very subtle internal tonal rendering in muted warm gold, antique brass, and soft ivory highlights so the central figures feel slightly more dimensional than pure line art. Do not turn it into a sepia illustration, painted image, or etched print. It must still read first as a black-and-gold tarot card. No bright colors, no modern graphic minimalism, no flat icon look, no double border, no extra outer frame. ${subject} No text, no words, no letters. Museum-quality, masterfully crafted.`;
  }

  if (style === 'fullbleed') {
    return `A tarot card illustration following the 'Gilded Shadow' design philosophy. Full-bleed composition. The tarot card itself fills the entire canvas. The outer gold border sits extremely close to the image edges with minimal outer black margin. Do not depict a card floating inside a larger background. Do not leave outer padding. Edge-to-edge tarot card layout. Strict tarot card proportion, luxurious black and gold only, a single opulent highly ornamental gold border, and a blank ornate title cartouche at the bottom center. Preserve a lavish mystical major arcana look with rich decorative detail and a strong ceremonial presence. ${subject} No text, no words, no letters. No double border, no extra outer frame, no bright colors. Museum-quality, masterfully crafted.`;
  }

  if (style === 'fullbleed-v2') {
    return `A tarot card illustration following the 'Gilded Shadow' design philosophy. Full-bleed tarot card composition. The tarot card itself fills the entire canvas. The outer gold border sits very close to the image edges. No extra outer black padding. No card floating inside a larger background. Tall ceremonial tarot card layout with rounded corners. Luxurious black and gold palette. Predominantly black and gold. Highly ornamental, richly detailed, mystical, opulent. Single unified border architecture. No double border. No bright colors. No modern graphic minimalism. No flat icon look. A single ornate title cartouche at the bottom center. The cartouche must be uniform across the whole deck. The cartouche background must be solid warm matte gold. The cartouche interior must be clean and flat, with no texture variation, no black fill, no white fill, and no illustration details inside it. Do not vary the title cartouche style from card to card. Do not place any scene elements inside the title cartouche. Absolutely no text, no words, no letters, no glyphs, no runes, no sigils, no roman numerals, no zodiac symbols, no icon-like typographic marks anywhere in the image. Any scrolls, tablets, banners, plaques, pillars, or cartouches must remain completely blank. ${subject} Museum-quality, masterfully crafted.`;
  }

  return `A tarot card illustration following the 'Gilded Shadow' design philosophy. Strict tarot card proportion, tall vertical 2:3 card ratio, with rounded corners and the full card fully visible. Abyssal obsidian background, strict black and gold only, no other colors. Anchored by a single opulent, meticulously crafted geometric gold border. Prefer one unified border architecture and minimize any inner secondary frame. Include an empty title cartouche at the bottom center for later card-name text; this cartouche must be clearly visible and intentionally blank. ${subject} No text, no words, no letters. Museum-quality, masterfully crafted.`;
}

function requestJsonWithCurl({ url, apiKey, method = 'GET', body = null }) {
  const args = [
    '-sS',
    '-L',
    '--retry', '2',
    '--connect-timeout', '20',
    '--max-time', '60',
    '-H', `Authorization: Bearer ${apiKey}`,
    '-H', 'Accept: application/json',
  ];

  if (method === 'POST') {
    args.push('-X', 'POST');
    args.push('-H', 'Content-Type: application/json');
    if (body) {
      args.push('--data', body);
    }
  }

  args.push(url);

  const result = spawnSync('curl', args, { encoding: 'utf8', maxBuffer: 1024 * 1024 * 10 });
  if (result.status !== 0) {
    throw new Error(result.stderr || `curl request failed for ${url}`);
  }

  try {
    return JSON.parse(result.stdout);
  } catch {
    throw new Error(`curl returned non-json response for ${url}: ${result.stdout.slice(0, 1200)}`);
  }
}

async function requestJson({ url, apiKey, method = 'GET', body = null }) {
  try {
    const response = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: 'application/json',
        ...(body ? { 'Content-Type': 'application/json' } : {}),
      },
      body,
    });

    const text = await response.text();
    if (!response.ok) {
      throw new Error(`http ${response.status} ${text}`);
    }

    return JSON.parse(text);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (!/fetch failed|SSL|TLS|socket|certificate|ECONNRESET|network/i.test(message)) {
      throw error;
    }
    return requestJsonWithCurl({ url, apiKey, method, body });
  }
}

function normalizeBaseUrl(url) {
  return url
    .replace(/\/$/, '')
    .replace(/\/chat\/completions$/, '')
    .replace(/\/images\/generations$/, '');
}

function extractTaskId(payload) {
  return payload?.data?.[0]?.task_id || payload?.data?.task_id || payload?.task_id || null;
}

function extractRequestId(payload, headers = {}) {
  return payload?.request_id || payload?.requestId || headers['x-oneapi-request-id'] || null;
}

async function fetchTaskResult({ taskId, apiKey, pollBaseUrl, pollMs, timeoutMs, artifactDir }) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    await sleep(pollMs);
    const statusPayload = await requestJson({
      url: `${pollBaseUrl}/${taskId}?language=en`,
      apiKey,
    });

    writeJson(path.join(artifactDir, 'poll-last.json'), statusPayload);
    const task = statusPayload?.data;
    const status = task?.status;

    if (status === 'completed') {
      const rawUrl =
        task?.result?.images?.[0]?.url?.[0]
        || task?.result?.images?.[0]?.url
        || task?.result?.url
        || null;
      const resultUrl = Array.isArray(rawUrl)
        ? rawUrl[0]
        : typeof rawUrl === 'string'
          ? rawUrl.split(',')[0].trim()
          : null;

      return {
        taskId,
        status,
        resultUrl,
        rawStatus: task,
      };
    }

    if (status === 'failed' || status === 'cancelled') {
      return {
        taskId,
        status,
        resultUrl: null,
        rawStatus: task,
      };
    }
  }

  return {
    taskId,
    status: 'pending',
    resultUrl: null,
    rawStatus: null,
  };
}

function saveImageFromUrl(imageUrl, destPath) {
  const result = spawnSync('curl', ['-s', '-L', '-o', destPath, imageUrl], {
    encoding: 'utf8',
  });

  if (result.status !== 0) {
    throw new Error(result.stderr || `Image download failed with exit code ${result.status}`);
  }
}

async function run() {
  const args = parseArgs(process.argv.slice(2));
  const slug = args._[0] || 'the-fool';
  const preset = CARD_PRESETS[slug];

  if (!preset) {
    throw new Error(`Unknown card preset: ${slug}`);
  }

  const runId = makeRunId(slug);
  const runDir = path.join(RUNS_DIR, runId);
  ensureDir(runDir);

  const style = args.style || preset.style || 'gilded';
  const prompt = buildPrompt(preset.subject, style);
  const normalizedBaseUrl = normalizeBaseUrl(APIMART_BASE_URL);
  const submitUrl = `${normalizedBaseUrl}/images/generations`;
  const pollBaseUrl = process.env.IMAGE_TASK_STATUS_URL || `${normalizedBaseUrl}/tasks`;
  const pollMs = Number(process.env.IMAGE_API_POLL_MS || 5000);
  const timeoutMs = Number(process.env.IMAGE_API_TIMEOUT_MS || 180000);
  const explicitTaskId = args['task-id'] || null;

  const requestBody = {
    model: MODEL_NAME,
    prompt,
    size: process.env.IMAGE_API_SIZE || '2:3',
    resolution: process.env.IMAGE_API_RESOLUTION || '2K',
    n: 1,
  };

  writeJson(path.join(runDir, 'request.json'), {
    slug,
    style,
    model: MODEL_NAME,
    submit_url: submitUrl,
    poll_base_url: pollBaseUrl,
    timeout_ms: timeoutMs,
    poll_ms: pollMs,
    body: requestBody,
    explicit_task_id: explicitTaskId,
  });

  let taskId = explicitTaskId;
  let submitPayload = null;

  if (!taskId) {
    console.log(`Submitting image task for: ${slug}`);
    submitPayload = await requestJson({
      url: submitUrl,
      apiKey: APIMART_API_KEY,
      method: 'POST',
      body: JSON.stringify(requestBody),
    });
    writeJson(path.join(runDir, 'submit-result.json'), submitPayload);
    taskId = extractTaskId(submitPayload);

    if (!taskId) {
      writeJson(path.join(runDir, 'summary.json'), {
        slug,
        status: 'submit-returned-no-task-id',
        request_id: extractRequestId(submitPayload),
        submit_payload_preview: JSON.stringify(submitPayload).slice(0, 2000),
        recorded_at: new Date().toISOString(),
      });
      throw new Error(`image submit did not return task_id. Run log: ${runDir}`);
    }
  }

  writeJson(path.join(runDir, 'tracking.json'), {
    task_id: taskId,
    request_id: extractRequestId(submitPayload),
    status_endpoint: `${pollBaseUrl}/${taskId}?language=en`,
  });

  console.log(`Task id: ${taskId}`);
  console.log(`Polling task status...`);

  const result = await fetchTaskResult({
    taskId,
    apiKey: APIMART_API_KEY,
    pollBaseUrl,
    pollMs,
    timeoutMs,
    artifactDir: runDir,
  });

  const summary = {
    slug,
    task_id: taskId,
    request_id: extractRequestId(submitPayload),
    status: result.status,
    result_url: result.resultUrl,
    recorded_at: new Date().toISOString(),
  };

  if (result.rawStatus) {
    writeJson(path.join(runDir, 'task-result.json'), result.rawStatus);
  }

  if (result.status === 'completed' && result.resultUrl) {
    const destPath = path.join(process.cwd(), preset.outputPath);
    ensureDir(path.dirname(destPath));
    console.log(`Downloading image to ${destPath}`);
    saveImageFromUrl(result.resultUrl, destPath);
    summary.image_path = destPath;
    writeJson(path.join(runDir, 'summary.json'), summary);
    console.log(destPath);
    console.log(`Run log: ${runDir}`);
    return;
  }

  if (result.status === 'pending') {
    summary.message = 'Task is still pending. Use the task id to pull later.';
    writeJson(path.join(runDir, 'summary.json'), summary);
    console.log(`Pending task: ${taskId}`);
    console.log(`Run log: ${runDir}`);
    return;
  }

  writeJson(path.join(runDir, 'summary.json'), summary);
  throw new Error(`image task ${result.status}. Run log: ${runDir}`);
}

run().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
