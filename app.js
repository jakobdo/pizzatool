const recipes = [
  {
    id: 'gorm',
    name: 'Gorm’s quick dough',
    description: 'A straightforward, soft dough for a same-day bake.',
    icon: '◉',
    time: '2–4 HOURS',
    hydration: 67,
    salt: 2.33,
    oil: 4.33,
    sugar: 2.33,
    yeast: 3.33,
    preferment: false,
    timeSetting: '2–4 hours',
    yeastName: 'Fresh yeast',
    sugarName: 'Sugar',
    steps: [
      'Dissolve the yeast and sugar in the water.',
      'Mix in the flour, salt and olive oil; knead until smooth.',
      'Let the dough rise, divide into balls and rest before shaping.',
    ],
  },
  {
    id: 'vito',
    name: 'Vito’s poolish',
    description: 'A light, flavourful dough with a bubbly overnight starter.',
    icon: '◌',
    time: '21–29 HOURS',
    hydration: 65,
    salt: 2.6,
    oil: 0,
    sugar: 0.32,
    yeast: 1.28,
    preferment: true,
    prefermentName: 'Poolish',
    prefermentFlour: 19,
    prefermentHydration: 100,
    timeSetting: '21–29 hours',
    yeastName: 'Dry yeast',
    sugarName: 'Honey',
    steps: [
      'Mix the poolish ingredients until combined, cover and chill overnight.',
      'Add the remaining water and flour, then mix in salt.',
      'Let the dough rise, divide into balls and proof before baking.',
    ],
  },
  {
    id: 'neapolitan',
    name: 'Neapolitan',
    description: 'A simple, delicate dough made for a hot oven.',
    icon: '✳',
    time: '8–24 HOURS',
    hydration: 65,
    salt: 2.8,
    oil: 0,
    sugar: 0,
    yeast: 0.15,
    preferment: false,
    timeSetting: '8–24 hours',
    yeastName: 'Fresh yeast',
    steps: [
      'Dissolve the yeast in cool water, then mix in the flour.',
      'Add salt and knead until the dough is smooth and elastic.',
      'Ferment, divide into balls and let them relax before stretching.',
    ],
  },
  {
    id: 'new-york',
    name: 'New York style',
    description: 'A foldable, golden-crusted pizza with a little olive oil.',
    icon: '⌁',
    time: '24–48 HOURS',
    hydration: 62,
    salt: 2.5,
    oil: 3,
    sugar: 2,
    yeast: 0.15,
    preferment: false,
    timeSetting: '24–48 hours',
    yeastName: 'Instant dry yeast',
    steps: [
      'Whisk the yeast and sugar into the water.',
      'Add flour, salt and oil; mix and knead until smooth.',
      'Cover and refrigerate, then bring to room temperature before shaping.',
    ],
  },
  {
    id: 'biga',
    name: 'Sebastian’s biga',
    description: 'A firm Italian preferment with a rich, complex flavour.',
    icon: '◎',
    time: '24–48 HOURS',
    hydration: 72,
    salt: 2.5,
    oil: 0,
    sugar: 0,
    yeast: 1,
    preferment: true,
    prefermentName: 'Biga',
    prefermentFlour: 30,
    prefermentHydration: 45,
    timeSetting: '24–48 hours',
    yeastName: 'Fresh yeast',
    steps: [
      'Mix the biga ingredients into a rough, firm dough and cover.',
      'Let the biga ferment, then tear it into pieces.',
      'Mix with the remaining water and flour, add salt, and knead until smooth.',
      'Divide into balls and proof before baking.',
    ],
  },
];

const app = Vue.createApp({
  data() {
    return {
      recipes,
      selectedRecipeId: recipes[0].id,
      pizzaCount: 6,
      doughPerPizza: 270,
      yeastType: 'fresh',
      settings: this.recipeSettings(recipes[0]),
    };
  },
  computed: {
    selectedRecipe() {
      return this.recipes.find((recipe) => recipe.id === this.selectedRecipeId) || this.recipes[0];
    },
    safePizzaCount() {
      return Math.round(this.bounded(this.pizzaCount, 1, 1, 2000));
    },
    safeDoughWeight() {
      return this.bounded(this.doughPerPizza, 270, 100, 1000);
    },
    calculation() {
      const yeastNames = {
        fresh: 'Fresh yeast',
        activeDry: 'Active dry yeast',
        instantDry: 'Instant dry yeast',
      };
      return PizzaCalculator.calculateBatch({
        ...this.settings,
        pizzaCount: this.safePizzaCount,
        doughPerPizza: this.safeDoughWeight,
        yeastType: this.yeastType,
        yeastName: yeastNames[this.yeastType],
      });
    },
  },
  methods: {
    recipeSettings(recipe) {
      return {
        hydration: recipe.hydration,
        salt: recipe.salt,
        oil: recipe.oil,
        sugar: recipe.sugar,
        yeast: recipe.yeast,
        time: recipe.timeSetting,
        prefermentFlour: recipe.prefermentFlour || 0,
        prefermentHydration: recipe.prefermentHydration || 100,
        sugarName: recipe.sugarName,
      };
    },
    selectRecipe(recipe) {
      this.selectedRecipeId = recipe.id;
      this.settings = this.recipeSettings(recipe);
      this.yeastType = recipe.id === 'new-york' || recipe.id === 'vito' ? 'instantDry' : 'fresh';
    },
    bounded(value, fallback, min, max) {
      const number = Number(value);
      return Number.isFinite(number) ? Math.min(max, Math.max(min, number)) : fallback;
    },
    formatGrams(amount) {
      return Math.round(Number.isFinite(amount) ? amount : 0).toLocaleString('en-US');
    },
  },
});

app.mount('#app');
