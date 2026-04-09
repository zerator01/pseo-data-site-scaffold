import fs from 'fs';
import os from 'os';
import path from 'path';
import { execFileSync } from 'child_process';

const root = process.cwd();

function run(command, args, cwd) {
  console.log(`Running: ${command} ${args.join(' ')}`);
  execFileSync(command, args, {
    cwd,
    stdio: 'inherit',
  });
}

function main() {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'pseo-scaffold-smoke-'));

  try {
    run(
      'node',
      ['scripts/create-project.mjs', tempRoot, '--install', '--init', '--refresh'],
      root
    );
    run('npm', ['run', 'build'], tempRoot);
    console.log(`Smoke test passed in ${tempRoot}`);
  } catch (error) {
    console.error(`Smoke test failed in ${tempRoot}`);
    throw error;
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
}

main();
