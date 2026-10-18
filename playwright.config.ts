import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
  ],
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'Desktop Chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 900 },
      },
    },
    {
      name: 'Tablet Chromium',
      use: {
        ...devices['iPad (gen 7)'],
        viewport: { width: 768, height: 1024 },
      },
    },
    {
      name: 'Mobile Chromium',
      use: {
        ...devices['iPhone 14'],
        viewport: { width: 390, height: 844 },
      },
    },
  ],
  webServer: {
    command: 'npm run preview -- --port 5173',
    port: 5173,
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
