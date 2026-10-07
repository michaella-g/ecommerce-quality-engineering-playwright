# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: search-and-select.spec.ts >> Product selection >> category page can be sorted by price, low to high
- Location: tests/search-and-select.spec.ts:35:7

# Error details

```
TimeoutError: locator.selectOption: Timeout 15000ms exceeded.
Call log:
  - waiting for locator('#products-orderby')

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
        - code [ref=e18]: a46d15c36ecccc1d
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
  1  | import { test, expect } from './fixtures';
  2  | import { PRODUCTS, parseMoney } from '../utils/helpers';
  3  | 
  4  | test.describe('Product search', () => {
  5  |   test.beforeEach(async ({ searchPage }) => searchPage.goto());
  6  | 
  7  |   test('finds a product by keyword @smoke', async ({ searchPage }) => {
  8  |     await searchPage.search(PRODUCTS.macbook.search);
  9  |     await expect(searchPage.titles().filter({ hasText: PRODUCTS.macbook.name })).toHaveCount(1);
  10 |   });
  11 | 
  12 |   test('every result matches a multi-result term', async ({ searchPage }) => {
  13 |     await searchPage.search('Lenovo');
  14 |     const titles = await searchPage.titles().allInnerTexts();
  15 |     expect(titles.length).toBeGreaterThan(1);
  16 |     for (const t of titles) expect(t.toLowerCase()).toContain('lenovo');
  17 |   });
  18 | 
  19 |   test('shows a friendly message when nothing matches', async ({ searchPage }) => {
  20 |     await searchPage.search('zzzxqwv');
  21 |     await expect(searchPage.noResult).toContainText('No products were found');
  22 |   });
  23 | });
  24 | 
  25 | test.describe('Product selection', () => {
  26 |   test('opens the product page from search results @smoke', async ({ searchPage, productPage, page }) => {
  27 |     await searchPage.goto();
  28 |     await searchPage.search(PRODUCTS.lenovo.search);
  29 |     await searchPage.open(PRODUCTS.lenovo.name);
  30 |     await expect(page).toHaveURL(/lenovo-ideacentre/);
  31 |     await expect(productPage.price).toBeVisible();
  32 |     await expect(productPage.addToCart).toBeEnabled();
  33 |   });
  34 | 
  35 |   test('category page can be sorted by price, low to high', async ({ page }) => {
  36 |     await page.goto('/notebooks');
> 37 |     await page.locator('#products-orderby').selectOption({ label: 'Price: Low to High' });
     |                                             ^ TimeoutError: locator.selectOption: Timeout 15000ms exceeded.
  38 |     await expect(page).toHaveURL(/orderby=10/);
  39 | 
  40 |     const prices = (await page.locator('.product-item .actual-price').allInnerTexts()).map(parseMoney);
  41 |     expect(prices.length).toBeGreaterThan(1);
  42 |     expect(prices).toEqual([...prices].sort((a, b) => a - b));
  43 |   });
  44 | });
  45 | 
```