#!/usr/bin/env node
// npm run ship: build locally, then deploy to Hostinger through the Hostinger MCP server.
//
// It starts the same server Claude Code uses (`npx -y hostinger-api-mcp`) over stdio and calls its
// `hosting_deploy` operation, then polls `hosting_get-deployment` until the server-side build ends.
// Auth: HOSTINGER_API_TOKEN if set, otherwise the server's stored OAuth sign-in
// (run `npx hostinger-api-mcp --login` once if it has none).
//
// Flags:
//   --dry-run     build and stage the upload, list the files, deploy nothing
//   --skip-build  don't run `next build` locally first
// Env:
//   SHIP_DOMAIN   override the target domain (default jakeyabutabella.com)

import { spawn, execSync, execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DOMAIN = process.env.SHIP_DOMAIN || 'jakeyabutabella.com';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
// hosting_deploy refuses folders under the home directory's AppData/dotfiles, so the system temp
// dir is out; stage inside the project instead (git-ignored).
const STAGE = path.join(ROOT, '.ship', 'site');
// Never uploaded even if untracked-but-not-ignored.
const EXCLUDE = [/^\.claude\//, /^\.ship\//, /^scripts\/ship\.mjs$/];
const POLL_TIMEOUT_MS = 20 * 60 * 1000;

const args = new Set(process.argv.slice(2));
const dryRun = args.has('--dry-run');
const skipBuild = args.has('--skip-build');

const step = (msg) => console.log(`\n\x1b[1;36m==> ${msg}\x1b[0m`);
const fail = (msg) => {
  console.error(`\n\x1b[31m✗ ${msg}\x1b[0m`);
  process.exit(1);
};

// 1. Local build: fail fast before uploading anything.
if (!skipBuild) {
  step('Building locally (next build)');
  try {
    execSync('npm run build', { cwd: ROOT, stdio: 'inherit' });
  } catch {
    fail('Local build failed; nothing was deployed.');
  }
}

// 2. Stage the source: tracked + untracked files that .gitignore doesn't exclude.
step('Staging files');
const listed = execFileSync('git', ['ls-files', '-co', '--exclude-standard', '-z'], { cwd: ROOT, encoding: 'utf8' })
  .split('\0')
  .filter(Boolean)
  .filter((f) => !EXCLUDE.some((re) => re.test(f)))
  .filter((f) => fs.existsSync(path.join(ROOT, f))); // skip tracked files deleted in the working tree
fs.rmSync(STAGE, { recursive: true, force: true });
for (const file of listed) {
  const dest = path.join(STAGE, file);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(path.join(ROOT, file), dest);
}
console.log(`${listed.length} files staged in ${path.relative(ROOT, STAGE)}`);

if (dryRun) {
  for (const f of listed) console.log('  ' + f);
  console.log(`\nDry run: would deploy to ${DOMAIN}. Nothing was uploaded.`);
  process.exit(0);
}

// 3. Talk to the Hostinger MCP server over stdio (newline-delimited JSON-RPC).
step('Starting Hostinger MCP server');
// One command string (no args array) so Windows can run npx.cmd through the shell without DEP0190.
const server = spawn('npx -y hostinger-api-mcp', {
  cwd: ROOT,
  stdio: ['pipe', 'pipe', 'pipe'],
  shell: true,
});
let serverLog = '';
server.stderr.on('data', (d) => {
  serverLog += d;
  if (process.env.DEBUG) process.stderr.write(d);
});
server.on('exit', (code) => {
  if (pending.size) fail(`MCP server exited (code ${code}).\n${serverLog.slice(-2000)}`);
});

let nextId = 1;
const pending = new Map();
let buffer = '';
server.stdout.on('data', (chunk) => {
  buffer += chunk;
  let nl;
  while ((nl = buffer.indexOf('\n')) >= 0) {
    const line = buffer.slice(0, nl).trim();
    buffer = buffer.slice(nl + 1);
    if (!line) continue;
    let msg;
    try {
      msg = JSON.parse(line);
    } catch {
      continue;
    }
    const waiter = msg.id !== undefined && pending.get(msg.id);
    if (!waiter) continue;
    pending.delete(msg.id);
    msg.error ? waiter.reject(new Error(msg.error.message)) : waiter.resolve(msg.result);
  }
});

const send = (msg) => server.stdin.write(JSON.stringify(msg) + '\n');
const request = (method, params) =>
  new Promise((resolve, reject) => {
    const id = nextId++;
    pending.set(id, { resolve, reject });
    send({ jsonrpc: '2.0', id, method, params });
  });

// Call the server's `execute` tool and return the operation's parsed JSON result.
async function execute(operation, params) {
  const result = await request('tools/call', { name: 'execute', arguments: { operation, params } });
  const text = (result.content || []).map((c) => c.text || '').join('\n');
  if (result.isError) throw new Error(text || `${operation} failed`);
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const stop = () => {
  server.stdin.end();
  server.kill();
};

try {
  await request('initialize', {
    protocolVersion: '2025-06-18',
    capabilities: {},
    clientInfo: { name: 'ship-script', version: '1.0.0' },
  });
  send({ jsonrpc: '2.0', method: 'notifications/initialized' });

  // 4. Deploy. rootDirectory '.' because the staged folder itself is the project root
  // (the site's stored setting points at a 'jakeabella' subfolder from an older hand-made zip).
  step(`Deploying to ${DOMAIN}`);
  const deploy = await execute('hosting_deploy', {
    domain: DOMAIN,
    path: STAGE,
    type: 'nodejs',
    appType: 'next',
    rootDirectory: '.',
    buildScript: 'build',
    outputDirectory: '.next',
    nodeVersion: 22,
    packageManager: 'npm',
  });
  if (deploy.skippedFiles?.length) console.log('Skipped (secrets):', deploy.skippedFiles.join(', '));
  const buildUuid = deploy.buildUuid;
  if (!buildUuid) throw new Error('No buildUuid returned:\n' + JSON.stringify(deploy, null, 2));
  console.log(`Build started: ${buildUuid}`);

  // 5. Poll the server-side build, streaming new log lines.
  step('Waiting for server build');
  const started = Date.now();
  let fromLine = 0;
  let delay = 3000;
  let state;
  while (true) {
    await sleep(delay);
    const status = await execute('hosting_get-deployment', { domain: DOMAIN, buildUuid, fromLine });
    const logs = status.logs?.logs;
    if (logs) process.stdout.write(logs.endsWith('\n') ? logs : logs + '\n');
    if (typeof status.logs?.lines === 'number') fromLine = status.logs.lines;
    state = status.build?.state;
    if (state === 'completed' || state === 'failed') {
      if (state === 'failed' && status.analysis) console.log('\nFailure analysis:\n' + JSON.stringify(status.analysis, null, 2));
      break;
    }
    if (Date.now() - started > POLL_TIMEOUT_MS) throw new Error(`Timed out waiting for build ${buildUuid} (last state: ${state})`);
    delay = Math.min(delay * 1.5, 20000);
  }

  stop();
  fs.rmSync(path.join(ROOT, '.ship'), { recursive: true, force: true });
  if (state !== 'completed') fail(`Build ${buildUuid} failed.`);
  console.log(`\n\x1b[32m✓ Shipped to https://${DOMAIN}\x1b[0m`);
} catch (error) {
  stop();
  fail(error instanceof Error ? error.message : String(error));
}
