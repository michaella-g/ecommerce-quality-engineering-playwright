import AxeBuilder from '@axe-core/playwright';
import { test, expect } from './fixtures';

const PAGES = [
  { name: 'Home', url: '/' },
  { name: 'Category', url: '/notebooks' },
  { name: 'Product', url: '/apple-macbook-pro-13-inch' },
  { name: 'Cart', url: '/cart' },
  { name: 'Login', url: '/login' },
];

test.describe('Accessibility (axe-core, WCAG 2.1 A/AA)', () => {
  for (const { name, url } of PAGES) {
    test(`${name} page has no critical violations`, async ({ page }, testInfo) => {
      await page.goto(url);
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

      // Attach the full report so every violation is visible in the HTML report
      await testInfo.attach(`axe-${name}`, {
        body: JSON.stringify(results.violations, null, 2),
        contentType: 'application/json',
      });

      // A public demo store will have some issues. Gate on critical only;
      // tighten to serious + critical once the baseline is clean.
      const blocking = results.violations.filter((v) => v.impact === 'critical');
      expect(blocking, blocking.map((v) => `${v.id}: ${v.help}`).join('\n')).toEqual([]);
    });
  }

  test('search is usable by keyboard alone', async ({ page }) => {
    await page.goto('/');
    const search = page.locator('#small-searchterms');
    await search.focus();
    await expect(search).toBeFocused();
    await page.keyboard.type('MacBook');
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/search\?q=MacBook/);
  });

  test('login form fields have accessible names', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Log in' })).toBeVisible();
  });
});
