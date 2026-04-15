import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";

const ROOT = process.cwd();
const APIMART_API_KEY = process.env.APIMART_API_KEY || "sk-1WtbbHyxApD05Vk3dFxEbqTH16OBpI9ZG9Ia8pKBZJrozLsG";
const APIMART_BASE_URL = (process.env.APIMART_URL || "https://api.apimart.ai/v1/chat/completions").replace(/\/$/, "");

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function normalizeBaseUrl(url) {
  return url
    .replace(/\/$/, "")
    .replace(/\/chat\/completions$/, "")
    .replace(/\/images\/generations$/, "");
}

function requestJsonWithCurl({ url, apiKey }) {
  const result = spawnSync("curl", [
    "-sS",
    "-L",
    "--retry", "2",
    "--connect-timeout", "20",
    "--max-time", "60",
    "-H", `Authorization: Bearer ${apiKey}`,
    "-H", "Accept: application/json",
    url
  ], { encoding: "utf8", maxBuffer: 1024 * 1024 * 10 });

  if (result.status !== 0) {
    throw new Error(result.stderr || `curl request failed for ${url}`);
  }

  return JSON.parse(result.stdout);
}

function saveImageFromUrl(imageUrl, destPath) {
  const result = spawnSync("curl", ["-s", "-L", "-o", destPath, imageUrl], {
    encoding: "utf8",
    maxBuffer: 1024 * 1024 * 10
  });

  if (result.status !== 0) {
    throw new Error(result.stderr || `Image download failed with exit code ${result.status}`);
  }
}

function parseArgs(argv) {
  const parsed = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token.startsWith("--")) {
      const key = token.slice(2);
      const next = argv[i + 1];
      if (!next || next.startsWith("--")) {
        parsed[key] = true;
      } else {
        parsed[key] = next;
        i += 1;
      }
    }
  }
  return parsed;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const summaryPath = args.summary;
  const force = args.force === true || args.force === "true";
  if (!summaryPath) {
    throw new Error("Missing --summary path");
  }

  const items = JSON.parse(fs.readFileSync(summaryPath, "utf8"));
  const pollBaseUrl = `${normalizeBaseUrl(APIMART_BASE_URL)}/tasks`;

  const results = [];

  for (const item of items) {
    if (!item.task_id || !item.outputPath) {
      results.push({ ...item, pull_status: "skipped-missing-task-or-output" });
      continue;
    }

    if (fs.existsSync(item.outputPath) && !force) {
      results.push({ ...item, pull_status: "already-exists" });
      continue;
    }

    try {
      const statusPayload = requestJsonWithCurl({
        url: `${pollBaseUrl}/${item.task_id}?language=en`,
        apiKey: APIMART_API_KEY
      });

      const task = statusPayload?.data;
      const status = task?.status;
      const rawUrl =
        task?.result?.images?.[0]?.url?.[0]
        || task?.result?.images?.[0]?.url
        || task?.result?.url
        || null;
      const resultUrl = Array.isArray(rawUrl)
        ? rawUrl[0]
        : typeof rawUrl === "string"
          ? rawUrl.split(",")[0].trim()
          : null;

      if (status === "completed" && resultUrl) {
        ensureDir(path.dirname(item.outputPath));
        saveImageFromUrl(resultUrl, item.outputPath);
        results.push({ ...item, pull_status: force ? "downloaded-overwrite" : "downloaded" });
      } else {
        results.push({ ...item, pull_status: status || "unknown", raw: task || null });
      }
    } catch (error) {
      results.push({
        ...item,
        pull_status: "pull-failed",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  const outPath = path.join(
    ROOT,
    "state",
    "imagegen-runs",
    `${new Date().toISOString().replace(/[:.]/g, "-")}-fullbleed-pull-summary.json`
  );
  fs.writeFileSync(outPath, `${JSON.stringify(results, null, 2)}\n`, "utf8");
  console.log(outPath);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
