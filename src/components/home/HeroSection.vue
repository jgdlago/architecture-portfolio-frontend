<template>
  <section class="hero" :style="heroStyle">
    <div class="overlay">
      <div class="content">
        <h1>{{ props.title }}</h1>

        <p>{{ props.subtitle }}</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    title?: string
    subtitle?: string
    backgroundImage?: string
  }>(),
  {
    title: 'Arquitetura como narrativa espacial',
    subtitle: 'Projetos residenciais e comerciais guiados por luz, contexto e identidade.',
    backgroundImage: '',
  },
)

const heroStyle = computed(() => ({
  backgroundImage: props.backgroundImage ? `url('${props.backgroundImage}')` : 'none',
}))
</script>

<style scoped>
.hero {
  height: 100vh;
  background-color: color-mix(in srgb, var(--background) 88%, black 12%);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  display: flex;
  align-items: flex-end;
}

/* Camada para leitura do texto */
.overlay {
  width: 100%;
  padding: 4rem 3rem;
  background: linear-gradient(
    to top,
    var(--hero-overlay),
    transparent
  );
}

/* Conteúdo textual */
.content {
  max-width: 600px;
}

h1 {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 500;
  letter-spacing: 0.02em;
  color: var(--hero-text);
  margin-bottom: 1rem;
}

p {
  font-size: 1rem;
  line-height: 1.6;
  color: color-mix(
    in srgb,
    var(--hero-text) 85%,
    transparent
  );
  max-width: 480px;
}
</style>
