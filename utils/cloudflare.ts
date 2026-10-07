import { Page, expect } from '@playwright/test';

const TITLE = /just a moment|attention required|verify you are human|checking your browser/i;
const MARKERS =
  '#challenge-form, #challenge-running, #cf-challenge-running, #challenge-stage, iframe[src*="challenges.cloudflare.com"]';

/** True while a Cloudflare interstitial/challenge is on screen (or the page is mid-navigation). */
export async function isChallenge(page: Page): Promise<boolean> {
  try {
    if (TITLE.test(await page.title())) return true;
    return (await page.locator(MARKERS).count()) > 0;
  } catch {
    return true; // page is navigating (e.g. the challenge redirecting back) - keep waiting
  }
}

/**
 * Waits for the Cloudflare check to finish. Non-interactive JS challenges usually clear on their own;
 * an interactive one needs a human (run `npm run auth:manual`). Fails with an actionable message.
 */
export async function waitForChallengeToClear(page: Page, timeout = 45_000) {
  if (!(await isChallenge(page))) return;
  await expect
    .poll(() => isChallenge(page), {
      timeout,
      intervals: [500, 1000, 2000],
      message:
        'Cloudflare challenge did not clear. Run `npm run auth:manual` (headed) to solve it once and ' +
        'save the session, or test against a self-hosted nopCommerce instance via BASE_URL.',
    })
    .toBe(false);
}
