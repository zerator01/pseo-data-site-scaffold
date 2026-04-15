import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";

const ROOT = process.cwd();
const DATA_PATH = path.join(ROOT, "data", "tarot-cards.json");
const RUNS_DIR = path.join(ROOT, "state", "imagegen-runs");
const OUTPUT_ROOT = path.join(ROOT, "public", "cards-fullbleed", "minor");
const APIMART_API_KEY = process.env.APIMART_API_KEY || "sk-1WtbbHyxApD05Vk3dFxEbqTH16OBpI9ZG9Ia8pKBZJrozLsG";
const APIMART_BASE_URL = (process.env.APIMART_URL || "https://api.apimart.ai/v1/chat/completions").replace(/\/$/, "");
const MODEL_NAME = process.env.APIMART_MODEL || "gemini-3.1-flash-image-preview";

const TARGETS = {
  Cups: [1, 2, 4, 6, 7, 12, 13],
  Pentacles: [1, 4, 5, 7, 9, 10, 11, 12, 13],
  Swords: [1, 3, 5, 6, 8, 9, 11, 12, 14],
  Wands: [2, 4, 6, 8, 9, 13]
};

const SUBJECT_OVERRIDES = {
  "ace-of-cups":
    "Central symbol: A single sacred chalice overflowing with luminous water, a descending dove above the cup, gentle ripples below, and subtle celestial radiance surrounding the vessel.",
  "two-of-cups":
    "Central symbol: Two ornate chalices facing each other in perfect balance, joined by a caduceus and a winged lion emblem above, with mirrored ripples and subtle celestial radiance around them.",
  "four-of-cups":
    "Central symbol: A contemplative seated figure beneath a tree, three ornate cups arranged before them while a fourth cup is mysteriously offered from above, with still water, quiet celestial details, and an atmosphere of withdrawal and hesitation.",
  "six-of-cups":
    "Central symbol: Six ornate cups filled with flowers arranged in a nostalgic courtyard scene, with one figure offering a cup to another, evoking memory, innocence, tenderness, and reunion.",
  "seven-of-cups":
    "Central symbol: Seven ornate cups appearing in a dreamlike vision, each cup revealing a different mysterious symbol, with a solitary figure confronting illusion, temptation, and overwhelming possibility.",
  "knight-of-cups":
    "Central symbol: A graceful armored knight riding forward on a calm horse while presenting an ornate cup, with flowing water, soft motion, and an atmosphere of invitation, imagination, and romantic quest.",
  "queen-of-cups":
    "Central symbol: A serene queen seated near the sea, holding an intricately sealed chalice in contemplative stillness, with an atmosphere of emotional depth, intuition, receptivity, and sacred sensitivity.",
  "ace-of-pentacles":
    "Central symbol: A single radiant pentacle offered from a cloud above a flowering garden path and distant archway, with an atmosphere of grounded opportunity, material blessing, and tangible beginning.",
  "four-of-pentacles":
    "Central symbol: A guarded seated figure clutching one pentacle while balancing others beneath feet and crown, with a distant city and an atmosphere of control, caution, and holding tightly.",
  "five-of-pentacles":
    "Central symbol: Two struggling figures passing beneath a glowing stained-glass window marked with pentacles, with an atmosphere of hardship, exclusion, and endurance in cold conditions.",
  "seven-of-pentacles":
    "Central symbol: A weary cultivator leaning on a tool while contemplating a flourishing vine bearing seven pentacles, with an atmosphere of patience, assessment, and long-term investment.",
  "nine-of-pentacles":
    "Central symbol: An elegantly dressed figure standing in a cultivated garden among nine pentacles with a falcon perched on one hand, with an atmosphere of refinement, independence, and earned abundance.",
  "ten-of-pentacles":
    "Central symbol: A multigenerational household gathered beneath an archway adorned with ten pentacles, with hounds, stonework, and an atmosphere of inheritance, continuity, and lasting wealth.",
  "page-of-pentacles":
    "Central symbol: A focused youthful figure standing in an open field and gazing intently at a held pentacle, with an atmosphere of study, opportunity, and careful potential.",
  "knight-of-pentacles":
    "Central symbol: A steadfast armored knight seated on a still horse while holding a pentacle before cultivated land, with an atmosphere of responsibility, persistence, and methodical progress.",
  "queen-of-pentacles":
    "Central symbol: A nurturing queen seated upon a richly carved throne cradling a pentacle amid garden abundance, with an atmosphere of care, embodiment, and grounded sovereignty.",
  "ace-of-swords":
    "Central symbol: A single upright sword crowned with a laurel and wreath, emerging from a cloud above distant mountains, with an atmosphere of truth, breakthrough, and uncompromising clarity.",
  "three-of-swords":
    "Central symbol: Three swords piercing a suspended heart against a storm-filled sky, with an atmosphere of grief, severance, and painful revelation.",
  "five-of-swords":
    "Central symbol: A grim victorious figure gathering swords in the foreground while two defeated figures walk away beneath a troubled sky, with an atmosphere of conflict, humiliation, and costly triumph.",
  "six-of-swords":
    "Central symbol: A cloaked passenger and ferryman crossing dark water in a small boat carrying six upright swords, with an atmosphere of transition, distance, and solemn passage.",
  "eight-of-swords":
    "Central symbol: A blindfolded bound figure standing within a ring of eight swords on barren ground, with an atmosphere of mental entrapment, fear, and constricted perception.",
  "nine-of-swords":
    "Central symbol: A distressed figure sitting upright in bed beneath nine suspended swords, with heavy darkness, patterned cloth, and an atmosphere of anxiety, remorse, and midnight torment.",
  "page-of-swords":
    "Central symbol: A vigilant youthful figure holding a raised sword against a windswept landscape, with alert posture, moving clouds, and an atmosphere of curiosity, tension, and sharpened perception.",
  "knight-of-swords":
    "Central symbol: An armored knight charging at full speed on a galloping horse with sword thrust forward into fierce wind, with storm clouds and an atmosphere of urgency, force, and relentless pursuit.",
  "king-of-swords":
    "Central symbol: A regal king seated upright upon a severe throne, holding a vertical sword with unwavering focus, with an atmosphere of judgment, reason, precision, and disciplined authority.",
  "two-of-wands":
    "Central symbol: A poised figure standing upon a battlement while holding a wand and contemplating a globe, with another staff fixed beside them and an atmosphere of planning, dominion, and future reach.",
  "four-of-wands":
    "Central symbol: Four upright wands crowned with garlands forming a ceremonial threshold, with celebratory figures beyond and an atmosphere of stability, joy, welcome, and communal blessing.",
  "six-of-wands":
    "Central symbol: A triumphant rider holding a victory wand crowned with a laurel wreath, moving through a ceremonial procession of raised staffs, with an atmosphere of public recognition, momentum, and earned success.",
  "eight-of-wands":
    "Central symbol: Eight powerful wands flying diagonally in swift parallel motion across open space above distant land and water, with an atmosphere of acceleration, direct movement, and messages arriving without delay.",
  "nine-of-wands":
    "Central symbol: A battle-worn standing figure gripping a wand before a defensive row of eight upright staffs, with an atmosphere of vigilance, resilience, strain, and stubborn endurance.",
  "queen-of-wands":
    "Central symbol: A charismatic queen seated upon a sunflower-carved throne while holding a flowering wand, with a watchful black cat nearby and an atmosphere of confidence, magnetism, warmth, and sovereign will."
};

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function parseArgs(argv) {
  const parsed = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith("--")) continue;
    const key = token.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith("--")) {
      parsed[key] = true;
    } else {
      parsed[key] = next;
      i += 1;
    }
  }
  return parsed;
}

