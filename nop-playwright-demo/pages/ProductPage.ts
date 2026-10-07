import { Page, Locator, expect } from '@playwright/test';

export class ProductPage {
  readonly title: Locator;
  readonly price: Locator;
  readonly qty: Locator;
  readonly addToCart: Locator;
  readonly notification: Locator;

  constructor(private page: Page) {
    this.title = page.locator('.product-name h1');
    this.price = page.locator('.product-price').first();
    this.qty = page.locator('.add-to-cart-panel .qty-input');
    this.addToCart = page.locator('.add-to-cart-panel .add-to-cart-button');
    this.notification = page.locator('.bar-notification.success');
  }

  async add(quantity = 1) {
    await this.qty.fill(String(quantity));
    await this.addToCart.click();
    await expect(this.notification).toContainText('The product has been added to your shopping cart');
  }
}
