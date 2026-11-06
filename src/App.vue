<script>
import { calculateBatch } from './calculator.js';
import { da as copy } from './da.js';
import ExtraPage from './ExtraPage.vue';
import { extras } from './extras.js';
import { methods } from './methods.js';
import { readPreferences, savePreferences } from './preferences.js';
import { recipes } from './recipes.js';

const recipePath = '#/opskrift/';
const extraPath = '#/oevrigt/';
const sortedRecipes = [...recipes].sort((a, b) => a.name.localeCompare(b.name, 'da'));

function recipeFromHash() {
  return recipes.find((recipe) => window.location.hash === recipePath + recipe.id);
}

function extraFromHash() {
  return extras.find((entry) => window.location.hash === extraPath + entry.id);
}

export default {
  components: { ExtraPage },
  data() {
    const preferences = readPreferences();
    const recipe = recipeFromHash();
    const yeastByRecipe = preferences.yeastByRecipe ?? {};
    return {
      copy,
      recipes: sortedRecipes,
      recipePath,
      extraPath,
      extras,
      selectedExtra: extraFromHash(),
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
    window.addEventListener('hashchange', this.syncRoute);
    this.updateTitle();
  },
  beforeUnmount() {
    window.removeEventListener('hashchange', this.syncRoute);
  },
  watch: {
    pizzaCount: 'persistPreferences',
    doughPerPizza: 'persistPreferences',
  },
  computed: {
    phases() {
      let number = 0;
      return methods[this.selectedRecipe.id].map(([title, ...steps]) => ({
        title,
        steps: steps.map((text) => {
          number += 1;
          return { text, number, ingredients: this.stepIngredients(number) };
        }),
      }));
    },
    totalSteps() {
      return this.phases.reduce((total, phase) => total + phase.steps.length, 0);
    },
    completedSteps() {
      return Math.round(this.bounded(this.progressByRecipe[this.selectedRecipe.id], 0, 0, this.totalSteps));
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
    syncRoute() {
      const recipe = recipeFromHash();
      const extra = extraFromHash();
      if (recipe?.id === this.selectedRecipe?.id && extra?.id === this.selectedExtra?.id) return;
      this.selectedExtra = extra;
      this.selectedRecipe = recipe;
      this.settings = recipe ? this.recipeSettings(recipe) : null;
      this.yeastType = this.recipeYeast(recipe, this.yeastByRecipe);
      this.updateTitle();
      this.$nextTick(() => {
        this.$refs.pageTitle?.focus({ preventScroll: true });
        window.scrollTo(0, 0);
      });
    },
    updateTitle() {
      const name = this.selectedRecipe?.name ?? this.selectedExtra?.name;
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
      this.progressByRecipe[this.selectedRecipe.id] = count;
      this.persistPreferences();
      this.$nextTick(() => {
        const target = this.$refs.recipeMethod.querySelector('[aria-current="step"], .method-complete');
        target?.focus();
      });
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
  <a class="brand" href="#/" :aria-label="copy.home">
    <span class="brand-mark" aria-hidden="true">P</span>
    <span>Pizza<span class="brand-light">Tool</span></span>
  </a>
  <span class="topbar-note">{{ copy.tagline }}</span>
</header>

<main class="page-shell">
  <template v-if="!selectedRecipe && !selectedExtra">
    <section class="intro">
      <p class="eyebrow"><span class="eyebrow-line"></span> {{ copy.eyebrow }}</p>
      <h1 ref="pageTitle" tabindex="-1">{{ copy.title }}<br /><span>{{ copy.titleAccent }}</span></h1>
      <p class="intro-copy">{{ copy.intro }}</p>
    </section>

    <section class="recipe-catalog" aria-labelledby="catalog-title">
      <div class="catalog-heading">
        <h2 id="catalog-title">{{ copy.pizzaRecipes }}</h2>
        <span>{{ recipes.length }} {{ copy.recipes }}</span>
      </div>
      <div class="recipe-grid">
        <a v-for="recipe in recipes" :key="recipe.id" class="recipe-card" :href="recipePath + recipe.id">
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
        <a v-for="entry in extras" :key="entry.id" class="recipe-card extra-card" :href="extraPath + entry.id">
          <span class="recipe-category">{{ entry.kind }}</span>
          <span class="recipe-name">{{ entry.name }}</span>
          <span class="extra-description">{{ entry.description }}</span>
          <span class="recipe-arrow" aria-hidden="true">→</span>
        </a>
      </div>
    </section>
  </template>

  <template v-else-if="selectedExtra">
    <header class="recipe-header">
      <a class="back-link" href="#/">← {{ copy.backHome }}</a>
      <p class="recipe-category">{{ copy.extras }} · {{ selectedExtra.kind }}</p>
      <h1 ref="pageTitle" tabindex="-1">{{ selectedExtra.name }}</h1>
      <p>{{ selectedExtra.description }}</p>
    </header>
    <ExtraPage :key="selectedExtra.id" :entry="selectedExtra" :pizza-count="safePizzaCount" :dough-weight="safeDoughWeight" />
  </template>

  <template v-else>
    <header class="recipe-header">
      <a class="back-link" href="#/">← {{ copy.allRecipes }}</a>
      <p class="recipe-category">{{ copy.recipeGroups[selectedRecipe.category] }}</p>
      <h1 ref="pageTitle" tabindex="-1">{{ selectedRecipe.name }}</h1>
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

    <section ref="recipeMethod" class="recipe-method" aria-labelledby="method-title">
      <div class="section-heading">
        <span class="step-number">03</span>
        <div>
          <h2 id="method-title">{{ copy.method }}</h2>
          <p>{{ copy.methodHint }}</p>
        </div>
      </div>
      <div class="method-progress">
        <span>{{ completedSteps }} / {{ totalSteps }} {{ copy.stepsComplete }}</span>
        <button v-if="completedSteps" type="button" @click="setProgress(0)">{{ copy.restartMethod }}</button>
      </div>
      <p v-if="completedSteps === totalSteps" class="method-complete" tabindex="-1">{{ copy.methodComplete }}</p>
      <section v-for="phase in phases" :key="phase.title" class="recipe-phase">
        <h3>{{ phase.title }}</h3>
        <ol :start="phase.steps[0].number">
          <li
            v-for="step in phase.steps"
            :key="step.number"
            :class="{ 'step-complete': step.number <= completedSteps }"
            :aria-current="step.number === completedSteps + 1 ? 'step' : undefined"
            :tabindex="step.number === completedSteps + 1 ? -1 : undefined"
          >
            <button
              v-if="step.number === completedSteps || step.number === completedSteps + 1"
              type="button"
              class="step-action"
              :aria-label="`${step.number === completedSteps ? copy.undoStep : copy.finishStep} ${step.number}`"
              @click="setProgress(step.number === completedSteps ? step.number - 1 : step.number)"
            ></button>
            <p>{{ formatStep(step.text) }}</p>
            <ul v-if="step.ingredients.length" class="step-ingredients" :aria-label="copy.stepIngredients">
              <li v-for="item in step.ingredients" :key="item.name">
                <strong>{{ formatGrams(item.amount) }} g</strong> {{ item.name }}
              </li>
            </ul>
          </li>
        </ol>
      </section>
    </section>
  </template>

  <footer class="page-footer">
    <span>PizzaTool</span>
    <span>{{ copy.credit }}</span>
  </footer>
</main>
</template>
