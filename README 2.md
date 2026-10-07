# nopCommerce Playwright demo

End-to-end suite for https://demo.nopcommerce.com using Playwright + TypeScript.

## Setup
    npm install
    npx playwright install --with-deps

## Run
    npm test                 # everything, all browsers
    npm run test:smoke       # @smoke tests only
    npm run test:desktop     # chromium + firefox + webkit
    npm run test:mobile      # Pixel 7 + iPhone 14 emulation
    npm run test:a11y        # axe-core checks
    npm run report           # open the HTML report

## Layout
    pages/   page objects (search, product, cart, checkout)
    tests/   specs grouped by feature + fixtures.ts
    utils/   money parsing, test data
    .github/workflows/playwright.yml   CI matrix (one job per project)

Override the target with `BASE_URL=https://staging.example.com npm test`.

## Cloudflare
demo.nopcommerce.com sits behind Cloudflare. Each browser has a `setup-*` project that waits for the
check to clear and saves the session to `.auth/<browser>.json`; test projects depend on it.

- Challenge won't clear headless: `HEADLESS=false npm test`, or `CHANNEL=chrome npm test`.
- Interactive challenge: `npm run auth:manual`, tick the box in the browser window, then run the tests.
  (The cookie is tied to your IP and browser, and expires, so re-run when tests report the challenge again.)
- Most reliable: run your own nopCommerce (Docker) and set `BASE_URL`. If you control the target site,
  add a Cloudflare WAF skip rule for your CI IPs or a secret header instead.
