import { test, expect } from './fixtures';
import { PRODUCTS } from '../utils/helpers';

// Runs only in the mobile-chrome / mobile-safari projects (see playwright.config.ts)
test.describe('Mobile viewport', () => {
  test('page does not scroll horizontally', async ({ page }) => {
    await page.goto('/');
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    expect(overflow).toBeLessThanOrEqual(1);
  });

  test('navigation collapses behind the menu toggle', async ({ page }) => {
    await page.goto('/');
    const toggle = page.locator('.menu-toggle');
    await expect(toggle).toBeVisible();
    await expect(page.locator('.top-menu.mobile')).toBeHidden();
    await toggle.click();
    await expect(page.locator('.top-menu.mobile')).toBeVisible();
  });

  test('search, add to basket and view cart on a phone @smoke', async ({
    page,
    searchPage,
    productPage,
    cartPage,
  }) => {
    await searchPage.goto();
    // The search box can sit behind a toggle on small screens; fall back to the URL if hidden
    if (await searchPage.box.isHidden()) {
      await page.goto(`/search?q=${PRODUCTS.macbook.search}`);
    } else {
      await searchPage.search(PRODUCTS.macbook.search);
    }
    await searchPage.open(PRODUCTS.macbook.name);
    await productPage.add(1);
    await cartPage.goto();
    await expect(cartPage.row(PRODUCTS.macbook.name)).toBeVisible();
    await expect(cartPage.checkoutButton).toBeVisible();
  });
});
