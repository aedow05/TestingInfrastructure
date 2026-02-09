import { test, expect } from '@playwright/test';
import { loadQAConfig } from '../helpers/qaConfig.js';

const config = loadQAConfig();

test('site loads successfully', async ({ page }) => {
  await page.goto(config.baseURL);

  // verify page responded
  await expect(page).toHaveTitle(/.+/);

  // verify some content exists
  const body = page.locator('body');
  await expect(body).toBeVisible();
});

