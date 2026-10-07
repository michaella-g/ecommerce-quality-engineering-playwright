# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: mobile.spec.ts >> Mobile viewport >> navigation collapses behind the menu toggle
- Location: tests/mobile.spec.ts:14:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('.menu-toggle')
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" locator('.menu-toggle') with timeout 10000ms
  - waiting for locator('.menu-toggle')

```

```yaml
- main:
  - img "Icon for demo.nopcommerce.com"
  - heading "demo.nopcommerce.com" [level=1]
  - heading "Performing security verification" [level=2]
  - paragraph: This website uses a security service to protect against malicious bots. This page is displayed while the website verifies you are not a bot.
- contentinfo:
  - text: "Ray ID:"
  - code: a46d1a4f8c324f9c
  - text: Performance and Security by
  - link "Cloudflare, opens in a new tab":
    - /url: https://www.cloudflare.com?utm_source=challenge&utm_campaign=m
    - text: Cloudflare
  - link "Privacy, opens in a new tab":
    - /url: https://www.cloudflare.com/privacypolicy/
    - text: Privacy
```

# Test source

```ts
  1  | import { test, expect } from './fixtures';
  2  | import { PRODUCTS } from '../utils/helpers';
  3  | 
  4  | // Runs only in the mobile-chrome / mobile-safari projects (see playwright.config.ts)
  5  | test.describe('Mobile viewport', () => {
  6  |   test('page does not scroll horizontally', async ({ page }) => {
  7  |     await page.goto('/');
  8  |     const overflow = await page.evaluate(
  9  |       () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  10 |     );
  11 |     expect(overflow).toBeLessThanOrEqual(1);
  12 |   });
  13 | 
  14 |   test('navigation collapses behind the menu toggle', async ({ page }) => {
  15 |     await page.goto('/');
  16 |     const toggle = page.locator('.menu-toggle');
> 17 |     await expect(toggle).toBeVisible();
     |                          ^ Error: expect(locator).toBeVisible() failed
  18 |     await expect(page.locator('.top-menu.mobile')).toBeHidden();
  19 |     await toggle.click();
  20 |     await expect(page.locator('.top-menu.mobile')).toBeVisible();
  21 |   });
  22 | 
  23 |   test('search, add to basket and view cart on a phone @smoke', async ({
  24 |     page,
  25 |     searchPage,
  26 |     productPage,
  27 |     cartPage,
  28 |   }) => {
  29 |     await searchPage.goto();
  30 |     // The search box can sit behind a toggle on small screens; fall back to the URL if hidden
  31 |     if (await searchPage.box.isHidden()) {
  32 |       await page.goto(`/search?q=${PRODUCTS.macbook.search}`);
  33 |     } else {
  34 |       await searchPage.search(PRODUCTS.macbook.search);
  35 |     }
  36 |     await searchPage.open(PRODUCTS.macbook.name);
  37 |     await productPage.add(1);
  38 |     await cartPage.goto();
  39 |     await expect(cartPage.row(PRODUCTS.macbook.name)).toBeVisible();
  40 |     await expect(cartPage.checkoutButton).toBeVisible();
  41 |   });
  42 | });
  43 | 
```