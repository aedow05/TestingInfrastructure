import { test, expect } from '@playwright/test';

test('App loads successfully', async ({ page }) => {
  await page.goto('http://localhost:3000');   
  // checks that a title exists
  await expect(page).toHaveTitle(/./);        
});
