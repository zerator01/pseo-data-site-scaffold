import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";

const ROOT = process.cwd();
const SOURCE_ROOT = path.join(ROOT, "public", "cards-goldcrop-webp");
const RUNS_DIR = path.join(ROOT, "state", "imagegen-runs");
const BUCKET_NAME = process.env.R2_BUCKET_NAME || "dailytarot-assets";
const PUBLIC_DOMAIN = process.env.R2_PUBLIC_DOMAIN || "https://img.dailytarot.org";
const PREFIX = process.env.R2_PREFIX || "cards";

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function walk(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const target = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walk(target));
    } else if (entry.isFile() && target.endsWith(".webp")) {
      files.push(target);
    }
  }
  return files;
}

function upload(localPath, objectKey) {
  const result = spawnSync(
    "npx",
    ["wrangler", "r2", "object", "put", `${BUCKET_NAME}/${objectKey}`, `--file=${localPath}`, "--remote"],
    { encoding: "utf8", maxBuffer: 1024 * 1024 * 20 }
  );

  if (result.status !== 0) {
    throw new Error(result.stderr || result.stdout || `Upload failed for ${objectKey}`);
  }
}

function main() {
  ensureDir(RUNS_DIR);
  const files = walk(SOURCE_ROOT);
  const summary = [];

  for (const file of files) {
    const rel = path.relative(SOURCE_ROOT, file).replace(/\\/g, "/");
    const objectKey = `${PREFIX}/${rel}`;
    const url = `${PUBLIC_DOMAIN}/${objectKey}`;

    try {
      upload(file, objectKey);
      summary.push({
        localPath: file,
        objectKey,
        url,
        status: "uploaded",
      });
    } catch (error) {
      summary.push({
        localPath: file,
        objectKey,
        url,
        status: "failed",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  const summaryPath = path.join(RUNS_DIR, `${new Date().toISOString().replace(/[:.]/g, "-")}-goldcrop-webp-upload-summary.json`);
  fs.writeFileSync(summaryPath, `${JSON.stringify(summary, null, 2)}\n`, "utf8");
  console.log(summaryPath);
}

main();
