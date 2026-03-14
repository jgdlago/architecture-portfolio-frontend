<template>
  <section class="featured">
    <header class="header">
      <h2>Projetos Selecionados</h2>
      <p>Uma curadoria dos trabalhos mais representativos.</p>
    </header>

    <div class="grid">
      <RouterLink
        v-for="project in projects"
        :key="project.id"
        class="project"
        :to="`/projects/${project.slug}`"
      >
        <div class="image-wrapper">
          <img v-if="resolveMediaUrl(project.cover_image_path)" :src="resolveMediaUrl(project.cover_image_path)" :alt="project.title" />
          <div v-else class="no-image">Sem imagem cadastrada</div>
        </div>

        <div class="info">
          <h3>{{ project.title }}</h3>
          <span>{{ project.category || 'Projeto' }}</span>
        </div>
      </RouterLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { HomeProjectItem } from '@/api/home';
import { resolveMediaUrl } from '@/api/http';
import { RouterLink } from 'vue-router';

defineProps<{
  projects: HomeProjectItem[]
}>()
</script>


<style scoped>
.featured {
  padding: 6rem 3rem;
  background-color: var(--background);
  color: var(--primary-text);
}

.header {
  max-width: 600px;
  margin-bottom: 4rem;
}

.header h2 {
  font-size: 1.8rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 1rem;
}

.header p {
  font-size: 0.95rem;
  color: var(--contrast-brown);
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 3rem;
}

.project {
  text-decoration: none;
  color: inherit;
  cursor: pointer;
}

.image-wrapper {
  overflow: hidden;
  min-height: 260px;
  background: color-mix(in srgb, var(--contrast-brown) 12%, transparent);
}

.image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.no-image {
  min-height: 260px;
  display: grid;
  place-items: center;
  font-size: 0.85rem;
  color: var(--contrast-brown);
  letter-spacing: 0.04em;
}

.project:hover img {
  transform: scale(1.05);
}

.info {
  margin-top: 1rem;
}

.info h3 {
  font-size: 1rem;
  font-weight: 500;
}

.info span {
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--contrast-gold);
}

@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
  }

  .featured {
    padding: 4rem 1.5rem;
  }
}

</style>

