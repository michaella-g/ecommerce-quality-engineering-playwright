import { test as setup, expect } from '@playwright/test';
import { waitForChallengeToClear } from '../utils/cloudflare';

// One setup run per browser project (setup-chromium, setup-firefox, ...).
// cf_clearance is tied to the browser's user agent and IP, so each browser gets its own session file.
setup('pass the Cloudflare check and save the session', async ({ page, context }, testInfo) => {
  const name = testInfo.project.name.replace(/^setup-/, '');
  // In manual mode (headed) allow time for a human to tick the checkbox.
  const patience = process.env.CF_MANUAL ? 5 * 60_000 : 60_000;
  setup.setTimeout(patience + 30_000);

  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await waitForChallengeToClear(page, patience);
  await expect(page.locator('#small-searchterms')).toBeVisible();

  await context.storageState({ path: `.auth/${name}.json` });
});
