/** "$1,800.00" -> 1800 */
export function parseMoney(text: string | null): number {
  const n = Number((text ?? '').replace(/[^0-9.]/g, ''));
  if (Number.isNaN(n)) throw new Error(`Cannot parse money from "${text}"`);
  return n;
}

export const PRODUCTS = {
  macbook: { search: 'MacBook', name: 'Apple MacBook Pro 13-inch' },
  lenovo: { search: 'Lenovo IdeaCentre', name: 'Lenovo IdeaCentre 600 All-in-One PC' },
};

export function guestCustomer() {
  const id = Date.now().toString(36);
  return {
    firstName: 'Test',
    lastName: 'Shopper',
    email: `qa.${id}@example.com`,
    country: 'United States',
    state: 'New York',
    city: 'New York',
    address: '350 5th Ave',
    zip: '10118',
    phone: '2125551234',
  };
}
export type Customer = ReturnType<typeof guestCustomer>;
