<script setup lang="ts">
import Footer from '@/components/layout/Footer.vue'
import Navbar from '@/components/layout/Navbar.vue'
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { resolveMediaUrl } from '../api/http'
import { fetchProjects, type ProjectListItem } from '../api/projects'

const projects = ref<ProjectListItem[]>([])
const isLoading = ref(true)

onMounted(async () => {
  try {
    projects.value = await fetchProjects()
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <Navbar />

  <main class="projects-page">
    <header class="page-header">
      <h1>Projetos</h1>
      <p>Selecao completa de projetos cadastrados no painel administrativo.</p>
    </header>

    <p v-if="isLoading">Carregando projetos...</p>

    <section v-else class="grid">
      <RouterLink
        v-for="project in projects"
        :key="project.id"
        :to="`/projects/${project.slug}`"
        class="card"
      >
        <img :src="resolveMediaUrl(project.cover_image_path)" :alt="project.title" />
        <h3>{{ project.title }}</h3>
        <p>{{ project.short_description || 'Sem descricao' }}</p>
      </RouterLink>
    </section>
  </main>

  <Footer />
</template>

<style scoped>
.projects-page {
  padding: 4rem 3rem;
}

.page-header {
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.grid {
  display: grid;
  gap: 2rem;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
}

.card {
  text-decoration: none;
  color: inherit;
}

.card img {
  width: 100%;
  height: 220px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 1rem;
}

.card h3 {
  margin: 0 0 0.5rem;
}
</style>
