<script setup>
import { computed, reactive, ref } from 'vue';
import { yeastFactors } from './calculator.js';
import { da } from './da.js';
import { articles, flourStrength, pizzaSizes } from './extras.js';

const props = defineProps({
  entry: { type: Object, required: true },
  path: { type: String, required: true },
  pizzaCount: { type: Number, required: true },
  doughWeight: { type: Number, required: true },
});

const yeastAmount = ref(1);
const yeastType = ref('fresh');
const flourMix = reactive({ total: 580, first: 80 });
const water = reactive({ dough: 25, flour: 23, low: 5, medium: 5 });
const guests = reactive({ adults: 4, children: 0 });
const pan = reactive({ length: 25, width: 20, diameter: 30 });
const topping = reactive({ style: 'round', diameter: 30, count: props.pizzaCount });
const target = reactive({ count: props.pizzaCount, weight: props.doughWeight });
const ingredients = ref([
  { name: 'Mel', amount: 500 },
  { name: 'Vand', amount: 325 },
  { name: 'Salt', amount: 12 },
  { name: 'Gær', amount: 1 },
]);
const labels = ['Sauce', 'Ost', 'Kød', 'Grøntsager', 'Øvrigt'];
const toppingFactors = {
  round: [85 / 30, 4, 2.5, 70 / 30, 25 / 30],
  neapolitan: [2.66, 70 / 30, 40 / 30, 40 / 30, 0.67],
};

function positive(value) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : 0;
}

const firstFlourRatio = computed(() => Math.min(100, positive(flourMix.first)) / 100);
const totalIngredients = computed(() => ingredients.value.reduce((sum, row) => sum + positive(row.amount), 0));
const targetWeight = computed(() => Math.floor(positive(target.count)) * positive(target.weight));
const scale = computed(() => totalIngredients.value ? targetWeight.value / totalIngredients.value : 0);
const waterTemperature = computed(() => 2 * Number(water.dough) - Number(water.flour) - positive(water.low) - 2 * positive(water.medium));
const waterReady = computed(() => Object.values(water).every((value) => value !== ''));

function format(number, digits = 2) {
  return number.toLocaleString('da-DK', { maximumFractionDigits: digits });
}

function guestEstimate(slices) {
  const adults = Math.floor(positive(guests.adults));
  const children = Math.floor(positive(guests.children));
  return [Math.round((adults * 4 + children * 2) / slices), Math.ceil((adults * 5 + children * 3) / slices)].join('–');
}
</script>

