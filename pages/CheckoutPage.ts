import { Page, Locator, expect } from '@playwright/test';
import { Customer } from '../utils/helpers';

export class CheckoutPage {
  readonly guestButton: Locator;
  readonly billingErrors: Locator;

  constructor(private page: Page) {
    this.guestButton = page.getByRole('button', { name: 'Checkout as Guest' });
    this.billingErrors = page.locator('#billing-new-address-form .field-validation-error');
  }

  async continueAsGuest() {
    await this.guestButton.click();
    await expect(this.page).toHaveURL(/\/onepagecheckout/);
  }

  async fillBilling(c: Customer) {
    const p = this.page;
    await p.locator('#BillingNewAddress_FirstName').fill(c.firstName);
    await p.locator('#BillingNewAddress_LastName').fill(c.lastName);
    await p.locator('#BillingNewAddress_Email').fill(c.email);
    await p.locator('#BillingNewAddress_CountryId').selectOption({ label: c.country });
    await p.locator('#BillingNewAddress_StateProvinceId').selectOption({ label: c.state });
    await p.locator('#BillingNewAddress_City').fill(c.city);
    await p.locator('#BillingNewAddress_Address1').fill(c.address);
    await p.locator('#BillingNewAddress_ZipPostalCode').fill(c.zip);
    await p.locator('#BillingNewAddress_PhoneNumber').fill(c.phone);
  }

  async continueBilling() {
    await this.page.locator('.new-address-next-step-button').click();
  }

  async chooseShipping(method = 'Ground') {
    await this.page.getByLabel(new RegExp(method)).first().check();
    await this.page.locator('.shipping-method-next-step-button').click();
  }

  async choosePayment(method = 'Check / Money Order') {
    await this.page.getByLabel(method).check();
    await this.page.locator('.payment-method-next-step-button').click();
    await this.page.locator('.payment-info-next-step-button').click();
  }

  async confirm() {
    await this.page.locator('.confirm-order-next-step-button').click();
    await expect(this.page.locator('.order-completed .title')).toContainText(
      'Your order has been successfully processed'
    );
  }
}
