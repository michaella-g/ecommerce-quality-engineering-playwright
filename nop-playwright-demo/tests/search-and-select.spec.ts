import { test, expect } from './fixtures';
import { PRODUCTS, parseMoney } from '../utils/helpers';

test.describe('Product search', () => {
  test.beforeEach(async ({ searchPage }) => searchPage.goto());

  test('finds a product by keyword @smoke', async ({ searchPage }) => {
    await searchPage.search(PRODUCTS.macbook.search);
    await expect(searchPage.titles().filter({ hasText: PRODUCTS.macbook.name })).toHaveCount(1);
  });

  test('every result matches a multi-result term', async ({ searchPage }) => {
    await searchPage.search('Lenovo');
    const titles = await searchPage.titles().allInnerTexts();
    expect(titles.length).toBeGreaterThan(1);
    for (const t of titles) expect(t.toLowerCase()).toContain('lenovo');
  });

  test('shows a friendly message when nothing matches', async ({ searchPage }) => {
    await searchPage.search('zzzxqwv');
    await expect(searchPage.noResult).toContainText('No products were found');
  });
});

test.describe('Product selection', () => {
  test('opens the product page from search results @smoke', async ({ searchPage, productPage, page }) => {
    await searchPage.goto();
    await searchPage.search(PRODUCTS.lenovo.search);
    await searchPage.open(PRODUCTS.lenovo.name);
    await expect(page).toHaveURL(/lenovo-ideacentre/);
    await expect(productPage.price).toBeVisible();
    await expect(productPage.addToCart).toBeEnabled();
  });

  test('category page can be sorted by price, low to high', async ({ page }) => {
    await page.goto('/notebooks');
    await page.locator('#products-orderby').selectOption({ label: 'Price: Low to High' });
    await expect(page).toHaveURL(/orderby=10/);

    const prices = (await page.locator('.product-item .actual-price').allInnerTexts()).map(parseMoney);
    expect(prices.length).toBeGreaterThan(1);
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });
});
