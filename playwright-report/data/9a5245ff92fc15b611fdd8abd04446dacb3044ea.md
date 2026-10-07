# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: accessibility.spec.ts >> Accessibility (axe-core, WCAG 2.1 A/AA) >> login form fields have accessible names
- Location: tests/accessibility.spec.ts:43:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByLabel('Email')
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByLabel('Email') with timeout 10000ms
  - waiting for getByLabel('Email')

```

```yaml
- main:
  - img "Icon for demo.nopcommerce.com"
  - heading "demo.nopcommerce.com" [level=1]
  - heading "Performing security verification" [level=2]
  - paragraph: This website uses a security service to protect against malicious bots. This page is displayed while the website verifies you are not a bot.
- contentinfo:
  - text: "Ray ID:"
  - code: a46d14b388ae93e8
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
  1  | import AxeBuilder from '@axe-core/playwright';
  2  | import { test, expect } from './fixtures';
  3  | 
  4  | const PAGES = [
  5  |   { name: 'Home', url: '/' },
  6  |   { name: 'Category', url: '/notebooks' },
  7  |   { name: 'Product', url: '/apple-macbook-pro-13-inch' },
  8  |   { name: 'Cart', url: '/cart' },
  9  |   { name: 'Login', url: '/login' },
  10 | ];
  11 | 
  12 | test.describe('Accessibility (axe-core, WCAG 2.1 A/AA)', () => {
  13 |   for (const { name, url } of PAGES) {
  14 |     test(`${name} page has no critical violations`, async ({ page }, testInfo) => {
  15 |       await page.goto(url);
  16 |       const results = await new AxeBuilder({ page })
  17 |         .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
  18 |         .analyze();
  19 | 
  20 |       // Attach the full report so every violation is visible in the HTML report
  21 |       await testInfo.attach(`axe-${name}`, {
  22 |         body: JSON.stringify(results.violations, null, 2),
  23 |         contentType: 'application/json',
  24 |       });
  25 | 
  26 |       // A public demo store will have some issues. Gate on critical only;
  27 |       // tighten to serious + critical once the baseline is clean.
  28 |       const blocking = results.violations.filter((v) => v.impact === 'critical');
  29 |       expect(blocking, blocking.map((v) => `${v.id}: ${v.help}`).join('\n')).toEqual([]);
  30 |     });
  31 |   }
  32 | 
  33 |   test('search is usable by keyboard alone', async ({ page }) => {
  34 |     await page.goto('/');
  35 |     const search = page.locator('#small-searchterms');
  36 |     await search.focus();
  37 |     await expect(search).toBeFocused();
  38 |     await page.keyboard.type('MacBook');
  39 |     await page.keyboard.press('Enter');
  40 |     await expect(page).toHaveURL(/search\?q=MacBook/);
  41 |   });
  42 | 
  43 |   test('login form fields have accessible names', async ({ page }) => {
  44 |     await page.goto('/login');
> 45 |     await expect(page.getByLabel('Email')).toBeVisible();
     |                                            ^ Error: expect(locator).toBeVisible() failed
  46 |     await expect(page.getByLabel('Password')).toBeVisible();
  47 |     await expect(page.getByRole('button', { name: 'Log in' })).toBeVisible();
  48 |   });
  49 | });
  50 | 
```