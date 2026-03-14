<script setup lang="ts">
import Footer from '@/components/layout/Footer.vue'
import Navbar from '@/components/layout/Navbar.vue'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { resolveMediaUrl } from '../api/http'
import { fetchProjectBySlug, type ProjectDetail } from '../api/projects'

const route = useRoute()
const project = ref<ProjectDetail | null>(null)
const isLoading = ref(true)

const slug = computed(() => String(route.params.slug || ''))

onMounted(async () => {
  try {
    project.value = await fetchProjectBySlug(slug.value)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <Navbar />

  <main class="project-detail">
    <p v-if="isLoading">Carregando projeto...</p>

    <template v-else-if="project">
      <header>
        <h1>{{ project.title }}</h1>
        <p>{{ project.description || project.short_description }}</p>
      </header>

      <ul class="meta">
        <li v-if="project.category">Categoria: {{ project.category.name }}</li>
        <li v-if="project.location">Local: {{ project.location }}</li>
        <li v-if="project.year">Ano: {{ project.year }}</li>
        <li v-if="project.area_m2">Area: {{ project.area_m2 }} m2</li>
      </ul>

      <section class="gallery">
        <img
          v-for="image in project.images"
          :key="image.id"
          :src="resolveMediaUrl(image.image_path)"
          :alt="image.alt_text || project.title"
        />
      </section>
    </template>

    <p v-else>Projeto nao encontrado.</p>
  </main>

  <Footer />
</template>

<style scoped>
.project-detail {
  padding: 4rem 3rem;
}

header {
  max-width: 860px;
  margin-bottom: 1.5rem;
}

.meta {
  list-style: none;
  padding: 0;
  margin: 0 0 2rem;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.gallery img {
  width: 100%;
  height: 260px;
  object-fit: cover;
  border-radius: 10px;
}
</style>
