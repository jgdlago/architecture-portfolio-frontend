<template>
  <section class="process container">
    <header class="reveal-slide-up">
      <h2>{{ title }}</h2>
    </header>

    <div class="steps">
      <div v-for="(step, index) in steps" :key="`${step.title}-${index}`" class="step reveal-slide-up" :style="{ transitionDelay: `${Math.min(index * 80, 280)}ms` }">
        <span class="index">{{ String(index + 1).padStart(2, '0') }}</span>
        <h3>{{ step.title }}</h3>
        <p>{{ step.description }}</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useScrollReveal } from '@/composables/useScrollReveal';

withDefaults(
  defineProps<{
    title?: string
    steps?: Array<{ title: string; description: string }>
  }>(),
  {
    title: 'Processo',
    steps: () => [
      {
        title: 'Contexto',
        description: 'Leitura do lugar, da cidade e das relacoes que o espaco propoe.',
      },
      {
        title: 'Conceito',
        description: 'Traducao das necessidades em uma ideia clara e estruturadora.',
      },
      {
        title: 'Forma',
        description: 'Materializacao do conceito em arquitetura precisa e atemporal.',
      },
    ],
  },
)

useScrollReveal()
</script>

<style scoped>
.process {
  padding: var(--space-20) 0;
  background-color: var(--background);
  color: var(--primary-text);
}

.process header {
  margin-bottom: var(--space-10);
}

.process h2 {
  margin: 0;
  font-family: var(--font-family-heading);
  font-size: clamp(2rem, 4.3vw, 3rem);
  line-height: 1.1;
}

.steps {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-4);
}

.step {
  position: relative;
  padding: var(--space-8);
  background: color-mix(in srgb, var(--surface) 94%, transparent);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  transition: transform var(--transition-fast), box-shadow var(--transition-fast), border-color var(--transition-fast);
}

.index {
  display: inline-block;
  font-family: var(--font-family-heading);
  font-size: 2.2rem;
  line-height: 1;
  color: color-mix(in srgb, var(--contrast-gold) 74%, transparent);
}

.step h3 {
  margin: var(--space-4) 0 var(--space-3);
  font-size: 1.05rem;
  letter-spacing: 0.05em;
}

.step p {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.86;
  color: var(--contrast-brown);
}

.step:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
  border-color: color-mix(in srgb, var(--contrast-gold) 55%, var(--border));
}

@media (max-width: 1024px) {
  .steps {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .process {
    padding: var(--space-16) 0;
  }

  .step {
    padding: var(--space-6);
  }
}
</style>
