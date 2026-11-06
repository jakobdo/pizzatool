<script setup>
import { computed, nextTick, ref } from 'vue';
import { da as copy } from './da.js';

const props = defineProps({
  phases: { type: Array, required: true },
  completedSteps: { type: Number, required: true },
  sectionNumber: { type: String, required: true },
  hint: { type: String, required: true },
});
const emit = defineEmits(['progress']);
const root = ref(null);
const totalSteps = computed(() => props.phases.reduce((total, phase) => total + phase.steps.length, 0));

async function setProgress(count) {
  emit('progress', count);
  await nextTick();
  root.value?.querySelector('[aria-current="step"], .method-complete')?.focus();
}
</script>

<template>
  <section ref="root" class="recipe-method" aria-labelledby="method-title">
    <div class="section-heading">
      <span class="step-number">{{ sectionNumber }}</span>
      <div>
        <h2 id="method-title">{{ copy.method }}</h2>
        <p>{{ hint }}</p>
      </div>
    </div>
    <div class="method-progress">
      <span aria-live="polite">
        {{ completedSteps === totalSteps ? `${totalSteps} / ${totalSteps} ${copy.stepsComplete}` : `${copy.step} ${completedSteps + 1} ${copy.of} ${totalSteps}` }}
      </span>
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
          <p>{{ step.text }}</p>
          <ul v-if="step.ingredients.length" class="step-ingredients" :aria-label="copy.stepIngredients">
            <li v-for="item in step.ingredients" :key="item.name">
              <strong>{{ item.grams }} g</strong> {{ item.name }}
            </li>
          </ul>
        </li>
      </ol>
    </section>
  </section>
</template>
