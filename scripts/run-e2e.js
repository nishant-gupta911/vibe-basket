#!/usr/bin/env node
/**
 * E2E Test Runner with Dynamic Port Allocation
 *
 * 1. Finds a free port for the Next.js dev server.
 * 2. Ensures the backend database schema is in sync.
 * 3. Seeds minimal data if the DB is empty.
 * 4. Launches Playwright with E2E_PORT / E2E_BASE_URL so tests never
 *    collide on a fixed port.
 */

const net = require('net');
const { execSync } = require('child_process');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const BACKEND = path.join(ROOT, 'backend');

function findFreePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.unref();
    server.on('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      server.close(() => resolve(port));
    });
  });
}

function ensureDbReady() {
  try {
    console.log('[e2e] Syncing database schema …');
    execSync('npx prisma db push --skip-generate --accept-data-loss --force-reset', {
      cwd: BACKEND,
      stdio: 'pipe',
      env: { ...process.env, DATABASE_URL: getTestDbUrl() },
    });
    // Seed data
    execSync('npx ts-node prisma/seed.test.ts', {
      cwd: BACKEND,
      stdio: 'pipe',
      env: { ...process.env, DATABASE_URL: getTestDbUrl() },
    });
    console.log('[e2e] Database ready');
  } catch (err) {
    console.warn('[e2e] DB sync warning (non-fatal):', err.message?.split('\n')[0]);
  }
}

function getTestDbUrl() {
  // Read DATABASE_URL from backend/.env and derive a test URL
  const fs = require('fs');
  const envPath = path.join(BACKEND, '.env');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    const match = content.match(/^DATABASE_URL="?([^"\n]+)"?/m);
    if (match) {
      return match[1].replace(/\/[^/?]*\?/, '/vibebasket_test?');
    }
  }
  return `postgresql://${process.env.USER || 'postgres'}@localhost:5432/vibebasket_test?schema=public`;
}

async function main() {
  try {
    ensureDbReady();

    const port = await findFreePort();
    console.log(`[e2e] Allocated free port: ${port}`);

    const env = {
      ...process.env,
      E2E_PORT: String(port),
      E2E_BASE_URL: `http://127.0.0.1:${port}`,
      DATABASE_URL: getTestDbUrl(),
      CORS_ORIGINS: `http://localhost:3000,http://localhost:3001,http://127.0.0.1:${port},http://localhost:${port}`,
    };

    const args = process.argv.slice(2).join(' ');
    const cmd = `npx playwright test ${args}`;

    console.log(`[e2e] Running: ${cmd}`);
    execSync(cmd, { stdio: 'inherit', env, cwd: ROOT });
  } catch (err) {
    if (err.status) {
      process.exit(err.status);
    }
    console.error('[e2e] Fatal error:', err.message);
    process.exit(1);
  }
}

main();
