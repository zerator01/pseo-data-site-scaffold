import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";

const ROOT = process.cwd();
const DATA_PATH = path.join(ROOT, "data", "tarot-cards.json");
const RUNS_DIR = path.join(ROOT, "state", "imagegen-runs");
const OUTPUT_ROOT = path.join(ROOT, "public", "cards-fullbleed");
const APIMART_API_KEY = process.env.APIMART_API_KEY || "sk-1WtbbHyxApD05Vk3dFxEbqTH16OBpI9ZG9Ia8pKBZJrozLsG";
const APIMART_BASE_URL = (process.env.APIMART_URL || "https://api.apimart.ai/v1/chat/completions").replace(/\/$/, "");
const MODEL_NAME = process.env.APIMART_MODEL || "gemini-3.1-flash-image-preview";

const SUBJECT_OVERRIDES = {
  "the-fool":
    "Central symbol: A youthful traveler stepping at the edge of a cliff, carrying a bindle over one shoulder, holding a rose, with a small dog beside them beneath a radiant sun and distant mountains.",
  "the-high-priestess":
    "Central symbol: A serene priestess seated between two sacred pillars, crowned with a lunar diadem, holding a partially veiled scroll, with a crescent moon at her feet and an atmosphere of mystery, intuition, and hidden knowledge.",
  "the-chariot":
    "Central symbol: A fierce armored charioteer standing within a ceremonial chariot, driven by two opposing sphinxes beneath a celestial canopy, with a sense of force, command, and sacred momentum.",
  "the-hermit":
    "Central symbol: A solitary hooded sage standing upon a high mountain peak, raising a radiant lantern and supporting themself with a staff, with deep stillness and an atmosphere of inner guidance, contemplation, and sacred withdrawal.",
  "wheel-of-fortune":
    "Central symbol: A monumental celestial wheel turning in the void, adorned with symbolic markings and surrounded by mysterious winged guardians at the four corners, with an atmosphere of fate, cycles, change, and cosmic law.",
  "the-tower":
    "Central symbol: A towering stone structure struck by a bolt of divine lightning, its crown blasted away as flames and falling figures descend through the night, with an atmosphere of rupture, revelation, and catastrophic truth.",
  "the-star":
    "Central symbol: A serene figure kneeling beside still water, pouring from two vessels beneath a great radiant star surrounded by smaller stars, with an atmosphere of hope, spiritual clarity, healing, and quiet renewal.",
  "ace-of-cups":
    "Central symbol: A single sacred chalice overflowing with luminous water, a descending dove above the cup, gentle ripples below, and subtle celestial radiance surrounding the vessel.",
  "two-of-cups":
    "Central symbol: Two ornate chalices facing each other in perfect balance, joined by a caduceus and a winged lion emblem above, with mirrored ripples and subtle celestial radiance around them.",
  "four-of-cups":
    "Central symbol: A contemplative seated figure beneath a tree, three ornate cups arranged before them while a fourth cup is mysteriously offered from above, with still water, quiet celestial details, and an atmosphere of withdrawal and hesitation.",
  "five-of-cups":
    "Central symbol: A grieving cloaked figure facing three spilled ornate cups while two upright cups remain behind them, with a dark river, a distant bridge, and an atmosphere of sorrow and fixation on loss.",
  "six-of-cups":
    "Central symbol: Six ornate cups filled with flowers arranged in a nostalgic courtyard scene, with one figure offering a cup to another, evoking memory, innocence, tenderness, and reunion.",
  "seven-of-cups":
    "Central symbol: Seven ornate cups appearing in a dreamlike vision, each cup revealing a different mysterious symbol, with a solitary figure confronting illusion, temptation, and overwhelming possibility.",
  "nine-of-cups":
    "Central symbol: Nine ornate cups displayed in a proud, harmonious arc behind a satisfied seated figure, conveying fulfillment, pleasure, gratitude, and the feeling of wishes realized.",
  "ten-of-cups":
    "Central symbol: Ten ornate cups arranged in a radiant arc above a peaceful family scene, with flowing water, a stable home, and an atmosphere of harmony, blessing, and emotional completion.",
  "king-of-cups":
    "Central symbol: A calm regal figure seated upon a throne rising from the sea, holding an ornate chalice and scepter, with flowing water, subtle sea movement, and an atmosphere of emotional mastery, compassion, and composed authority.",
  "ace-of-wands":
    "Central symbol: A single living wand emerging from a cloud, sprouting fresh leaves and radiating sacred fire-like energy, with distant hills below and an atmosphere of ignition, vitality, and creative force.",
  "six-of-wands":
    "Central symbol: A triumphant rider holding a victory wand crowned with a laurel wreath, moving through a ceremonial procession of raised staffs, with an atmosphere of public recognition, momentum, and earned success.",
  "eight-of-wands":
    "Central symbol: Eight powerful wands flying diagonally in swift parallel motion across open space above distant land and water, with an atmosphere of acceleration, direct movement, and messages arriving without delay.",
  "knight-of-wands":
    "Central symbol: A bold armored knight charging forward on a rearing horse while brandishing a flowering wand, with sweeping motion, desert winds, and an atmosphere of passion, courage, and unstoppable advance.",
  "ace-of-swords":
    "Central symbol: A single upright sword crowned with a laurel and wreath, emerging from a cloud above distant mountains, with an atmosphere of truth, breakthrough, and uncompromising clarity.",
  "two-of-swords":
    "Central symbol: A blindfolded seated figure crossing two swords over their chest before a still sea and crescent moon, with an atmosphere of tension, suspension, and difficult choice.",
  "three-of-swords":
    "Central symbol: Three swords piercing a suspended heart against a storm-filled sky, with an atmosphere of grief, severance, and painful revelation.",
  "four-of-swords":
    "Central symbol: A resting recumbent figure in sacred stillness beneath three suspended swords while a fourth lies below, with quiet architectural calm and an atmosphere of retreat, recovery, and contemplation.",
  "five-of-swords":
    "Central symbol: A grim victorious figure gathering swords in the foreground while two defeated figures walk away beneath a troubled sky, with an atmosphere of conflict, humiliation, and costly triumph.",
  "six-of-swords":
    "Central symbol: A cloaked passenger and ferryman crossing dark water in a small boat carrying six upright swords, with an atmosphere of transition, distance, and solemn passage.",
  "seven-of-swords":
    "Central symbol: A stealthy figure carrying away five swords while glancing back toward two abandoned blades near a distant encampment, with an atmosphere of strategy, secrecy, and evasive action.",
  "eight-of-swords":
    "Central symbol: A blindfolded bound figure standing within a ring of eight swords on barren ground, with an atmosphere of mental entrapment, fear, and constricted perception.",
  "nine-of-swords":
    "Central symbol: A distressed figure sitting upright in bed beneath nine suspended swords, with heavy darkness, patterned cloth, and an atmosphere of anxiety, remorse, and midnight torment.",
  "ten-of-swords":
    "Central symbol: A fallen figure pierced by ten swords upon dark ground beneath a stark horizon, with an atmosphere of ending, collapse, and finality before renewal.",
  "page-of-swords":
    "Central symbol: A vigilant youthful figure holding a raised sword against a windswept landscape, with alert posture, moving clouds, and an atmosphere of curiosity, tension, and sharpened perception.",
  "knight-of-swords":
    "Central symbol: An armored knight charging at full speed on a galloping horse with sword thrust forward into fierce wind, with storm clouds and an atmosphere of urgency, force, and relentless pursuit.",
  "queen-of-swords":
    "Central symbol: A regal queen seated on a high throne holding an upright sword with one hand extended in discernment, with open sky and an atmosphere of precision, sovereignty, and lucid judgment.",
  "king-of-swords":
    "Central symbol: A commanding king seated upon a formal throne holding an upright sword, with airy banners, elevated symmetry, and an atmosphere of law, intellect, and disciplined authority.",
  "ace-of-pentacles":
    "Central symbol: A single radiant pentacle offered from a cloud above a cultivated garden path leading toward distant mountains, with an atmosphere of grounded opportunity, prosperity, and tangible beginning.",
  "two-of-pentacles":
    "Central symbol: A nimble figure standing at the shoreline while balancing two pentacles joined by a flowing infinity loop, with storm-tossed waves, multiple ships rising and falling behind them, and a full dramatic sense of instability, rhythm, adaptation, and material life kept in motion.",
  "three-of-pentacles":
    "Central symbol: Three figures collaborating beneath a vaulted stone arch marked by three pentacles, with an atmosphere of craftsmanship, teamwork, and skill made visible.",
  "four-of-pentacles":
    "Central symbol: A guarded seated figure clutching one pentacle while balancing others beneath feet and crown, with a distant city and an atmosphere of control, caution, and holding tightly.",
  "five-of-pentacles":
    "Central symbol: Two struggling figures passing beneath a glowing stained-glass window marked with pentacles, with an atmosphere of hardship, exclusion, and endurance in cold conditions.",
  "six-of-pentacles":
    "Central symbol: A wealthy benefactor weighing scales while distributing coins to two kneeling figures, with an atmosphere of exchange, support, and unequal balance.",
  "seven-of-pentacles":
    "Central symbol: A weary cultivator leaning on a tool while contemplating a flourishing vine bearing seven pentacles, with an atmosphere of patience, assessment, and long-term investment.",
  "eight-of-pentacles":
    "Central symbol: An artisan in a candlelit workshop engraving pentacles in sacred sequence at a carved bench, surrounded by completed coins mounted with ritual order, precise tools, architectural shadow, and an atmosphere of devotion, repetition, disciplined mastery, and almost monastic concentration.",
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
  "king-of-pentacles":
    "Central symbol: A commanding king seated upon an opulent throne surrounded by vines and carved bulls while holding a pentacle, with an atmosphere of wealth, stability, and material command."
};

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
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

