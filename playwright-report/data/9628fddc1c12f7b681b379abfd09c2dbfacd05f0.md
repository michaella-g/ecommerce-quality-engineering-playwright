# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: accessibility.spec.ts >> Accessibility (axe-core, WCAG 2.1 A/AA) >> Login page has no critical violations
- Location: tests/accessibility.spec.ts:14:9

# Error details

```
Error: meta-refresh: Delayed refresh under 20 hours must not be used

expect(received).toEqual(expected) // deep equality

- Expected  -  1
+ Received  + 44

- Array []
+ Array [
+   Object {
+     "description": "Ensure <meta http-equiv=\"refresh\"> is not used for delayed refresh",
+     "help": "Delayed refresh under 20 hours must not be used",
+     "helpUrl": "https://dequeuniversity.com/rules/axe/4.13/meta-refresh?application=playwright",
+     "id": "meta-refresh",
+     "impact": "critical",
+     "nodes": Array [
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "redirectDelay": 360,
+             },
+             "id": "meta-refresh",
+             "impact": "critical",
+             "message": "<meta> tag forces timed refresh of page (less than 20 hours)",
+             "relatedNodes": Array [],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   <meta> tag forces timed refresh of page (less than 20 hours)",
+         "html": "<meta http-equiv=\"refresh\" content=\"360\">",
+         "impact": "critical",
+         "none": Array [],
+         "target": Array [
+           "meta[http-equiv=\"refresh\"]",
+         ],
+       },
+     ],
+     "tags": Array [
+       "cat.time-and-media",
+       "wcag2a",
+       "wcag221",
+       "TTv5",
+       "TT8.a",
+       "EN-301-549",
+       "EN-9.2.2.1",
+       "RGAAv4",
+       "RGAA-13.1.2",
+     ],
+   },
+ ]
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - main [ref=e2]:
    - generic [ref=e3]:
      - generic [ref=e4]:
        - img "Icon for demo.nopcommerce.com" [ref=e5]
        - heading "demo.nopcommerce.com" [level=1] [ref=e6]
      - heading "Performing security verification" [level=2] [ref=e7]
      - paragraph [ref=e8]: This website uses a security service to protect against malicious bots. This page is displayed while the website verifies you are not a bot.
  - contentinfo [ref=e13]:
    - generic [ref=e15]:
      - generic [ref=e17]:
        - text: "Ray ID:"
        - code [ref=e18]: a46d18973a374172
      - generic [ref=e19]:
        - generic [ref=e20]:
          - text: Performance and Security by
          - link "Cloudflare, opens in a new tab" [ref=e21] [cursor=pointer]:
            - /url: https://www.cloudflare.com?utm_source=challenge&utm_campaign=m
            - text: Cloudflare
        - link "Privacy, opens in a new tab" [ref=e23] [cursor=pointer]:
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
> 29 |       expect(blocking, blocking.map((v) => `${v.id}: ${v.help}`).join('\n')).toEqual([]);
     |                                                                              ^ Error: meta-refresh: Delayed refresh under 20 hours must not be used
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
  45 |     await expect(page.getByLabel('Email')).toBeVisible();
  46 |     await expect(page.getByLabel('Password')).toBeVisible();
  47 |     await expect(page.getByRole('button', { name: 'Log in' })).toBeVisible();
  48 |   });
  49 | });
  50 | 
```