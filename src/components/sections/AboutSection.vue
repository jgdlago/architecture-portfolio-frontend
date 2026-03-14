<template>
  <section class="about">
    <div class="image">
      <img :src="image" alt="Arquiteta" />
    </div>

    <div class="content">
      <h2>Sobre</h2>
      <p>{{ text }}</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import fallbackImage from '@/assets/images/tmp/profile.png';

withDefaults(
  defineProps<{
    text?: string
    image?: string
  }>(),
  {
    text: 'Arquitetura como experiencia. Cada projeto nasce do dialogo entre espaco, contexto e quem o habita.',
    image: fallbackImage,
  },
)
</script>

<style scoped>
.about {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  padding: 6rem 3rem;
  background-color: var(--background);
}

.image img {
  width: 100%;
  object-fit: cover;
  filter: grayscale(100%);
}

.content h2 {
  font-size: 1.5rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  margin-bottom: 2rem;
}

.content p {
  font-size: 1rem;
  line-height: 1.8;
  color: var(--contrast-brown);
}
</style>
