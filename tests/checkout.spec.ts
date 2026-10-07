import { test, expect } from './fixtures';
import { guestCustomer } from '../utils/helpers';

test.describe('Checkout', () => {
  test('guest can complete an order end to end @smoke', async ({
    cartWithMacbook: cart,
    checkoutPage,
    page,
  }, testInfo) => {
    await test.step('Proceed to checkout as guest', async () => {
      await cart.startCheckout();
      await checkoutPage.continueAsGuest();
    });

    await test.step('Billing address', async () => {
      await checkoutPage.fillBilling(guestCustomer());
      await checkoutPage.continueBilling();
    });

    await test.step('Shipping method', () => checkoutPage.chooseShipping('Ground'));
    await test.step('Payment', () => checkoutPage.choosePayment('Check / Money Order'));

    await test.step('Confirm order', () => checkoutPage.confirm());

    await testInfo.attach('order-confirmation', {
      body: await page.screenshot(),
      contentType: 'image/png',
    });
    await expect(page.locator('.order-number')).toContainText(/Order number: \d+/);
  });
});
