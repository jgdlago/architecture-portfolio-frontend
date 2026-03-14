<template>
  <section class="experience">
    <header>
      <h2>{{ title }}</h2>
      <p>{{ subtitle }}</p>
    </header>

    <div class="blocks">
      <div v-for="(block, index) in blocks" :key="`${block.title}-${index}`" class="block">
        <h3>{{ block.title }}</h3>
        <ul>
          <li v-for="(item, itemIndex) in block.items" :key="`${item}-${itemIndex}`">{{ item }}</li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string
    subtitle?: string
    blocks?: Array<{ title: string; items: string[] }>
  }>(),
  {
    title: 'Atuacao',
    subtitle: 'Arquitetura aplicada a diferentes escalas e contextos, sempre com atencao ao lugar e as pessoas.',
    blocks: () => [
      {
        title: 'Tipologias',
        items: ['Residencial', 'Comercial', 'Institucional', 'Interiores'],
      },
      {
        title: 'Experiencia',
        items: ['+6 anos de pratica profissional', 'Projetos executivos e acompanhamento de obra', 'Atuacao do conceito a execucao'],
      },
      {
        title: 'Atuacao',
        items: ['Brasil', 'Projetos remotos', 'Contextos urbanos e naturais'],
      },
    ],
  },
)
</script>

<style scoped>
.experience {
  padding: 6rem 3rem;
  background-color: color-mix(
    in srgb,
    var(--background) 90%,
    transparent
  );
  color: var(--primary-text);
}

.experience header {
  max-width: 600px;
  margin-bottom: 4rem;
}

.experience h2 {
  font-size: 1.5rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  margin-bottom: 1.5rem;
}

.experience header p {
  font-size: 0.95rem;
  line-height: 1.8;
  color: var(--contrast-brown);
}

.blocks {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 3rem;
}

.block h3 {
  font-size: 0.9rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  margin-bottom: 1.5rem;
}

.block ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.block li {
  font-size: 0.85rem;
  line-height: 2;
  color: var(--primary-text);
}

@media (max-width: 768px) {
  .blocks {
    grid-template-columns: 1fr;
  }
}
</style>