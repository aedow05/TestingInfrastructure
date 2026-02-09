import { test, expect } from '@playwright/test';
import { loadQAConfig } from '../helpers/qaConfig.js';

const config = loadQAConfig();

test('App loads successfully', async ({ page }) => {
  await page.goto(config.baseURL);  
  // checks that a title exists
  await expect(page).toHaveTitle(/./);        
});
