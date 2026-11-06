<script>
import { calculateBatch } from './calculator.js';
import { da as copy } from './da.js';
import ExtraPage from './ExtraPage.vue';
import { articles, extras } from './extras.js';
import { methods } from './methods.js';
import { readPreferences, savePreferences } from './preferences.js';
import { recipes } from './recipes.js';
import RecipeMethod from './RecipeMethod.vue';

// This module lives one level below the site root in development and in the built bundle.
const homePath = new URL(/* @vite-ignore */ '../', import.meta.url).pathname;
const recipePath = homePath + 'opskrift/';
const extraPath = homePath + 'oevrigt/';
const sortedRecipes = [...recipes].sort((a, b) => a.name.localeCompare(b.name, 'da'));

function extraRoute(path) {
  for (const entry of extras) {
    const category = extraPath + entry.id;
    if (path === category) return { entry };
    const article = articles[entry.id]?.find(({ id }) => path === `${category}/${id}`);
    if (article) return { entry, article };
  }
  return {};
}

function currentRoute() {
  const legacy = window.location.pathname === homePath && window.location.hash.startsWith('#/');
  const path = (legacy ? homePath + window.location.hash.slice(2) : window.location.pathname).replace(/\/$/, '');
  const recipe = recipes.find(({ id }) => path === recipePath + id);
  const { entry, article } = extraRoute(path);
  return { recipe, entry, article, legacyPath: legacy && (recipe || entry) ? path + '/' : null };
}

export default {
  components: { ExtraPage, RecipeMethod },
  data() {
    const preferences = readPreferences();
    const { recipe, entry, article, legacyPath } = currentRoute();
    const yeastByRecipe = preferences.yeastByRecipe ?? {};
    return {
      copy,
      recipes: sortedRecipes,
      homePath,
      legacyPath,
      recipePath,
      extraPath,
      extras,
      selectedExtra: entry,
      selectedArticle: article,
      selectedRecipe: recipe,
      pizzaCount: this.bounded(preferences.pizzaCount, 6, 1, 2000),
      doughPerPizza: this.bounded(preferences.doughPerPizza, 270, 100, 1000),
      yeastByRecipe,
      progressByRecipe: preferences.progressByRecipe ?? {},
      yeastType: this.recipeYeast(recipe, yeastByRecipe),
      settings: recipe ? this.recipeSettings(recipe) : null,
    };
  },
  mounted() {
    if (this.legacyPath) {
      window.location.replace(this.legacyPath + window.location.search);
      return;
    }
    this.updateTitle();
  },
  watch: {
    pizzaCount: 'persistPreferences',
    doughPerPizza: 'persistPreferences',
  },
  computed: {
    phases() {
      if (this.selectedArticle) {
        return [{
          title: copy.preparation,
          steps: this.selectedArticle.steps.map((text, index) => ({ text, number: index + 1, ingredients: [] })),
        }];
      }
      let number = 0;
      return methods[this.selectedRecipe.id].map(([title, ...steps]) => ({
        title,
        steps: steps.map((text) => {
          number += 1;
          const ingredients = this.stepIngredients(number).map(({ name, amount }) => ({ name, grams: this.formatGrams(amount) }));
          return { text: this.formatStep(text), number, ingredients };
        }),
      }));
    },
    progressKey() {
      return this.selectedArticle
        ? `extra/${this.selectedExtra.id}/${this.selectedArticle.id}`
        : this.selectedRecipe.id;
    },
    completedSteps() {
      const total = this.phases.reduce((sum, phase) => sum + phase.steps.length, 0);
      return Math.round(this.bounded(this.progressByRecipe[this.progressKey], 0, 0, total));
    },
    safePizzaCount() {
      return Math.round(this.bounded(this.pizzaCount, 1, 1, 2000));
    },
    safeDoughWeight() {
      return this.bounded(this.doughPerPizza, 270, 100, 1000);
    },
    calculation() {
      return calculateBatch({
        ...this.settings,
        pizzaCount: this.safePizzaCount,
        doughPerPizza: this.safeDoughWeight,
        yeastType: this.yeastType,
        yeastName: copy.yeastNames[this.yeastType],
        labels: copy.ingredientNames,
      });
    },
  },
  methods: {
    recipeSettings(recipe) {
      return {
        hydration: recipe.hydration,
        salt: recipe.salt,
        oil: recipe.oil ?? 0,
        sugar: recipe.sugar ?? 0,
        yeast: recipe.yeast,
        time: recipe.time,
        extras: recipe.extras,
        flours: recipe.flours,
        prefermentYeastShare: recipe.prefermentYeastShare,
        prefermentFlour: recipe.prefermentFlour || 0,
        prefermentHydration: recipe.prefermentHydration || 100,
        sugarName: recipe.sugarName,
      };
    },
    recipeYeast(recipe, saved) {
      const yeast = saved[recipe?.id];
      return Object.hasOwn(copy.yeastNames, yeast) ? yeast : recipe?.yeastType ?? 'fresh';
    },
    updateTitle() {
      const name = this.selectedRecipe?.name ?? this.selectedArticle?.title ?? this.selectedExtra?.name;
      document.title = name ? `${name} · PizzaTool` : copy.documentTitle;
    },
    saveYeast() {
      this.yeastByRecipe[this.selectedRecipe.id] = this.yeastType;
      this.persistPreferences();
    },
    persistPreferences() {
      const previous = readPreferences();
      savePreferences({
        pizzaCount: this.pizzaCount === '' ? previous.pizzaCount : this.safePizzaCount,
        doughPerPizza: this.doughPerPizza === '' ? previous.doughPerPizza : this.safeDoughWeight,
        yeastByRecipe: this.yeastByRecipe,
        progressByRecipe: this.progressByRecipe,
      });
    },
    setProgress(count) {
      this.progressByRecipe[this.progressKey] = count;
      this.persistPreferences();
    },
    formatStep(text) {
      return text
        .replaceAll('{antal}', this.safePizzaCount)
        .replaceAll('{vægt}', this.formatGrams(this.safeDoughWeight));
    },
    stepIngredients(number) {
      if (number === 1 && this.calculation.preferment) return this.calculation.preferment;
      if (this.selectedRecipe.id !== 'bk-biga1') return [];
      if (number === 3) return this.calculation.main.filter(({ name }) => name === copy.ingredientNames.water);
      if (number === 6) {
        return this.calculation.main.filter(({ name }) =>
          name === copy.ingredientNames.salt || name === copy.ingredientNames.flour);
      }
      return [];
    },
    bounded(value, fallback, min, max) {
      const number = Number(value);
      return Number.isFinite(number) ? Math.min(max, Math.max(min, number)) : fallback;
    },
    formatGrams(amount) {
      return amount.toLocaleString('da-DK', { maximumFractionDigits: amount < 10 ? 2 : 0 });
    },
  },
};
</script>

