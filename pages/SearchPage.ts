import { Page, Locator, expect } from '@playwright/test';

export class SearchPage {
  readonly box: Locator;
  readonly results: Locator;
  readonly noResult: Locator;
  readonly warning: Locator;

  constructor(readonly page: Page) {
    this.box = page.locator('#small-searchterms');
    this.results = page.locator('.product-item');
    this.noResult = page.locator('.search-results .no-result');
    this.warning = page.locator('.search-results .warning');
  }

  async goto() {
    await this.page.goto('/');
  }

  async search(term: string) {
    await this.box.fill(term);
    await this.box.press('Enter');
    await this.page.waitForURL(/\/search\?q=/);
  }

  titles() {
    return this.results.locator('.product-title a');
  }

  async open(name: string) {
    await this.titles().filter({ hasText: name }).first().click();
    await expect(this.page.locator('.product-name h1')).toContainText(name);
  }
}
