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
