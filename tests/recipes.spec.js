import { expect, test } from '@playwright/test';
import { recipes } from '../src/recipes.js';

test('catalog links open each recipe with ingredients and a method', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await expect(page.locator('.recipe-card')).toHaveCount(recipes.length);

  for (const recipe of recipes) {
    await page.locator(`a[href="#/opskrift/${recipe.id}"]`).click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(recipe.name);
    await expect(page.locator('.ingredient-row').first()).toBeVisible();
    await expect(page.locator('[aria-current="step"]')).toBeVisible();
    await page.getByRole('link', { name: /Alle opskrifter/ }).click();
  }
  expect(errors).toEqual([]);
});

test('Biga Pizza V1 scales and remembers settings and clickable steps on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/#/opskrift/bk-biga1');
  await expect(page.locator('.recipe-phase ol > li')).toHaveCount(11);
  await expect(page.locator('[aria-current="step"]')).toContainText('965 g Mel');
  await page.getByLabel(/Antal pizzaer/).fill('4');
  await page.getByLabel(/Dej pr. pizza/).fill('250');
  await page.getByLabel('Gærtype').selectOption('fresh');
  await expect(page.locator('.total-row')).toContainText('1.000 g');
  await expect(page.locator('.recipe-method')).toContainText('4 portioner à 250 g');
  await expect(page.locator('[aria-current="step"]')).toContainText('Frisk gær');
  await expect(page.getByRole('checkbox')).toHaveCount(0);

  await page.getByRole('button', { name: 'Markér færdigt trin 1', exact: true }).click();
  await expect(page.locator('.step-complete p')).toHaveCSS('text-decoration-line', 'line-through');
  await expect(page.getByRole('button', { name: 'Markér færdigt trin 2', exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByLabel(/Antal pizzaer/)).toHaveValue('4');
  await expect(page.getByLabel(/Dej pr. pizza/)).toHaveValue('250');
  await expect(page.getByLabel('Gærtype')).toHaveValue('fresh');
  await expect(page.locator('.step-complete')).toHaveCount(1);

  await page.getByRole('button', { name: 'Fortryd færdigt trin 1', exact: true }).click();
  await expect(page.locator('.step-complete')).toHaveCount(0);
  for (let step = 1; step <= 11; step++) {
    await page.getByRole('button', { name: `Markér færdigt trin ${step}`, exact: true }).click();
  }
  await expect(page.getByText('Alle trin er færdige.')).toBeVisible();
  await page.getByRole('button', { name: 'Start forfra' }).click();
  await expect(page.locator('.step-complete')).toHaveCount(0);
  await expect(page.getByLabel(/Antal pizzaer/)).toHaveValue('4');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
});
