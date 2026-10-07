import { test, expect } from './fixtures';
import { guestCustomer } from '../utils/helpers';

test.describe('Validation and error scenarios', () => {
  test('search rejects terms shorter than 3 characters', async ({ searchPage }) => {
    await searchPage.goto();
    await searchPage.search('ab');
    await expect(searchPage.warning).toContainText('minimum length is 3 characters');
  });

  test('empty basket shows the empty message and no checkout button', async ({ cartPage }) => {
    await cartPage.goto();
    await expect(cartPage.emptyMessage).toContainText('Your Shopping Cart is empty');
    await expect(cartPage.checkoutButton).toHaveCount(0);
  });

  test('checkout is blocked until terms of service are accepted', async ({ cartWithMacbook: cart, page }) => {
    await cart.checkoutButton.click();
    await expect(page.locator('#terms-of-service-warning-box')).toContainText('agree with the terms of service');
    await expect(page).toHaveURL(/\/cart/);
  });

  test('billing form flags all required fields', async ({ cartWithMacbook: cart, checkoutPage }) => {
    await cart.startCheckout();
    await checkoutPage.continueAsGuest();
    await checkoutPage.continueBilling();
    await expect(checkoutPage.billingErrors.first()).toBeVisible();
    expect(await checkoutPage.billingErrors.count()).toBeGreaterThanOrEqual(5);
  });

  test('billing form rejects a malformed email', async ({ cartWithMacbook: cart, checkoutPage, page }) => {
    await cart.startCheckout();
    await checkoutPage.continueAsGuest();
    await checkoutPage.fillBilling({ ...guestCustomer(), email: 'not-an-email' });
    await checkoutPage.continueBilling();
    await expect(page.locator('#BillingNewAddress_Email-error')).toContainText(/valid email/i);
  });

  test('login with bad credentials shows an error', async ({ page }) => {
    await page.goto('/login');
    await page.locator('#Email').fill('nobody@example.com');
    await page.locator('#Password').fill('wrong-password');
    await page.getByRole('button', { name: 'Log in' }).click();
    await expect(page.locator('.message-error')).toContainText('Login was unsuccessful');
  });
});
