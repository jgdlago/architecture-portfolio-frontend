<template>
  <section class="process">
    <header>
      <h2>{{ title }}</h2>
    </header>

    <div class="steps">
      <div v-for="(step, index) in steps" :key="`${step.title}-${index}`" class="step">
        <span class="index">{{ String(index + 1).padStart(2, '0') }}</span>
        <h3>{{ step.title }}</h3>
        <p>{{ step.description }}</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
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
</script>

<style scoped>
.process {
  padding: 6rem 3rem;
  background-color: var(--background);
  color: var(--primary-text);
}

.process header {
  margin-bottom: 4rem;
}

.process h2 {
  font-size: 1.5rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
}

.steps {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 3rem;
}

.step {
  max-width: 320px;
}

.index {
  font-size: 0.8rem;
  letter-spacing: 0.3em;
  color: var(--contrast-gold);
}

.step h3 {
  font-size: 1rem;
  margin: 1rem 0;
}

.step p {
  font-size: 0.9rem;
  line-height: 1.8;
  color: var(--contrast-brown);
}

@media (max-width: 768px) {
  .steps {
    grid-template-columns: 1fr;
  }
}
</style>