<template>
<header class="topbar">
  <a class="brand" :href="homePath" :aria-label="copy.home">
    <span class="brand-mark" aria-hidden="true">P</span>
    <span>Pizza<span class="brand-light">Tool</span></span>
  </a>
  <span class="topbar-note">{{ copy.tagline }}</span>
</header>

<main class="page-shell">
  <template v-if="!selectedRecipe && !selectedExtra">
    <section class="intro">
      <p class="eyebrow"><span class="eyebrow-line"></span> {{ copy.eyebrow }}</p>
      <h1>{{ copy.title }}<br /><span>{{ copy.titleAccent }}</span></h1>
      <p class="intro-copy">{{ copy.intro }}</p>
    </section>

    <section class="recipe-catalog" aria-labelledby="catalog-title">
      <div class="catalog-heading">
        <h2 id="catalog-title">{{ copy.pizzaRecipes }}</h2>
        <span>{{ recipes.length }} {{ copy.recipes }}</span>
      </div>
      <div class="recipe-grid">
        <a v-for="recipe in recipes" :key="recipe.id" class="recipe-card" :href="recipePath + recipe.id + '/'">
          <span class="recipe-category">{{ copy.recipeGroups[recipe.category] }}</span>
          <span class="recipe-name">{{ recipe.name }}</span>
          <span class="recipe-time">{{ recipe.time }}</span>
          <span class="recipe-arrow" aria-hidden="true">→</span>
        </a>
      </div>
    </section>

    <section class="recipe-catalog extra-catalog" aria-labelledby="extra-title">
      <div class="catalog-heading">
        <h2 id="extra-title">{{ copy.extras }}</h2>
      </div>
      <p>{{ copy.extrasIntro }}</p>
      <div class="recipe-grid">
        <a v-for="entry in extras" :key="entry.id" class="recipe-card extra-card" :href="extraPath + entry.id + '/'">
          <span class="recipe-category">{{ entry.kind }}</span>
          <span class="recipe-name">{{ entry.name }}</span>
          <span class="extra-description">{{ entry.description }}</span>
          <span class="recipe-arrow" aria-hidden="true">→</span>
        </a>
      </div>
    </section>
  </template>

  <template v-else-if="selectedArticle">
    <header class="recipe-header">
      <a class="back-link" :href="extraPath + selectedExtra.id + '/'">← {{ selectedExtra.name }}</a>
      <p class="recipe-category">{{ copy.extras }} · {{ selectedExtra.name }}</p>
      <h1>{{ selectedArticle.title }}</h1>
      <p v-if="selectedArticle.intro" class="recipe-duration">{{ selectedArticle.intro }}</p>
    </header>
    <section v-if="selectedArticle.ingredients" class="recipe-phase article-ingredients">
      <div class="section-heading">
        <span class="step-number">01</span>
        <h2>{{ copy.ingredients }}</h2>
      </div>
      <ul class="extra-ingredients">
        <li v-for="item in selectedArticle.ingredients" :key="item">{{ item }}</li>
      </ul>
    </section>
    <RecipeMethod
      :phases="phases"
      :completed-steps="completedSteps"
      :section-number="selectedArticle.ingredients ? '02' : '01'"
      :hint="copy.articleMethodHint"
      @progress="setProgress"
    />
    <p v-if="selectedArticle.source" class="extra-source article-source">
      <a :href="selectedArticle.source[1]">{{ selectedArticle.source[0] }}</a>
    </p>
  </template>

  <template v-else-if="selectedExtra">
    <header class="recipe-header">
      <a class="back-link" :href="homePath">← {{ copy.backHome }}</a>
      <p class="recipe-category">{{ copy.extras }} · {{ selectedExtra.kind }}</p>
      <h1>{{ selectedExtra.name }}</h1>
      <p>{{ selectedExtra.description }}</p>
    </header>
    <ExtraPage :key="selectedExtra.id" :entry="selectedExtra" :path="extraPath + selectedExtra.id" :pizza-count="safePizzaCount" :dough-weight="safeDoughWeight" />
  </template>

  <template v-else>
    <header class="recipe-header">
      <a class="back-link" :href="homePath">← {{ copy.allRecipes }}</a>
      <p class="recipe-category">{{ copy.recipeGroups[selectedRecipe.category] }}</p>
      <h1>{{ selectedRecipe.name }}</h1>
      <p class="recipe-duration">{{ settings.time }}</p>
    </header>

    <section :key="selectedRecipe.id" class="planner" :aria-label="copy.planner">
      <div class="planner-main">
        <div class="section-heading">
          <span class="step-number">01</span>
          <div>
            <h2>{{ copy.batch }}</h2>
            <p>{{ copy.batchHint }}</p>
          </div>
        </div>

        <div class="batch-fields">
          <label class="field">
            <span class="field-label">{{ copy.count }}</span>
            <span class="input-wrap">
              <input v-model.number="pizzaCount" type="number" min="1" max="2000" step="1" />
              <span class="input-suffix">{{ copy.pizzas }}</span>
            </span>
          </label>
          <label class="field">
            <span class="field-label">{{ copy.weight }}</span>
            <span class="input-wrap">
              <input v-model.number="doughPerPizza" type="number" min="100" max="1000" step="5" />
              <span class="input-suffix">{{ copy.grams }}</span>
            </span>
          </label>
          <label v-if="selectedRecipe.yeast > 0" class="field">
            <span class="field-label">{{ copy.yeast }}</span>
            <span class="select-wrap">
              <select v-model="yeastType" @change="saveYeast">
                <option value="fresh">{{ copy.yeastNames.fresh }}</option>
                <option value="activeDry">{{ copy.yeastNames.activeDry }}</option>
                <option value="instantDry">{{ copy.yeastNames.instantDry }}</option>
              </select>
            </span>
          </label>
        </div>

        <p class="saved-note">{{ copy.savedPreferences }}</p>

        <details class="advanced">
          <summary>
            <span class="advanced-icon" aria-hidden="true">＋</span>
            <span>
              <strong>{{ copy.adjust }}</strong>
              <small>{{ copy.adjustHint }}</small>
            </span>
            <span class="advanced-hint">{{ copy.optional }}</span>
          </summary>
          <div class="advanced-fields">
            <label class="field">
              <span class="field-label">{{ copy.hydration }}</span>
              <span class="input-wrap compact">
                <input v-model.number="settings.hydration" type="number" min="40" max="100" step="any" />
                <span class="input-suffix">%</span>
              </span>
            </label>
            <label class="field">
              <span class="field-label">{{ copy.salt }}</span>
              <span class="input-wrap compact">
                <input v-model.number="settings.salt" type="number" min="0" max="10" step="any" />
                <span class="input-suffix">%</span>
              </span>
            </label>
            <label class="field">
              <span class="field-label">{{ copy.oil }}</span>
              <span class="input-wrap compact">
                <input v-model.number="settings.oil" type="number" min="0" max="20" step="any" />
                <span class="input-suffix">%</span>
              </span>
            </label>
            <label class="field">
              <span class="field-label">{{ copy.sweetener }}</span>
              <span class="input-wrap compact">
                <input v-model.number="settings.sugar" type="number" min="0" max="20" step="any" />
                <span class="input-suffix">%</span>
              </span>
            </label>
            <label v-if="selectedRecipe.yeast > 0" class="field">
              <span class="field-label">{{ copy.yeastEquivalent }}</span>
              <span class="input-wrap compact">
                <input v-model.number="settings.yeast" type="number" min="0" max="10" step="any" />
                <span class="input-suffix">%</span>
              </span>
            </label>
            <label class="field">
              <span class="field-label">{{ copy.fermentation }}</span>
              <span class="input-wrap compact">
                <input v-model="settings.time" type="text" maxlength="40" />
              </span>
            </label>
            <template v-if="selectedRecipe.prefermentName">
              <label class="field">
                <span class="field-label">{{ copy.prefermentFlour }}</span>
                <span class="input-wrap compact">
                  <input v-model.number="settings.prefermentFlour" type="number" min="0" max="100" step="any" />
                  <span class="input-suffix">%</span>
                </span>
              </label>
              <label class="field">
                <span class="field-label">{{ copy.prefermentHydration }}</span>
                <span class="input-wrap compact">
                  <input v-model.number="settings.prefermentHydration" type="number" min="30" max="150" step="any" />
                  <span class="input-suffix">%</span>
                </span>
              </label>
            </template>
            <p class="advanced-note">
              {{ copy.percentages }}
            </p>
          </div>
        </details>
      </div>

      <aside class="results" aria-live="polite">
        <div class="results-top">
          <div class="results-heading">
            <span class="step-number light">02</span>
            <div>
              <h2>{{ copy.plan }}</h2>
              <p>{{ selectedRecipe.name }} <span class="dot">·</span> {{ settings.time }}</p>
            </div>
          </div>
          <span class="pizza-stamp" aria-hidden="true">🍕</span>
        </div>

        <div class="batch-summary">
          <div>
            <strong>{{ safePizzaCount }}</strong>
            <span>{{ copy.pizzas }}</span>
          </div>
          <span class="summary-divider"></span>
          <div>
            <strong>{{ formatGrams(safePizzaCount * safeDoughWeight) }}</strong>
            <span>{{ copy.total }}</span>
          </div>
        </div>

        <div class="ingredient-group" v-if="calculation.preferment">
          <div class="ingredient-group-heading">
            <h3>{{ selectedRecipe.prefermentName }}</h3>
            <span>{{ copy.makeFirst }}</span>
          </div>
          <div class="ingredient-row" v-for="item in calculation.preferment" :key="item.name">
            <span>{{ item.name }}</span><strong>{{ formatGrams(item.amount) }} g</strong>
          </div>
        </div>

        <div class="ingredient-group">
          <div class="ingredient-group-heading">
            <h3>{{ calculation.preferment ? copy.main : copy.ingredients }}</h3>
            <span>{{ calculation.preferment ? copy.addLater : copy.weigh }}</span>
          </div>
          <div class="ingredient-row" v-for="item in calculation.main" :key="item.name">
            <span>{{ item.name }}</span><strong>{{ formatGrams(item.amount) }} g</strong>
          </div>
        </div>

        <div class="total-row">
          <span>{{ copy.total }}</span><strong>{{ formatGrams(safePizzaCount * safeDoughWeight) }} g</strong>
        </div>

        <p class="results-footnote">{{ copy.rounding }}</p>
      </aside>
    </section>

    <RecipeMethod :phases="phases" :completed-steps="completedSteps" section-number="03" :hint="copy.methodHint" @progress="setProgress" />
  </template>

  <footer class="page-footer">
    <span>PizzaTool</span>
    <span>{{ copy.credit }}</span>
  </footer>
</main>
</template>
