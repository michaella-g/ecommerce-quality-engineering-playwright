# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: mobile.spec.ts >> Mobile viewport >> search, add to basket and view cart on a phone @smoke
- Location: tests/mobile.spec.ts:23:7

# Error details

```
TimeoutError: locator.click: Timeout 15000ms exceeded.
Call log:
  - waiting for locator('.product-item').locator('.product-title a').filter({ hasText: 'Apple MacBook Pro 13-inch' }).first()

```

# Page snapshot

```yaml
- generic [active] [ref=f4e1]:
  - main [ref=f4e2]:
    - generic [ref=f4e3]:
      - generic [ref=f4e4]:
        - img "Icon for demo.nopcommerce.com" [ref=f4e5]
        - heading "demo.nopcommerce.com" [level=1] [ref=f4e6]
      - heading "Performing security verification" [level=2] [ref=f4e7]
      - paragraph [ref=f4e8]: This website uses a security service to protect against malicious bots. This page is displayed while the website verifies you are not a bot.
  - contentinfo [ref=f4e13]:
    - generic [ref=f4e15]:
      - generic [ref=f4e17]:
        - text: "Ray ID:"
        - code [ref=f4e18]: a46d1a850e9ca580
      - generic [ref=f4e19]:
        - generic [ref=f4e20]:
          - text: Performance and Security by
          - link "Cloudflare, opens in a new tab" [ref=f4e21] [cursor=pointer]:
            - /url: https://www.cloudflare.com?utm_source=challenge&utm_campaign=m
            - text: Cloudflare
        - link "Privacy, opens in a new tab" [ref=f4e23] [cursor=pointer]:
          - /url: https://www.cloudflare.com/privacypolicy/
          - text: Privacy
```

# Test source

```ts
  1  | import { Page, Locator, expect } from '@playwright/test';
  2  | 
  3  | export class SearchPage {
  4  |   readonly box: Locator;
  5  |   readonly results: Locator;
  6  |   readonly noResult: Locator;
  7  |   readonly warning: Locator;
  8  | 
  9  |   constructor(readonly page: Page) {
  10 |     this.box = page.locator('#small-searchterms');
  11 |     this.results = page.locator('.product-item');
  12 |     this.noResult = page.locator('.search-results .no-result');
  13 |     this.warning = page.locator('.search-results .warning');
  14 |   }
  15 | 
  16 |   async goto() {
  17 |     await this.page.goto('/');
  18 |   }
  19 | 
  20 |   async search(term: string) {
  21 |     await this.box.fill(term);
  22 |     await this.box.press('Enter');
  23 |     await this.page.waitForURL(/\/search\?q=/);
  24 |   }
  25 | 
  26 |   titles() {
  27 |     return this.results.locator('.product-title a');
  28 |   }
  29 | 
  30 |   async open(name: string) {
> 31 |     await this.titles().filter({ hasText: name }).first().click();
     |                                                           ^ TimeoutError: locator.click: Timeout 15000ms exceeded.
  32 |     await expect(this.page.locator('.product-name h1')).toContainText(name);
  33 |   }
  34 | }
  35 | 
```