<template>
  <section class="experience container">
    <header class="reveal-slide-up">
      <h2>{{ title }}</h2>
      <p>{{ subtitle }}</p>
    </header>

    <div class="blocks">
      <div v-for="(block, index) in blocks" :key="`${block.title}-${index}`" class="block reveal-slide-up" :style="{ transitionDelay: `${Math.min(index * 80, 280)}ms` }">
        <h3>{{ block.title }}</h3>
        <ul>
          <li v-for="(item, itemIndex) in block.items" :key="`${item}-${itemIndex}`">{{ item }}</li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useScrollReveal } from '@/composables/useScrollReveal';

withDefaults(
  defineProps<{
    title?: string
    subtitle?: string
    blocks?: Array<{ title: string; items: string[] }>
  }>(),
  {
    title: 'Atuação',
    subtitle: 'Arquitetura aplicada a diferentes escalas e contextos, sempre com atencao ao lugar e as pessoas.',
    blocks: () => [
      {
        title: 'Tipologias',
        items: ['Residencial', 'Comercial', 'Institucional', 'Interiores'],
      },
      {
        title: 'Experiencia',
        items: ['+6 anos de pratica profissional', 'Projetos executivos e acompanhamento de obra', 'Atuação do conceito a execucao'],
      },
      {
        title: 'Atuação',
        items: ['Brasil', 'Projetos remotos', 'Contextos urbanos e naturais'],
      },
    ],
  },
)

useScrollReveal()
</script>

<style scoped>
.experience {
  padding: var(--space-20) 0;
  background-color: color-mix(in srgb, var(--background) 92%, transparent);
  color: var(--primary-text);
}

.experience header {
  max-width: 600px;
  margin-bottom: var(--space-10);
}

.experience h2 {
  margin: 0 0 var(--space-4);
  font-family: var(--font-family-heading);
  font-size: clamp(2rem, 4.3vw, 3rem);
  line-height: 1.1;
}

.experience header p {
  margin: 0;
  font-size: 1rem;
  line-height: 1.8;
  color: var(--contrast-brown);
}

.blocks {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-4);
}

.block {
  padding: var(--space-8);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  background: color-mix(in srgb, var(--surface) 94%, transparent);
  box-shadow: var(--shadow-sm);
  transition: transform var(--transition-fast), box-shadow var(--transition-fast), border-color var(--transition-fast);
}

.block:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
  border-color: color-mix(in srgb, var(--contrast-gold) 50%, var(--border));
}

.block h3 {
  margin: 0 0 var(--space-4);
  font-size: 0.92rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.block ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.block li {
  position: relative;
  padding-left: 1rem;
  font-size: 0.88rem;
  line-height: 1.9;
  color: var(--primary-text);
}

.block li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.78rem;
  width: 0.33rem;
  height: 0.33rem;
  border-radius: 999px;
  background: var(--contrast-gold);
}

@media (max-width: 1024px) {
  .blocks {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .experience {
    padding: var(--space-16) 0;
  }

  .block {
    padding: var(--space-6);
  }
}
</style>