function buildPrompt(subject) {
  return `A tarot card illustration following the 'Gilded Shadow' design philosophy. Full-bleed composition. The tarot card itself fills the entire canvas. The outer gold border sits extremely close to the image edges with minimal outer black margin. Do not depict a card floating inside a larger background. Do not leave outer padding. Edge-to-edge tarot card layout. Strict tarot card proportion, luxurious black and gold only, a single opulent highly ornamental gold border, and a blank ornate title cartouche at the bottom center. Preserve a lavish mystical tarot card look with rich decorative detail and a strong ceremonial presence. ${subject} No text, no words, no letters. No double border, no extra outer frame, no bright colors. Museum-quality, masterfully crafted.`;
}

function extractTaskId(payload) {
  return payload?.data?.[0]?.task_id || payload?.data?.task_id || payload?.task_id || null;
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
  if (card.arcana === "major") {
    return path.join(OUTPUT_ROOT, "major", `${String(card.number).padStart(2, "0")}-${card.slug}-fullbleed.png`);
  }

  const suitDir = card.suit.toLowerCase();
  return path.join(OUTPUT_ROOT, "minor", suitDir, `${String(card.number).padStart(2, "0")}-${card.slug}-fullbleed.png`);
}

function makeRunId(slug) {
  return `${new Date().toISOString().replace(/[:.]/g, "-")}-${slug}`;
}

