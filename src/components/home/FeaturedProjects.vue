<template>
  <section class="featured container">
    <header class="header reveal-slide-up">
      <h2>{{ title }}</h2>
      <p>{{ description }}</p>
    </header>

    <div class="grid">
      <RouterLink
        v-for="(project, index) in projects"
        :key="project.id"
        class="project reveal-slide-up"
        :class="{ 'featured-card': index === 0 }"
        :style="{ transitionDelay: `${Math.min(index * 70, 320)}ms` }"
        :to="`/projects/${project.slug}`"
      >
        <div class="image-wrapper">
          <img v-if="resolveMediaUrl(project.cover_image_path)" :src="resolveMediaUrl(project.cover_image_path)" :alt="project.title" />
          <div v-else class="no-image">Sem imagem cadastrada</div>

          <div class="overlay">
            <h3>{{ project.title }}</h3>
            <span>{{ project.category || 'Projeto' }}</span>
          </div>
        </div>
      </RouterLink>
    </div>

    <RouterLink to="/projects" class="all-projects reveal-fade">Ver todos os projetos</RouterLink>
  </section>
</template>

<script setup lang="ts">
import type { HomeProjectItem } from '@/api/home';
import { resolveMediaUrl } from '@/api/http';
import { useScrollReveal } from '@/composables/useScrollReveal';
import { nextTick, watch } from 'vue';
import { RouterLink } from 'vue-router';

const props = withDefaults(
  defineProps<{
    projects: HomeProjectItem[]
    title?: string
    description?: string
  }>(),
  {
    title: 'Projetos Selecionados',
    description: 'Uma curadoria dos trabalhos mais representativos.',
  },
)

const { observe } = useScrollReveal()

watch(
  () => props.projects,
  async () => {
    await nextTick()
    observe()
  },
  { deep: true },
)
</script>


<style scoped>
.featured {
  padding: var(--space-20) 0 var(--space-16);
  background-color: var(--background);
  color: var(--primary-text);
}

.header {
  max-width: 700px;
  margin-bottom: var(--space-12);
}

.header h2 {
  margin: 0 0 var(--space-4);
  font-family: var(--font-family-heading);
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 600;
  line-height: 1.1;
}

.header p {
  margin: 0;
  font-size: 1rem;
  color: var(--contrast-brown);
  max-width: 520px;
  line-height: 1.7;
}

.grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--space-4);
}

.project {
  grid-column: span 6;
  text-decoration: none;
  color: inherit;
  cursor: pointer;
}

.featured-card {
  grid-column: span 12;
}

.image-wrapper {
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-lg);
  min-height: 280px;
  background: color-mix(in srgb, var(--contrast-brown) 18%, transparent);
  box-shadow: var(--shadow-md);
}

.image-wrapper img {
  width: 100%;
  height: 100%;
  min-height: 280px;
  object-fit: cover;
  transition: transform 0.7s ease, filter 0.4s ease;
}

.no-image {
  min-height: 280px;
  display: grid;
  place-items: center;
  font-size: 0.85rem;
  color: var(--contrast-brown);
  letter-spacing: 0.04em;
}

.overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: var(--space-2);
  padding: var(--space-8);
  background: linear-gradient(0deg, rgba(14, 12, 10, 0.78) 0%, rgba(14, 12, 10, 0.14) 54%, transparent 100%);
  opacity: 0;
  transition: opacity var(--transition-base);
}

.overlay h3 {
  margin: 0;
  font-family: var(--font-family-heading);
  font-size: clamp(1.35rem, 2.7vw, 2rem);
  line-height: 1.1;
  color: #f7f3ed;
}

.overlay span {
  font-size: 0.74rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: color-mix(in srgb, var(--contrast-gold) 84%, white 16%);
}

.project:hover img {
  transform: scale(1.08);
  filter: brightness(0.76);
}

.project:hover .overlay {
  opacity: 1;
}

.all-projects {
  display: inline-flex;
  margin-top: var(--space-10);
  text-decoration: none;
  font-size: 0.78rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--contrast-brown);
  border-bottom: 1px solid color-mix(in srgb, var(--contrast-brown) 42%, transparent);
  padding-bottom: 0.25rem;
  transition: color var(--transition-fast), border-color var(--transition-fast);
}

.all-projects:hover {
  color: var(--contrast-gold);
  border-color: var(--contrast-gold);
}

@media (max-width: 1024px) {
  .project,
  .featured-card {
    grid-column: span 12;
  }
}

@media (max-width: 640px) {
  .grid {
    gap: var(--space-3);
  }

  .featured {
    padding: var(--space-16) 0 var(--space-12);
  }

  .image-wrapper,
  .image-wrapper img,
  .no-image {
    min-height: 230px;
  }

  .overlay {
    opacity: 1;
    padding: var(--space-6);
  }
}

</style>

