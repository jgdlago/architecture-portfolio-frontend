<template>
  <section class="hero" :style="heroStyle">
    <div class="overlay">
      <div class="content reveal-slide-up revealed">
        <h1>{{ props.title }}</h1>
        <p>{{ props.subtitle }}</p>
      </div>
    </div>

    <span class="scroll-indicator" aria-hidden="true">
      <span class="line" />
    </span>
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
  background-position: center center;
  background-repeat: no-repeat;
  position: relative;
  display: flex;
  align-items: flex-end;
}

.overlay {
  width: 100%;
  padding: clamp(3.5rem, 9vw, 6rem) clamp(1.2rem, 6vw, 4rem);
  background: linear-gradient(
    0deg,
    color-mix(in srgb, var(--hero-overlay) 84%, black 16%) 0%,
    color-mix(in srgb, var(--hero-overlay) 55%, transparent) 45%,
    rgba(0, 0, 0, 0.05) 100%
  );
}

.content {
  max-width: 740px;
}

h1 {
  font-family: var(--font-family-heading);
  font-size: clamp(2.6rem, 7vw, 5.1rem);
  font-weight: 600;
  line-height: 1.04;
  letter-spacing: 0.01em;
  color: var(--hero-text);
  margin: 0 0 0.95rem;
  animation: hero-title-in 0.8s ease both;
}

p {
  font-size: clamp(1rem, 2.4vw, 1.2rem);
  line-height: 1.72;
  color: color-mix(in srgb, var(--hero-text) 87%, transparent);
  max-width: 560px;
  margin: 0;
  animation: hero-subtitle-in 0.9s ease both;
  animation-delay: 0.16s;
}

.scroll-indicator {
  position: absolute;
  bottom: 1.25rem;
  left: 50%;
  transform: translateX(-50%);
  width: 18px;
  height: 38px;
  border: 1px solid color-mix(in srgb, var(--hero-text) 40%, transparent);
  border-radius: 999px;
  display: grid;
  place-items: center;
  opacity: 0.85;
}

.line {
  width: 2px;
  height: 9px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--hero-text) 84%, transparent);
  animation: scroll-pulse 1.45s ease-in-out infinite;
}

@keyframes hero-title-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes hero-subtitle-in {
  from {
    opacity: 0;
    transform: translateY(22px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scroll-pulse {
  0%,
  100% {
    transform: translateY(-2px);
    opacity: 0.2;
  }
  55% {
    transform: translateY(5px);
    opacity: 1;
  }
}

@media (min-width: 1024px) {
  .hero {
    background-attachment: fixed;
  }
}

@media (max-width: 640px) {
  .scroll-indicator {
    width: 15px;
    height: 34px;
    bottom: 1rem;
  }
}
</style>
