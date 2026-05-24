import path from 'node:path';
import { defineConfig, devices } from '@playwright/test';

/** Config lives in tests/e2e/ — webServer must run from repo root. */
const repoRoot = path.resolve(__dirname, '../..');
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:4200';

export default defineConfig({
  testDir: './specs',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: '../../playwright-report' }],
  ],
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: process.env.PLAYWRIGHT_SKIP_WEBSERVER
    ? undefined
    : {
        command: 'bash scripts/e2e-web-server.sh',
        cwd: repoRoot,
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 180_000,
      },
});
