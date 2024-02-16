// @ts-check
const { test, expect } = require('@playwright/test');
const exp = require('constants');

test('new game link', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  await page.getByRole('link', { name: 'New Game' }).click();
  const headerElement = await page.$('h1');

  if (headerElement) {
    await expect(page.getByRole('heading', { name: 'New Game' })).toBeVisible();
  }
});

test('load game link', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  await page.getByRole('link', { name: 'Load Game' }).click();
  const headerElement = await page.$('h1');

  if (headerElement) {
    await expect(page.getByRole('heading', { name: 'Load Game' })).toBeVisible();
  }
});