function writeJson(filePath, payload) {
  fs.writeFileSync(filePath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
}

function slugToLabel(slug) {
  return slug.split("-").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
}

function normalizeBaseUrl(url) {
  return url
    .replace(/\/$/, "")
    .replace(/\/chat\/completions$/, "")
    .replace(/\/images\/generations$/, "");
}

function requestJsonWithCurl({ url, apiKey, method = "GET", body = null }) {
  const args = [
    "-sS",
    "-L",
    "--retry", "2",
    "--connect-timeout", "20",
    "--max-time", "60",
    "-H", `Authorization: Bearer ${apiKey}`,
    "-H", "Accept: application/json"
  ];

  if (method === "POST") {
    args.push("-X", "POST");
    args.push("-H", "Content-Type: application/json");
    if (body) args.push("--data", body);
  }

  args.push(url);
  const result = spawnSync("curl", args, { encoding: "utf8", maxBuffer: 1024 * 1024 * 10 });
  if (result.status !== 0) {
    throw new Error(result.stderr || `curl request failed for ${url}`);
  }
  return JSON.parse(result.stdout);
}

function extractTaskId(payload) {
  return payload?.data?.[0]?.task_id || payload?.data?.task_id || payload?.task_id || null;
}

function buildPrompt(subject) {
  return `A tarot card illustration following the 'Gilded Shadow' design philosophy. Full-bleed tarot card composition. The tarot card itself fills the entire canvas. The outer gold border sits very close to the image edges. No extra outer black padding. No card floating inside a larger background. Tall ceremonial tarot card layout with rounded corners. Luxurious black and gold palette. Predominantly black and gold. Highly ornamental, richly detailed, mystical, opulent. Single unified border architecture. No double border. No bright colors. No modern graphic minimalism. No flat icon look. A single ornate title cartouche at the bottom center. The cartouche must be uniform across the whole deck. The cartouche background must be solid warm matte gold. The cartouche interior must be clean and flat, with no texture variation, no black fill, no white fill, and no illustration details inside it. Do not vary the title cartouche style from card to card. Do not place any scene elements inside the title cartouche. ${subject} No text, no words, no letters, no glyphs, no runes, no sigils, no roman numerals, no zodiac symbols. Any scrolls, plaques, banners, pillars, books, coins, cups, swords, wands, cartouches, or architectural surfaces must not contain writing or symbolic markings. Museum-quality, masterfully crafted.`;
}

function buildGenericSubject(card) {
  const label = card.name || slugToLabel(card.slug);
  const symbolism = (card.symbolism || "").replace(/\s+/g, " ").trim();
  const detail = symbolism
    ? ` Use the established symbolism of ${label}: ${symbolism}`
    : "";
  return `Central symbol: a faithful, recognizable tarot scene for ${label}, rendered as a dramatic ceremonial composition with clear archetypal figures, symbolic objects, and environmental storytelling.${detail}`;
}

function getOutputPath(card) {
  return path.join(OUTPUT_ROOT, card.suit.toLowerCase(), `${String(card.number).padStart(2, "0")}-${card.slug}-fullbleed.png`);
}

function makeRunId(slug) {
  return `${new Date().toISOString().replace(/[:.]/g, "-")}-${slug}`;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const onlySlug = args.slug || null;
  const onlySlugs = args.slugs
    ? String(args.slugs).split(",").map((item) => item.trim()).filter(Boolean)
    : null;
  ensureDir(RUNS_DIR);
  const cards = JSON.parse(fs.readFileSync(DATA_PATH, "utf8"));
  const submitUrl = `${normalizeBaseUrl(APIMART_BASE_URL)}/images/generations`;
  const selected = cards.filter((card) => {
    if (card.arcana !== "minor" || !TARGETS[card.suit]?.includes(card.number)) return false;
    if (onlySlug && card.slug !== onlySlug) return false;
    if (onlySlugs && !onlySlugs.includes(card.slug)) return false;
    return true;
  });
  const summary = [];

  for (const card of selected) {
    const outputPath = getOutputPath(card);
    const subject = SUBJECT_OVERRIDES[card.slug] || buildGenericSubject(card);
    const prompt = buildPrompt(subject);
    const runDir = path.join(RUNS_DIR, makeRunId(`fullbleed-v2-${card.slug}`));
    ensureDir(runDir);

    const requestBody = {
      model: MODEL_NAME,
      prompt,
      size: process.env.IMAGE_API_SIZE || "2:3",
      resolution: process.env.IMAGE_API_RESOLUTION || "2K",
      n: 1
    };

    writeJson(path.join(runDir, "request.json"), {
      slug: card.slug,
      suit: card.suit,
      number: card.number,
      output_path: outputPath,
      body: requestBody
    });

    try {
      const submitPayload = requestJsonWithCurl({
        url: submitUrl,
        apiKey: APIMART_API_KEY,
        method: "POST",
        body: JSON.stringify(requestBody)
      });
      writeJson(path.join(runDir, "submit-result.json"), submitPayload);
      summary.push({
        slug: card.slug,
        suit: card.suit,
        number: card.number,
        status: "submitted",
        task_id: extractTaskId(submitPayload),
        outputPath
      });
    } catch (error) {
      summary.push({
        slug: card.slug,
        suit: card.suit,
        number: card.number,
        status: "submit-failed",
        error: error instanceof Error ? error.message : String(error),
        outputPath
      });
    }
  }

  const summaryPath = path.join(RUNS_DIR, `${new Date().toISOString().replace(/[:.]/g, "-")}-fullbleed-v2-minor-selected-summary.json`);
  writeJson(summaryPath, summary);
  console.log(summaryPath);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
