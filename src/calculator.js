const yeastFactors = {
  fresh: 1,
  activeDry: 3,
  instantDry: 4,
};

function bounded(value, fallback, min, max) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.min(max, Math.max(min, number)) : fallback;
}

export function calculateBatch(options) {
  const count = bounded(options.pizzaCount, 1, 1, 2000);
  const doughWeight = bounded(options.doughPerPizza, 270, 100, 1000);
  const hydration = bounded(options.hydration, 65, 40, 100) / 100;
  const salt = bounded(options.salt, 2.5, 0, 10) / 100;
  const oil = bounded(options.oil, 0, 0, 20) / 100;
  const sugar = bounded(options.sugar, 0, 0, 20) / 100;
  const yeast = bounded(options.yeast, 0, 0, 10) / 100;
  const prefermentFlour = bounded(options.prefermentFlour, 0, 0, 100) / 100;
  const prefermentHydration = bounded(options.prefermentHydration, 100, 30, 150) / 100;
  const yeastFactor = yeastFactors[options.yeastType] || yeastFactors.fresh;
  const extras = options.extras ?? [];
  const extraRatio = extras.reduce((total, [, percentage]) => total + percentage / 100, 0);
  const totalDough = count * doughWeight;
  const flour = totalDough / (1 + hydration + salt + oil + sugar + yeast / yeastFactor + extraRatio);
  const water = flour * hydration;
  const yeastAmount = flour * yeast / yeastFactor;
  const sugarAmount = flour * sugar;
  const starterFlour = flour * prefermentFlour;
  const starterWater = Math.min(water, starterFlour * prefermentHydration);
  const starterYeast = prefermentFlour > 0 ? yeastAmount * (options.prefermentYeastShare ?? 1) : 0;
  const ingredient = (name, amount) => ({ name, amount });
  const flourIngredients = (amount) => (options.flours ?? [[options.labels.flour, 100]])
    .map(([name, percentage]) => ingredient(name, amount * percentage / 100));
  const sweetener = ingredient(options.sugarName ?? options.labels.sugar, sugarAmount);

  return {
    preferment: prefermentFlour > 0 ? [
      ...flourIngredients(starterFlour),
      ingredient(options.labels.water, starterWater),
      ingredient(options.yeastName, starterYeast),
      sweetener,
    ].filter(({ amount }) => amount > 0) : null,
    main: [
      ...flourIngredients(flour - starterFlour),
      ingredient(options.labels.water, water - starterWater),
      ingredient(options.labels.salt, flour * salt),
      ingredient(options.yeastName, yeastAmount - starterYeast),
      ingredient(options.labels.oil, flour * oil),
      ...(prefermentFlour > 0 ? [] : [sweetener]),
      ...extras.map(([name, percentage]) => ingredient(name, flour * percentage / 100)),
    ].filter(({ amount }) => amount > 0),
  };
}
