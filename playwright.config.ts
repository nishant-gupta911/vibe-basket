import { defineConfig, devices } from '@playwright/test';

/**
 * Port is allocated dynamically by scripts/run-e2e.js and passed via
 * the E2E_PORT / E2E_BASE_URL environment variables so tests never
 * collide on a fixed port.
 */
const port = process.env.E2E_PORT || '0'; // 0 = let OS choose
const baseURL = process.env.E2E_BASE_URL || `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: [
    {
      command: 'cd backend && npm run dev',
      url: 'http://127.0.0.1:4000/api/health',
      reuseExistingServer: !process.env.CI && !process.env.E2E_PORT,
      timeout: 60_000,
    },
    {
      command: `cd frontend && npm run dev -- --hostname 127.0.0.1 --port ${port}`,
      url: baseURL,
      reuseExistingServer: !process.env.CI && !process.env.E2E_PORT,
      timeout: 60_000,
    },
  ],
});
