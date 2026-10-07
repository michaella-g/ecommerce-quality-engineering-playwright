# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: validation.spec.ts >> Validation and error scenarios >> login with bad credentials shows an error
- Location: tests/validation.spec.ts:39:7

# Error details

```
TimeoutError: locator.fill: Timeout 15000ms exceeded.
Call log:
  - waiting for locator('#Email')

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
        - code [ref=e18]: a46d1845fc0763c7
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
  2  | import { guestCustomer } from '../utils/helpers';
  3  | 
  4  | test.describe('Validation and error scenarios', () => {
  5  |   test('search rejects terms shorter than 3 characters', async ({ searchPage }) => {
  6  |     await searchPage.goto();
  7  |     await searchPage.search('ab');
  8  |     await expect(searchPage.warning).toContainText('minimum length is 3 characters');
  9  |   });
  10 | 
  11 |   test('empty basket shows the empty message and no checkout button', async ({ cartPage }) => {
  12 |     await cartPage.goto();
  13 |     await expect(cartPage.emptyMessage).toContainText('Your Shopping Cart is empty');
  14 |     await expect(cartPage.checkoutButton).toHaveCount(0);
  15 |   });
  16 | 
  17 |   test('checkout is blocked until terms of service are accepted', async ({ cartWithMacbook: cart, page }) => {
  18 |     await cart.checkoutButton.click();
  19 |     await expect(page.locator('#terms-of-service-warning-box')).toContainText('agree with the terms of service');
  20 |     await expect(page).toHaveURL(/\/cart/);
  21 |   });
  22 | 
  23 |   test('billing form flags all required fields', async ({ cartWithMacbook: cart, checkoutPage }) => {
  24 |     await cart.startCheckout();
  25 |     await checkoutPage.continueAsGuest();
  26 |     await checkoutPage.continueBilling();
  27 |     await expect(checkoutPage.billingErrors.first()).toBeVisible();
  28 |     expect(await checkoutPage.billingErrors.count()).toBeGreaterThanOrEqual(5);
  29 |   });
  30 | 
  31 |   test('billing form rejects a malformed email', async ({ cartWithMacbook: cart, checkoutPage, page }) => {
  32 |     await cart.startCheckout();
  33 |     await checkoutPage.continueAsGuest();
  34 |     await checkoutPage.fillBilling({ ...guestCustomer(), email: 'not-an-email' });
  35 |     await checkoutPage.continueBilling();
  36 |     await expect(page.locator('#BillingNewAddress_Email-error')).toContainText(/valid email/i);
  37 |   });
  38 | 
  39 |   test('login with bad credentials shows an error', async ({ page }) => {
  40 |     await page.goto('/login');
> 41 |     await page.locator('#Email').fill('nobody@example.com');
     |                                  ^ TimeoutError: locator.fill: Timeout 15000ms exceeded.
  42 |     await page.locator('#Password').fill('wrong-password');
  43 |     await page.getByRole('button', { name: 'Log in' }).click();
  44 |     await expect(page.locator('.message-error')).toContainText('Login was unsuccessful');
  45 |   });
  46 | });
  47 | 
```