<template>
  <div class="extra-content">
    <template v-if="entry.id === 'mel'">
      <section class="recipe-phase">
        <h2>Hydrering og melstyrke</h2>
        <p>Hydrering er vandets vægt i procent af melvægten. Med 500 g mel og 325 g vand er hydreringen 65 %.</p>
        <p>W-tallet beskriver melstyrken. Stærkere mel kan typisk optage mere vand og tåle længere fermentering. Tabellen giver vejledende intervaller.</p>
        <div class="extra-table">
          <table>
            <thead><tr><th>Mel</th><th>W-tal</th><th>Hydrering</th><th>Modningstid</th></tr></thead>
            <tbody><tr v-for="row in flourStrength" :key="row[0]"><td v-for="(cell, index) in row" :key="index">{{ cell }}</td></tr></tbody>
          </table>
        </div>
      </section>
      <section class="recipe-phase">
        <h2>Tipo 0 og Tipo 00</h2>
        <p>Begge bruges til napolitansk pizza. Tipo angiver melets udmalingsgrad. Brug melets W-tal og producentens anbefalinger til at vælge en styrke, der passer til din hævetid.</p>
      </section>
      <section class="recipe-phase">
        <h2>Bland to meltyper</h2>
        <p>Prøv f.eks. 80 % hvedemel og 20 % durummel. Begge meltyper tæller med i opskriftens samlede melvægt.</p>
        <div class="extra-fields">
          <label>Mel i alt (g)<input v-model.number="flourMix.total" type="number" min="0" step="any" /></label>
          <label>Andel af første meltype (%)<input v-model.number="flourMix.first" type="number" min="0" max="100" step="any" /></label>
        </div>
        <dl class="extra-results" aria-live="polite">
          <div><dt>Første meltype</dt><dd>{{ format(positive(flourMix.total) * firstFlourRatio) }} g</dd></div>
          <div><dt>Anden meltype</dt><dd>{{ format(positive(flourMix.total) * (1 - firstFlourRatio)) }} g</dd></div>
        </dl>
      </section>
    </template>

    <section v-else-if="entry.id === 'gaer'" class="recipe-phase">
      <h2>Omregn gærmængden</h2>
      <p>Omregneren bruger samme forhold som pizzaopskrifterne. 1 g instant tørgær svarer til 4 g frisk gær. 1 g aktiv tørgær svarer til 3 g frisk gær.</p>
      <div class="extra-fields">
        <label>Mængde (g)<input v-model.number="yeastAmount" type="number" min="0" step="any" /></label>
        <label>Gærtype<select v-model="yeastType"><option v-for="(name, type) in da.yeastNames" :key="type" :value="type">{{ name }}</option></select></label>
      </div>
      <dl class="extra-results" aria-live="polite">
        <div v-for="(name, type) in da.yeastNames" :key="type"><dt>{{ name }}</dt><dd>{{ format(positive(yeastAmount) * yeastFactors[yeastType] / yeastFactors[type]) }} g</dd></div>
      </dl>
    </section>

    <section v-else-if="entry.id === 'vand'" class="recipe-phase">
      <h2>Beregn vandtemperaturen</h2>
      <p>Regnearket beregner et skøn for røremaskine. Træk meltemperaturen og varmen fra æltningen fra det dobbelte af den ønskede dejtemperatur.</p>
      <div class="extra-fields">
        <label>Ønsket dejtemperatur (°C)<input v-model.number="water.dough" type="number" step="any" /></label>
        <label>Meltemperatur (°C)<input v-model.number="water.flour" type="number" step="any" /></label>
        <label>Lav hastighed (min.)<input v-model.number="water.low" type="number" min="0" step="any" /></label>
        <label>Mellem hastighed (min.)<input v-model.number="water.medium" type="number" min="0" step="any" /></label>
      </div>
      <p v-if="waterReady" class="extra-result" aria-live="polite">Beregnet vandtemperatur <strong>{{ format(waterTemperature) }} °C</strong></p>
      <p v-if="waterReady && waterTemperature < 0">Beregningen ligger under frysepunktet. Sænk meltemperaturen eller forkort maskinæltningen, og beregn igen.</p>
    </section>

    <template v-else-if="entry.id === 'maengde-og-antal'">
      <section class="recipe-phase">
        <h2>Hvor mange pizzaer?</h2>
        <p>Regnearket regner med 4–5 stykker pr. voksen og 2–3 pr. barn.</p>
        <div class="extra-fields">
          <label>Voksne<input v-model.number="guests.adults" type="number" min="0" /></label>
          <label>Børn<input v-model.number="guests.children" type="number" min="0" /></label>
        </div>
        <div class="extra-table">
          <table>
            <thead><tr><th>Størrelse</th><th>Diameter</th><th>Napolitansk dej</th><th>NY-dej</th><th>Antal pizzaer</th></tr></thead>
            <tbody><tr v-for="size in pizzaSizes" :key="size.name">
              <th scope="row">{{ size.name }}</th><td>{{ size.diameter }} cm</td><td>{{ size.neapolitan }} g</td><td>{{ size.newYork }} g</td><td>{{ guestEstimate(size.slices) }}</td>
            </tr></tbody>
          </table>
        </div>
      </section>
      <section class="recipe-phase">
        <h2>Dejvægt til bageformen</h2>
        <div class="extra-fields">
          <label>Længde (cm)<input v-model.number="pan.length" type="number" min="0" step="any" /></label>
          <label>Bredde (cm)<input v-model.number="pan.width" type="number" min="0" step="any" /></label>
          <label>Rund form, diameter (cm)<input v-model.number="pan.diameter" type="number" min="0" step="any" /></label>
        </div>
        <dl class="extra-results" aria-live="polite">
          <div><dt>Detroit, rektangulær form</dt><dd>{{ format(positive(pan.length) * positive(pan.width) * 0.579, 0) }} g</dd></div>
          <div><dt>Rund deep pan</dt><dd>{{ format((positive(pan.diameter) / 2) ** 2 * 3.14 * 0.6, 0) }} g</dd></div>
        </dl>
      </section>
      <section class="recipe-phase">
        <h2>Sauce, ost og toppings</h2>
        <p>Vejledende mængder for fyld efter størrelse og pizzatype.</p>
        <div class="extra-fields">
          <label>Pizzatype<select v-model="topping.style"><option value="round">Rund pizza</option><option value="neapolitan">Napolitansk</option></select></label>
          <label>Diameter (cm)<input v-model.number="topping.diameter" type="number" min="0" step="any" /></label>
          <label>Antal pizzaer<input v-model.number="topping.count" type="number" min="0" /></label>
        </div>
        <dl class="extra-results" aria-live="polite">
          <div v-for="(label, index) in labels" :key="label"><dt>{{ label }}</dt><dd>{{ format(toppingFactors[topping.style][index] * positive(topping.diameter) * Math.floor(positive(topping.count)), 0) }} g</dd></div>
        </dl>
      </section>
    </template>

    <section v-else-if="entry.id === 'skaler-opskrift'" class="recipe-phase">
      <h2>Skaler en direkte dej</h2>
      <p>Indtast din opskrifts ingredienser i gram. Angiv derefter antal og dejvægt, så mængderne skaleres med samme forhold.</p>
      <div class="extra-fields">
        <label>Antal pizzaer<input v-model.number="target.count" type="number" min="1" /></label>
        <label>Gram pr. dejbolle<input v-model.number="target.weight" type="number" min="1" step="any" /></label>
      </div>
      <div v-for="(row, index) in ingredients" :key="index" class="scale-row">
        <label>Ingrediens {{ index + 1 }}<input v-model="row.name" type="text" /></label>
        <label>Oprindelig vægt (g)<input v-model.number="row.amount" type="number" min="0" step="any" /></label>
      </div>
      <button class="extra-add" type="button" @click="ingredients.push({ name: '', amount: 0 })">Tilføj ingrediens</button>
      <dl v-if="scale" class="extra-results" aria-live="polite">
        <div v-for="(row, index) in ingredients" :key="index"><dt>{{ row.name || `Ingrediens ${index + 1}` }}</dt><dd>{{ format(positive(row.amount) * scale) }} g</dd></div>
        <div><dt><strong>Dej i alt</strong></dt><dd>{{ format(targetWeight) }} g</dd></div>
      </dl>
    </section>

    <section v-if="articles[entry.id]" aria-labelledby="article-list-title">
      <h2 id="article-list-title">{{ entry.kind }}</h2>
      <div class="recipe-grid article-grid">
        <a v-for="article in articles[entry.id]" :key="article.id" class="recipe-card" :href="`${path}/${article.id}`">
          <span class="recipe-name">{{ article.title }}</span>
          <span v-if="article.intro" class="recipe-time">{{ article.intro }}</span>
          <span class="recipe-arrow" aria-hidden="true">→</span>
        </a>
      </div>
    </section>
  </div>
</template>
