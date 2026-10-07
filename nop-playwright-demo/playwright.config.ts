import { defineConfig, devices } from '@playwright/test';

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './tests',
  timeout: 45_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  // The demo store is a shared public site, so be polite with concurrency
  workers: isCI ? 2 : undefined,

  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ...(isCI ? [['github'] as ['github']] : []),
  ],

  use: {
    baseURL: process.env.BASE_URL ?? 'https://demo.nopcommerce.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },

  projects: [
    // Desktop: cross-browser. Everything except the mobile spec.
    { name: 'chromium', use: { ...devices['Desktop Chrome'] }, testIgnore: /mobile\.spec/ },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] }, testIgnore: /mobile\.spec/ },
    { name: 'webkit', use: { ...devices['Desktop Safari'] }, testIgnore: /mobile\.spec/ },

    // Mobile: only the mobile spec
    { name: 'mobile-chrome', use: { ...devices['Pixel 7'] }, testMatch: /mobile\.spec/ },
    { name: 'mobile-safari', use: { ...devices['iPhone 14'] }, testMatch: /mobile\.spec/ },
  ],
});
