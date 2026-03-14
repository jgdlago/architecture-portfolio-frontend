<script setup lang="ts">
import { http } from '@/api/http'
import Footer from '@/components/layout/Footer.vue'
import Navbar from '@/components/layout/Navbar.vue'
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { resolveMediaUrl } from '../api/http'
import { fetchProjects, type ProjectListItem } from '../api/projects'

interface Category {
  id: number
  name: string
  slug: string
}

const projects = ref<ProjectListItem[]>([])
const categories = ref<Category[]>([])
const activeCategory = ref<string | undefined>(undefined)
const isLoading = ref(true)

const filteredProjects = computed(() => projects.value)

const loadProjects = async (category?: string) => {
  isLoading.value = true
  try {
    projects.value = await fetchProjects(category)
  } finally {
    isLoading.value = false
  }
}

const setCategory = (slug?: string) => {
  activeCategory.value = slug
  loadProjects(slug)
}

onMounted(async () => {
  try {
    const { data } = await http.get<Category[]>('/project-categories')
    categories.value = data
  } catch { /* ignore */ }
  await loadProjects()
})
</script>

<template>
  <Navbar />

  <main class="projects-page">
    <header class="page-header">
      <h1>Projetos</h1>
      <p>Conheça nossos projetos de arquitetura e design.</p>
    </header>

    <nav v-if="categories.length" class="filters">
      <button :class="{ active: !activeCategory }" @click="setCategory(undefined)">Todos</button>
      <button v-for="cat in categories" :key="cat.id" :class="{ active: activeCategory === cat.slug }"
        @click="setCategory(cat.slug)">
        {{ cat.name }}
      </button>
    </nav>

    <div v-if="isLoading" class="loading">Carregando projetos...</div>

    <div v-else-if="!projects.length" class="empty">
      <p>Nenhum projeto encontrado.</p>
    </div>

    <section v-else class="grid">
      <RouterLink v-for="project in filteredProjects" :key="project.id" :to="`/projects/${project.slug}`"
        class="card">
        <div class="card-image">
          <img v-if="project.cover_image_path" :src="resolveMediaUrl(project.cover_image_path)"
            :alt="project.title" />
          <div v-else class="no-image">Sem imagem</div>
          <span v-if="project.category" class="card-category">{{ project.category }}</span>
        </div>
        <div class="card-body">
          <h3>{{ project.title }}</h3>
          <p v-if="project.short_description">{{ project.short_description }}</p>
          <div class="card-meta">
            <span v-if="project.location">{{ project.location }}</span>
            <span v-if="project.year">{{ project.year }}</span>
          </div>
        </div>
      </RouterLink>
    </section>
  </main>

  <Footer />
</template>

<style scoped>
.projects-page {
  padding: 6rem 3rem 4rem;
  min-height: 60vh;
}

.page-header {
  max-width: 600px;
  margin-bottom: 3rem;
}

.page-header h1 {
  font-size: 1.8rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
}

.page-header p {
  color: var(--contrast-brown);
  font-size: 0.95rem;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 2.5rem;
}

.filters button {
  border: 1px solid color-mix(in srgb, var(--contrast-brown) 35%, transparent);
  border-radius: 999px;
  padding: 0.4rem 1.2rem;
  font-size: 0.8rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  background: transparent;
  color: var(--primary-text);
  cursor: pointer;
  transition: all 0.2s;
}

.filters button.active,
.filters button:hover {
  background: var(--contrast-gold);
  border-color: var(--contrast-gold);
}

.loading,
.empty {
  padding: 2rem 0;
  color: var(--contrast-brown);
}

.grid {
  display: grid;
  gap: 2.5rem;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}

.card {
  text-decoration: none;
  color: inherit;
  cursor: pointer;
}

.card-image {
  position: relative;
  overflow: hidden;
  border-radius: 4px;
}

.card-image img {
  width: 100%;
  height: 260px;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.card:hover .card-image img {
  transform: scale(1.04);
}

.no-image {
  width: 100%;
  height: 260px;
  display: grid;
  place-items: center;
  background: color-mix(in srgb, var(--contrast-brown) 15%, transparent);
  color: var(--contrast-brown);
  font-size: 0.85rem;
}

.card-category {
  position: absolute;
  top: 0.8rem;
  left: 0.8rem;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  font-size: 0.65rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  padding: 0.25rem 0.6rem;
  border-radius: 3px;
}

.card-body {
  margin-top: 1rem;
}

.card-body h3 {
  font-size: 1rem;
  font-weight: 500;
  margin: 0 0 0.3rem;
}

.card-body p {
  font-size: 0.85rem;
  color: var(--contrast-brown);
  margin: 0 0 0.5rem;
  line-height: 1.5;
}

.card-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.75rem;
  color: var(--contrast-gold);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

@media (max-width: 768px) {
  .projects-page {
    padding: 4rem 1.5rem 3rem;
  }

  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
