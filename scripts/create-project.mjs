import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';

const sourceRoot = process.cwd();
const args = process.argv.slice(2);

const SKIP_NAMES = new Set([
  '.git',
  '.next',
  'node_modules',
  'dist',
  'coverage',
  'out',
]);

function parseArgs(argv) {
  let target = null;
  const flags = {
    install: false,
    init: false,
    refresh: false,
  };

  for (const arg of argv) {
    if (arg === '--install') {
      flags.install = true;
      continue;
    }

    if (arg === '--init') {
      flags.init = true;
      continue;
    }

    if (arg === '--refresh') {
      flags.refresh = true;
      flags.init = true;
      flags.install = true;
      continue;
    }

    if (arg.startsWith('--')) {
      fail(`Unknown flag: ${arg}`);
    }

    if (target) {
      fail('Only one target directory may be provided.');
    }

    target = arg;
  }

  return { target, flags };
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

function slugifyProjectName(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function titleCase(value) {
  return value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function copyRecursive(sourcePath, targetPath) {
  const stat = fs.statSync(sourcePath);

  if (stat.isDirectory()) {
    fs.mkdirSync(targetPath, { recursive: true });
    for (const entry of fs.readdirSync(sourcePath)) {
      if (SKIP_NAMES.has(entry)) {
        continue;
      }

      copyRecursive(path.join(sourcePath, entry), path.join(targetPath, entry));
    }
    return;
  }

  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.copyFileSync(sourcePath, targetPath);
}

function updateCopiedConfig(targetRoot) {
  const configPath = path.join(targetRoot, 'scaffold.config.json');
  const targetName = path.basename(targetRoot);
  const projectName = slugifyProjectName(targetName);

  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  config.projectName = projectName;
  config.siteName = titleCase(targetName);
  config.siteUrl = `https://${projectName}.example.com`;

  fs.writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`);
}

function runStep(command, commandArgs, cwd) {
  console.log(`Running: ${command} ${commandArgs.join(' ')}`);
  execFileSync(command, commandArgs, {
    cwd,
    stdio: 'inherit',
  });
}

function main() {
  const { target, flags } = parseArgs(args);

  if (!target) {
    fail(
      'Usage: npm run create:project -- <target-directory> [--install] [--init] [--refresh]'
    );
  }

  const targetRoot = path.resolve(sourceRoot, target);

  if (targetRoot === sourceRoot) {
    fail('Target directory must be different from the scaffold source directory.');
  }

  if (targetRoot.startsWith(`${sourceRoot}${path.sep}`)) {
    fail('Target directory cannot be nested inside the scaffold source directory.');
  }

  if (fs.existsSync(targetRoot)) {
    const entries = fs.readdirSync(targetRoot);
    if (entries.length > 0) {
      fail(`Target directory already exists and is not empty: ${targetRoot}`);
    }
  }

  copyRecursive(sourceRoot, targetRoot);
  updateCopiedConfig(targetRoot);

  if (flags.install) {
    runStep('npm', ['install'], targetRoot);
  }

  if (flags.init) {
    runStep('npm', ['run', 'init:project'], targetRoot);
  }

  if (flags.refresh) {
    runStep('npm', ['run', 'refresh:data'], targetRoot);
  }

  console.log(`Created starter project at ${targetRoot}`);
  console.log('Next steps:');
  console.log(`  cd ${targetRoot}`);

  if (!flags.install) {
    console.log('  npm install');
  }

  if (!flags.init) {
    console.log('  npm run init:project');
  }

  if (!flags.refresh) {
    console.log('  npm run refresh:data');
  }
}

main();
