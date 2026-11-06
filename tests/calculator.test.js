import assert from 'node:assert/strict';
import { test } from 'node:test';
import { calculateBatch } from '../src/calculator.js';
import { da } from '../src/da.js';
import { methods } from '../src/methods.js';
import { recipes } from '../src/recipes.js';

function batch(recipe, yeastType = recipe.yeastType ?? 'fresh', pizzaCount = 6) {
  return calculateBatch({
    ...recipe,
    pizzaCount,
    doughPerPizza: 270,
    yeastType,
    yeastName: da.yeastNames[yeastType],
    labels: da.ingredientNames,
  });
}

test('every recipe has a unique link and a detailed method', () => {
  assert.equal(new Set(recipes.map(({ id }) => id)).size, recipes.length);
  assert.equal(recipes.filter(({ category }) => category === 'baker').length, 9);
  for (const recipe of recipes) {
    assert.ok(methods[recipe.id].every(([title, ...steps]) => title && steps.length && steps.every(Boolean)));
  }
});

for (const recipe of recipes) {
  test(`${recipe.name} preserves batch weight at all supported sizes and yeast types`, () => {
    for (const yeastType of Object.keys(da.yeastNames)) {
      for (const count of [1, 6, 2000]) {
        const { main, preferment } = batch(recipe, yeastType, count);
        const ingredients = [...(preferment ?? []), ...main];
        assert.equal(Boolean(preferment), Boolean(recipe.prefermentName));
        assert.ok(ingredients.every(({ amount }) => Number.isFinite(amount) && amount > 0));
        const total = ingredients.reduce((sum, { amount }) => sum + amount, 0);
        assert.ok(Math.abs(total - count * 270) < 1e-6);
      }
    }
  });
}

test('Biga Pizza V1 matches the workbook quantities and puts all flour in the biga', () => {
  const recipe = recipes.find(({ id }) => id === 'bk-biga1');
  const { main, preferment } = batch(recipe);
  assert.deepEqual(preferment.map(({ name, amount }) => [name, Math.round(amount * 10) / 10]), [
    ['Mel', 964.9],
    ['Vand', 482.4],
    ['Instant tørgær', 2.2],
  ]);
  assert.deepEqual(main.map(({ name, amount }) => [name, Math.round(amount)]), [
    ['Vand', 145],
    ['Salt', 26],
  ]);
});
