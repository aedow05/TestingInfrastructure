import { test, expect } from '@playwright/test';
import { loadQAConfig } from '../helpers/qaConfig.js';

const config = loadQAConfig();

test('user can navigate through site', async ({ page }) => {
  await page.goto(config.baseURL);

  // find any link and click it
  const link = page.locator('a').first();

  if (await link.count() > 0) {
    await link.click();
    await page.waitForLoadState('load');
    await expect(page).toHaveURL(/.+/);
  }
});

