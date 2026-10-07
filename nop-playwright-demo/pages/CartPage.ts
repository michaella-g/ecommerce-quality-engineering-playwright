import { Page, Locator, expect } from '@playwright/test';

export class CartPage {
  readonly rows: Locator;
  readonly updateButton: Locator;
  readonly terms: Locator;
  readonly checkoutButton: Locator;
  readonly emptyMessage: Locator;
  readonly headerCount: Locator;

  constructor(private page: Page) {
    this.rows = page.locator('table.cart tbody tr');
    this.updateButton = page.locator('button[name="updatecart"]');
    this.terms = page.locator('#termsofservice');
    this.checkoutButton = page.locator('#checkout');
    this.emptyMessage = page.locator('.order-summary-content');
    this.headerCount = page.locator('.cart-label .cart-qty');
  }

  async goto() {
    await this.page.goto('/cart');
  }

  row(name: string) {
    return this.rows.filter({ hasText: name });
  }

  qtyInput(name: string) {
    return this.row(name).locator('input.qty-input');
  }

  unitPrice(name: string) {
    return this.row(name).locator('.product-unit-price');
  }

  lineTotal(name: string) {
    return this.row(name).locator('.product-subtotal');
  }

  async setQuantity(name: string, qty: number) {
    await this.qtyInput(name).fill(String(qty));
    await this.updateButton.click();
  }

  /** nopCommerce versions differ: a per-row Remove button, or a checkbox + Update cart */
  async remove(name: string) {
    const row = this.row(name);
    const button = row.locator('.remove-btn');
    if (await button.count()) {
      await button.click();
    } else {
      await row.locator('input[name="removefromcart"]').check();
      await this.updateButton.click();
    }
    await expect(this.row(name)).toHaveCount(0);
  }

  async startCheckout() {
    await this.terms.check();
    await this.checkoutButton.click();
  }
}
