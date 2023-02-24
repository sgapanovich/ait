import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30 * 1000,
  expect: {
    timeout: 5000
  },
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: "http://localhost:8080",
    launchOptions: {
      slowMo: 2000,
    },
    headless: false,
    browserName: "chromium",
    actionTimeout: 0,
    trace: 'on-first-retry',
    video: "retain-on-failure",
  },
});
