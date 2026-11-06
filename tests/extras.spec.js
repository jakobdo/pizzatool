import { expect, test } from '@playwright/test';
import { extras } from '../src/extras.js';

test('the homepage separates the nine extras from the pizza recipes', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.getByRole('region', { name: 'Pizzaopskrifter' }).getByRole('link')).toHaveCount(21);
  await expect(page.getByRole('region', { name: 'Øvrigt', exact: true }).getByRole('link')).toHaveCount(9);

  for (const entry of extras) {
    await page.locator(`a[href="#/oevrigt/${entry.id}"]`).click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(entry.name);
    await expect(page.locator('.extra-content h2').first()).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
    await page.getByRole('link', { name: /Til forsiden/ }).click();
  }
});

test('extra calculators update as inputs change', async ({ page }) => {
  await page.goto('/#/oevrigt/mel');
  await page.getByLabel('Mel i alt (g)').fill('500');
  await expect(page.locator('.extra-results')).toContainText('400 g');

  await page.goto('/#/oevrigt/gaer');
  await page.getByLabel('Mængde (g)').fill('12');
  await expect(page.locator('.extra-results div').filter({ hasText: 'Instant tørgær' })).toContainText('3 g');

  await page.goto('/#/oevrigt/vand');
  await page.getByLabel('Ønsket dejtemperatur (°C)').fill('26');
  await expect(page.locator('.extra-result')).toContainText('14 °C');

  await page.goto('/#/oevrigt/maengde-og-antal');
  await page.getByLabel('Voksne').fill('6');
  await expect(page.getByRole('row', { name: /Mellem/ })).toContainText('4–5');
  await expect(page.locator('.extra-results div').filter({ hasText: 'Detroit' })).toContainText('290 g');
  await page.getByLabel('Antal pizzaer').fill('2');
  await expect(page.locator('.extra-results div').filter({ hasText: 'Sauce' })).toContainText('170 g');

  await page.goto('/#/oevrigt/skaler-opskrift');
  await page.getByLabel('Antal pizzaer').fill('4');
  await page.getByLabel('Gram pr. dejbolle').fill('250');
  await expect(page.locator('.extra-results')).toContainText('1.000 g');
  await page.getByRole('button', { name: 'Tilføj ingrediens' }).click();
  await page.getByLabel('Ingrediens 5').fill('Olivenolie');
  await page.getByLabel('Oprindelig vægt (g)').nth(4).fill('10');
  await expect(page.locator('.extra-results div').filter({ hasText: 'Olivenolie' })).toContainText('11,79 g');
});
