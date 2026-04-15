import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";

const ROOT = process.cwd();
const DATA_PATH = path.join(ROOT, "data", "tarot-cards.json");
const RUNS_DIR = path.join(ROOT, "state", "imagegen-runs");
const OUTPUT_ROOT = path.join(ROOT, "public", "cards-fullbleed-v2", "major");
const APIMART_API_KEY = process.env.APIMART_API_KEY || "sk-1WtbbHyxApD05Vk3dFxEbqTH16OBpI9ZG9Ia8pKBZJrozLsG";
const APIMART_BASE_URL = (process.env.APIMART_URL || "https://api.apimart.ai/v1/chat/completions").replace(/\/$/, "");
const MODEL_NAME = process.env.APIMART_MODEL || "gemini-3.1-flash-image-preview";

const TARGET_SLUGS = [
  "the-magician",
  "the-high-priestess",
  "the-emperor",
  "the-hierophant",
  "the-hermit",
  "wheel-of-fortune",
  "death",
  "temperance",
  "the-devil",
  "the-tower",
  "the-moon",
  "the-sun",
  "judgement"
];

const SUBJECT_OVERRIDES = {
  "the-magician":
    "Central symbol: A ritual magician standing before an altar with wand raised toward the heavens and the other hand directed downward, surrounded by the elemental tools and an atmosphere of focus, will, and manifested power.",
  "the-high-priestess":
    "Central symbol: A serene priestess seated between two sacred pillars, crowned with a lunar diadem, holding a partially veiled scroll, with a crescent moon at her feet and an atmosphere of mystery, intuition, and hidden knowledge.",
  "the-emperor":
    "Central symbol: A commanding emperor seated upon a monumental stone throne with rams and mountains behind him, holding the symbols of rule, with an atmosphere of authority, order, and durable structure.",
  "the-hierophant":
    "Central symbol: A sacred religious figure enthroned between pillars, holding a ceremonial staff while two acolytes kneel below, with an atmosphere of tradition, doctrine, and formal initiation.",
  "the-hermit":
    "Central symbol: A solitary hooded sage standing upon a high mountain peak, raising a radiant lantern and supporting himself with a staff, with deep stillness and an atmosphere of inner guidance, contemplation, and sacred withdrawal.",
  "wheel-of-fortune":
    "Central symbol: A monumental celestial wheel turning in the void, adorned with symbolic markings and surrounded by mysterious winged guardians at the four corners, with an atmosphere of fate, cycles, change, and cosmic law.",
  "death":
    "Central symbol: A skeletal rider in dark ceremonial armor advancing on a pale horse beneath a stark sky, with fallen figures, distant towers, and an atmosphere of ending, release, and irreversible transformation.",
  "temperance":
    "Central symbol: A radiant angelic figure pouring liquid between two cups in perfect balance, one foot on land and one in water, with a distant path and an atmosphere of harmony, blending, and spiritual proportion.",
  "the-devil":
    "Central symbol: A towering horned figure enthroned above two chained human forms, with an atmosphere of temptation, bondage, shadowed desire, and psychological attachment.",
  "the-tower":
    "Central symbol: A towering stone structure struck by a bolt of divine lightning, its crown blasted away as flames and falling figures descend through the night, with an atmosphere of rupture, revelation, and catastrophic truth.",
  "the-moon":
    "Central symbol: A great moon radiating over a winding path between two towers, with a wolf, a dog, and a creature rising from dark water, with an atmosphere of dream logic, fear, intuition, and obscured truth.",
  "the-sun":
    "Central symbol: A radiant sun blazing above a joyful child riding a white horse before sunflowers and a stone wall, with an atmosphere of vitality, revelation, innocence, and triumphant clarity.",
  "judgement":
    "Central symbol: A divine trumpet sounding above figures rising from stone tombs with arms uplifted, with an atmosphere of awakening, reckoning, absolution, and final calling."
};

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function writeJson(filePath, payload) {
  fs.writeFileSync(filePath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
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
  if (result.status !== 0) throw new Error(result.stderr || `curl request failed for ${url}`);
  return JSON.parse(result.stdout);
}

function extractTaskId(payload) {
  return payload?.data?.[0]?.task_id || payload?.data?.task_id || payload?.task_id || null;
}

function buildPrompt(subject) {
  return `A tarot card illustration following the 'Gilded Shadow' design philosophy. Full-bleed tarot card composition. The tarot card itself fills the entire canvas. The outer gold border sits very close to the image edges. No extra outer black padding. No card floating inside a larger background. Tall ceremonial tarot card layout with rounded corners. Luxurious black and gold palette. Predominantly black and gold. Highly ornamental, richly detailed, mystical, opulent. Single unified border architecture. No double border. No bright colors. No modern graphic minimalism. No flat icon look. A single ornate title cartouche at the bottom center. The cartouche must be uniform across the whole deck. The cartouche background must be solid warm matte gold. The cartouche interior must be clean and flat, with no texture variation, no black fill, no white fill, and no illustration details inside it. Do not vary the title cartouche style from card to card. Do not place any scene elements inside the title cartouche. ${subject} No text, no words, no letters. Museum-quality, masterfully crafted.`;
}

function makeRunId(slug) {
  return `${new Date().toISOString().replace(/[:.]/g, "-")}-${slug}`;
}

async function main() {
  ensureDir(RUNS_DIR);
  ensureDir(OUTPUT_ROOT);

  const cards = JSON.parse(fs.readFileSync(DATA_PATH, "utf8"));
  const selected = cards.filter((card) => card.arcana === "major" && TARGET_SLUGS.includes(card.slug));
  const submitUrl = `${normalizeBaseUrl(APIMART_BASE_URL)}/images/generations`;
  const summary = [];

  for (const card of selected) {
    const outputPath = path.join(OUTPUT_ROOT, `${String(card.number).padStart(2, "0")}-${card.slug}-fullbleed-v2.png`);
    const subject = SUBJECT_OVERRIDES[card.slug];
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
        number: card.number,
        status: "submitted",
        task_id: extractTaskId(submitPayload),
        outputPath
      });
    } catch (error) {
      summary.push({
        slug: card.slug,
        number: card.number,
        status: "submit-failed",
        error: error instanceof Error ? error.message : String(error),
        outputPath
      });
    }
  }

  const summaryPath = path.join(RUNS_DIR, `${new Date().toISOString().replace(/[:.]/g, "-")}-fullbleed-v2-major-selected-summary.json`);
  writeJson(summaryPath, summary);
  console.log(summaryPath);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
