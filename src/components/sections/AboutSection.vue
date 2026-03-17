<template>
  <section class="about container">
    <div class="image reveal-slide-left">
      <img v-if="image" :src="image" alt="Arquiteta" />
      <div v-else class="image-placeholder">Imagem nao cadastrada</div>
    </div>

    <div class="content reveal-slide-right">
      <h2>Sobre</h2>
      <p>{{ text }}</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useScrollReveal } from '@/composables/useScrollReveal';

withDefaults(
  defineProps<{
    text?: string
    image?: string
  }>(),
  {
    text: 'Arquitetura como experiencia. Cada projeto nasce do dialogo entre espaco, contexto e quem o habita.',
    image: undefined,
  },
)

useScrollReveal()
</script>

<style scoped>
.about {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: var(--space-12);
  padding: var(--space-20) 0;
  background-color: var(--background);
}

.image {
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
}

.image img {
  width: 100%;
  min-height: 360px;
  height: 100%;
  object-fit: cover;
  filter: grayscale(20%);
}

.image-placeholder {
  min-height: 360px;
  display: grid;
  place-items: center;
  border: 1px dashed var(--border);
  border-radius: var(--radius-xl);
  color: var(--contrast-brown);
  font-size: 0.9rem;
}

.content h2 {
  margin: 0 0 var(--space-6);
  font-family: var(--font-family-heading);
  font-size: clamp(2rem, 4.3vw, 3rem);
  line-height: 1.1;
}

.content p {
  margin: 0;
  font-size: 1.04rem;
  line-height: 1.9;
  color: var(--contrast-brown);
}

@media (max-width: 1024px) {
  .about {
    grid-template-columns: 1fr;
    gap: var(--space-8);
  }
}

@media (max-width: 640px) {
  .about {
    padding: var(--space-16) 0;
  }

  .image img,
  .image-placeholder {
    min-height: 260px;
  }
}
</style>
