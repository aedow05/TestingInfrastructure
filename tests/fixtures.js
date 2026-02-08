import { test as base, expect } from '@playwright/test';

// create a custom test with isolated browser context
export const test = base.extend({
  page: async ({ browser }, use) => {
    // create fresh browser context (clean session)
    const context = await browser.newContext();
    const page = await context.newPage();

    // run the actual test
    await use(page);

    // cleanup after test
    await context.close();
  },
});

// re-export expect
export { expect };
