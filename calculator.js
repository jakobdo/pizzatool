(function (root) {
  const yeastFactors = {
    fresh: 1,
    activeDry: 3,
    instantDry: 4,
  };

  function bounded(value, fallback, min, max) {
    const number = Number(value);
    return Number.isFinite(number) ? Math.min(max, Math.max(min, number)) : fallback;
  }

  function calculateBatch(options) {
    const count = bounded(options.pizzaCount, 1, 1, 2000);
    const doughWeight = bounded(options.doughPerPizza, 270, 100, 1000);
    const hydration = bounded(options.hydration, 65, 40, 100) / 100;
    const salt = bounded(options.salt, 2.5, 0, 10) / 100;
    const oil = bounded(options.oil, 0, 0, 20) / 100;
    const sugar = bounded(options.sugar, 0, 0, 20) / 100;
    const yeast = bounded(options.yeast, 0, 0, 10) / 100;
    const prefermentFlour = bounded(options.prefermentFlour, 0, 0, 80) / 100;
    const prefermentHydration = bounded(options.prefermentHydration, 100, 30, 150) / 100;
    const yeastFactor = yeastFactors[options.yeastType] || yeastFactors.fresh;
    const totalDough = count * doughWeight;
    const flour = totalDough / (1 + hydration + salt + oil + sugar + yeast / yeastFactor);
    const water = flour * hydration;
    const saltAmount = flour * salt;
    const oilAmount = flour * oil;
    const sugarAmount = flour * sugar;
    const yeastAmount = flour * yeast / yeastFactor;
    const starterFlour = flour * prefermentFlour;
    const starterWater = starterFlour * prefermentHydration;
    const ingredient = (name, amount) => ({ name, amount });

    if (prefermentFlour > 0) {
      return {
        preferment: [
          ingredient('Flour', starterFlour),
          ingredient('Water', starterWater),
          ingredient(options.yeastName, yeastAmount),
          ...(sugarAmount > 0 ? [ingredient(options.sugarName || 'Sugar or honey', sugarAmount)] : []),
        ],
        main: [
          ingredient('Flour', flour - starterFlour),
          ingredient('Water', water - starterWater),
          ingredient('Salt', saltAmount),
          ...(oilAmount > 0 ? [ingredient('Olive oil', oilAmount)] : []),
        ],
      };
    }

    return {
      preferment: null,
      main: [
        ingredient('Flour', flour),
        ingredient('Water', water),
        ingredient(options.yeastName, yeastAmount),
        ...(sugarAmount > 0 ? [ingredient(options.sugarName || 'Sugar or honey', sugarAmount)] : []),
        ...(oilAmount > 0 ? [ingredient('Olive oil', oilAmount)] : []),
        ingredient('Salt', saltAmount),
      ],
    };
  }

  const api = { calculateBatch };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.PizzaCalculator = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
