import { test, expect } from './fixtures';
import { PRODUCTS, parseMoney } from '../utils/helpers';

const NAME = PRODUCTS.macbook.name;

test.describe('Basket', () => {
  test('add to basket updates header counter @smoke', async ({ searchPage, productPage, cartPage }) => {
    await searchPage.goto();
    await searchPage.search(PRODUCTS.macbook.search);
    await searchPage.open(NAME);
    await productPage.add(2);
    await expect(cartPage.headerCount).toHaveText('(2)');
  });

  test('item appears in the cart with the right quantity', async ({ cartWithMacbook: cart }) => {
    await expect(cart.row(NAME)).toHaveCount(1);
    await expect(cart.qtyInput(NAME)).toHaveValue('1');
  });

  test('changing quantity recalculates the line total', async ({ cartWithMacbook: cart }) => {
    const unit = parseMoney(await cart.unitPrice(NAME).innerText());
    await cart.setQuantity(NAME, 3);

    await expect(cart.qtyInput(NAME)).toHaveValue('3');
    await expect.poll(async () => parseMoney(await cart.lineTotal(NAME).innerText())).toBeCloseTo(unit * 3, 2);
    await expect(cart.headerCount).toHaveText('(3)');
  });

  test('setting quantity to 0 removes the item', async ({ cartWithMacbook: cart }) => {
    await cart.setQuantity(NAME, 0);
    await expect(cart.row(NAME)).toHaveCount(0);
  });

  test('removing an item empties the basket', async ({ cartWithMacbook: cart }) => {
    await cart.remove(NAME);
    await expect(cart.emptyMessage).toContainText('Your Shopping Cart is empty');
  });
});
