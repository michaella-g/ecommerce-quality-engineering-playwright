import { test as base } from '@playwright/test';
import { SearchPage } from '../pages/SearchPage';
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { PRODUCTS } from '../utils/helpers';

type Fixtures = {
  searchPage: SearchPage;
  productPage: ProductPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  /** Cart pre-loaded with one MacBook, as a starting point for cart/checkout tests */
  cartWithMacbook: CartPage;
};

export const test = base.extend<Fixtures>({
  searchPage: async ({ page }, use) => use(new SearchPage(page)),
  productPage: async ({ page }, use) => use(new ProductPage(page)),
  cartPage: async ({ page }, use) => use(new CartPage(page)),
  checkoutPage: async ({ page }, use) => use(new CheckoutPage(page)),

  cartWithMacbook: async ({ searchPage, productPage, cartPage }, use) => {
    await searchPage.goto();
    await searchPage.search(PRODUCTS.macbook.search);
    await searchPage.open(PRODUCTS.macbook.name);
    await productPage.add(1);
    await cartPage.goto();
    await use(cartPage);
  },
});

export { expect } from '@playwright/test';
