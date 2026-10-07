import { defineConfig, devices, Project } from '@playwright/test';

const isCI = !!process.env.CI;

// Headless browsers are the ones Cloudflare challenges hardest. Use HEADLESS=false (with xvfb on CI)
// or CHANNEL=chrome (real Chrome build) if the challenge won't clear.
const headless = process.env.HEADLESS !== 'false';
const channel = process.env.CHANNEL; // e.g. "chrome"

const targets = [
  { name: 'chromium', device: 'Desktop Chrome', mobile: false },
  { name: 'firefox', device: 'Desktop Firefox', mobile: false },
  { name: 'webkit', device: 'Desktop Safari', mobile: false },
  { name: 'mobile-chrome', device: 'Pixel 7', mobile: true },
  { name: 'mobile-safari', device: 'iPhone 14', mobile: true },
];

const projects: Project[] = targets.flatMap(({ name, device, mobile }) => {
  const base = {
    ...devices[device],
    headless,
    ...(channel && name === 'chromium' ? { channel } : {}),
  };
  return [
    // 1) clear the Cloudflare check once and save the session
    { name: `setup-${name}`, testMatch: /auth\.setup\.ts/, use: base },
    // 2) real tests reuse that session
    {
      name,
      dependencies: [`setup-${name}`],
      use: { ...base, storageState: `.auth/${name}.json` },
      ...(mobile
        ? { testMatch: /mobile\.spec/ }
        : { testIgnore: [/mobile\.spec/, /auth\.setup/] }),
    },
  ];
});

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  // Low concurrency: a shared public site behind Cloudflare rate-limits aggressive clients
  workers: isCI ? 1 : 2,

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
    navigationTimeout: 45_000,
  },

  projects,
});
