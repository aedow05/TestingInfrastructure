import { test, expect } from '../fixtures.js';

test('user can navigate through main workflow', async ({ page }) => {
  await page.goto('http://localhost:3000');

  //confirm page loads
  await expect(page).toHaveTitle(/./);

  //click a navigation link (adjust to your app)
  const link = page.locator('a').first();
  await link.click();

  //confirm navigation happened
  await expect(page).not.toHaveURL('http://localhost:3000');
});
