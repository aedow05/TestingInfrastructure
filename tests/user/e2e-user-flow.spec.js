import { test, expect } from '@playwright/test';
import { loadQAConfig } from '../helpers/qaConfig.js';

const config = loadQAConfig();


test('user can navigate through main workflow', async ({ page }) => {
  await page.goto(config.baseURL);

  //confirm page loads
  await expect(page).toHaveTitle(/./);

  //click a navigation link (adjust to your app)
  const link = page.locator('a').first();
  await link.click();

  //confirm navigation happened
  await expect(page).not.toHaveURL('http://localhost:3000');
});