async function main() {
  ensureDir(RUNS_DIR);
  const cards = JSON.parse(fs.readFileSync(DATA_PATH, "utf8"));
  const normalizedBaseUrl = normalizeBaseUrl(APIMART_BASE_URL);
  const submitUrl = `${normalizedBaseUrl}/images/generations`;

  const summary = [];

  for (const card of cards) {
    const outputPath = getOutputPath(card);
    ensureDir(path.dirname(outputPath));

    if (fs.existsSync(outputPath)) {
      summary.push({ slug: card.slug, status: "exists", outputPath });
      continue;
    }

    const subject = SUBJECT_OVERRIDES[card.slug] || buildGenericSubject(card);
    const prompt = buildPrompt(subject);
    const runId = makeRunId(card.slug);
    const runDir = path.join(RUNS_DIR, runId);
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
      const taskId = extractTaskId(submitPayload);
      summary.push({
        slug: card.slug,
        status: taskId ? "submitted" : "submit-returned-no-task-id",
        task_id: taskId,
        outputPath
      });
    } catch (error) {
      summary.push({
        slug: card.slug,
        status: "submit-failed",
        error: error instanceof Error ? error.message : String(error),
        outputPath
      });
    }
  }

  const summaryPath = path.join(RUNS_DIR, `${new Date().toISOString().replace(/[:.]/g, "-")}-fullbleed-batch-summary.json`);
  writeJson(summaryPath, summary);
  console.log(summaryPath);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
