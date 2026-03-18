<script setup lang="ts">
import Footer from '@/components/layout/Footer.vue'
import Navbar from '@/components/layout/Navbar.vue'
import { useScrollReveal } from '@/composables/useScrollReveal'
import { applySeo } from '@/composables/useSeo'
import { ArrowLeftIcon, ChevronLeftIcon, ChevronRightIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import axios from 'axios'
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { resolveMediaUrl } from '../api/http'
import { fetchProjectBySlug, type ProjectDetail } from '../api/projects'

const route = useRoute()
const project = ref<ProjectDetail | null>(null)
const isLoading = ref(true)
const loadError = ref(false)

const slug = computed(() => String(route.params.slug || ''))
const { observe } = useScrollReveal()

// Lightbox state
const lightboxOpen = ref(false)
const lightboxIndex = ref(0)

const allImages = computed(() => {
  if (!project.value) return []
  const images = [...project.value.images].sort((a, b) => a.sort_order - b.sort_order)
  // If cover_image_path exists and isn't already in the gallery, prepend it
  if (project.value.cover_image_path) {
    const coverInGallery = images.some(
      (img) => img.image_path === project.value!.cover_image_path
    )
    if (!coverInGallery) {
      images.unshift({
        id: 0,
        image_path: project.value.cover_image_path,
        alt_text: project.value.title,
        caption: null,
        sort_order: -1,
        is_cover: true,
      })
    }
  }
  return images
})

const lightboxImage = computed(() => allImages.value[lightboxIndex.value])

function openLightbox(index: number) {
  lightboxIndex.value = index
  lightboxOpen.value = true
}

function closeLightbox() {
  lightboxOpen.value = false
}

function lightboxPrev() {
  lightboxIndex.value = (lightboxIndex.value - 1 + allImages.value.length) % allImages.value.length
}

function lightboxNext() {
  lightboxIndex.value = (lightboxIndex.value + 1) % allImages.value.length
}

function onKeydown(e: KeyboardEvent) {
  if (!lightboxOpen.value) return
  if (e.key === 'Escape') closeLightbox()
  if (e.key === 'ArrowLeft') lightboxPrev()
  if (e.key === 'ArrowRight') lightboxNext()
}

const additionalInfoEntries = computed(() => {
  if (!project.value?.additional_info) return []
  return Object.entries(project.value.additional_info)
})

onMounted(async () => {
  document.addEventListener('keydown', onKeydown)
  try {
    project.value = await fetchProjectBySlug(slug.value)
    loadError.value = false

    if (project.value) {
      const seoDescription = project.value.short_description
        || project.value.description
        || `Conheça o projeto ${project.value.title}.`

      applySeo({
        title: `${project.value.title} | Projetos`,
        description: seoDescription,
        image: resolveMediaUrl(project.value.cover_image_path),
        path: `/projects/${project.value.slug}`,
      })
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      project.value = null
      loadError.value = false
    } else {
      loadError.value = true
    }
  } finally {
    isLoading.value = false
    await nextTick()
    observe()
  }
})

watch(
  () => project.value?.id,
  async () => {
    await nextTick()
    observe()
  },
)

onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <div>
  <Navbar />

  <main class="project-detail">
    <section v-if="isLoading" class="project-loading container">
      <div class="skeleton skeleton-image" style="min-height: 420px;" />
      <div class="skeleton skeleton-text" style="width: 42%; margin-top: 1.3rem;" />
      <div class="skeleton skeleton-text" style="width: 88%; margin-top: 0.8rem;" />
      <div class="skeleton skeleton-text" style="width: 78%; margin-top: 0.55rem;" />
    </section>

    <template v-else-if="project">
      <div class="container">
        <RouterLink to="/projects" class="back-link reveal-fade">
          <ArrowLeftIcon class="back-icon" />
          Voltar aos projetos
        </RouterLink>
      </div>

      <div v-if="allImages.length" class="hero-image reveal-fade" @click="openLightbox(0)">
        <img :src="resolveMediaUrl(allImages[0]!.image_path)" :alt="allImages[0]!.alt_text || project.title" loading="eager" fetchpriority="high" decoding="async" />
      </div>

      <div class="content-grid container">
        <div class="content-main reveal-slide-up">
          <header>
            <span v-if="project.category" class="category-badge">{{ project.category.name }}</span>
            <h1>{{ project.title }}</h1>
          </header>

          <p v-if="project.description" class="description">{{ project.description }}</p>
          <p v-else-if="project.short_description" class="description">{{ project.short_description }}</p>
        </div>

        <aside class="content-meta reveal-slide-up" style="transition-delay: 100ms;">
          <dl>
            <template v-if="project.location">
              <dt>Local</dt>
              <dd>{{ project.location }}</dd>
            </template>
            <template v-if="project.year">
              <dt>Ano</dt>
              <dd>{{ project.year }}</dd>
            </template>
            <template v-if="project.area_m2">
              <dt>Área</dt>
              <dd>{{ project.area_m2 }} m²</dd>
            </template>
            <template v-if="project.category">
              <dt>Categoria</dt>
              <dd>{{ project.category.name }}</dd>
            </template>
            <template v-for="[key, value] in additionalInfoEntries" :key="key">
              <dt>{{ key }}</dt>
              <dd>{{ value }}</dd>
            </template>
          </dl>
        </aside>
      </div>

      <section v-if="allImages.length > 1" class="gallery container reveal-slide-up">
        <h2>Galeria</h2>
        <div class="gallery-grid">
          <button
            v-for="(image, idx) in allImages"
            :key="image.id"
            class="gallery-item"
            @click="openLightbox(idx)"
          >
            <img
              :src="resolveMediaUrl(image.image_path)"
              :alt="image.alt_text || project.title"
              loading="lazy"
              decoding="async"
            />
          </button>
        </div>
      </section>

      <!-- Lightbox -->
      <Teleport to="body">
        <Transition name="lightbox-fade">
          <div v-if="lightboxOpen && lightboxImage" class="lightbox" @click.self="closeLightbox">
            <button class="lb-close" @click="closeLightbox" aria-label="Fechar">
              <XMarkIcon />
            </button>

            <button v-if="allImages.length > 1" class="lb-nav lb-prev" @click="lightboxPrev" aria-label="Anterior">
              <ChevronLeftIcon />
            </button>

            <img
              :src="resolveMediaUrl(lightboxImage.image_path)"
              :alt="lightboxImage.alt_text || project?.title"
              class="lb-image"
            />

            <button v-if="allImages.length > 1" class="lb-nav lb-next" @click="lightboxNext" aria-label="Próxima">
              <ChevronRightIcon />
            </button>

            <div v-if="lightboxImage.caption" class="lb-caption">{{ lightboxImage.caption }}</div>
            <div class="lb-counter">{{ lightboxIndex + 1 }} / {{ allImages.length }}</div>
          </div>
        </Transition>
      </Teleport>
    </template>

    <div v-else-if="loadError" class="not-found container">
      <p>Não foi possível carregar o projeto no momento.</p>
      <RouterLink to="/projects" class="back-link">Voltar para projetos</RouterLink>
    </div>

    <div v-else class="not-found container">
      <p>Projeto não encontrado.</p>
      <RouterLink to="/projects" class="back-link">Ver todos os projetos</RouterLink>
    </div>
  </main>

  <Footer />
  </div>
</template>

<style scoped>
.project-detail {
  padding: var(--space-8) 0 var(--space-16);
}

.project-loading,
.not-found {
  padding: var(--space-10) 0;
  text-align: center;
  color: var(--contrast-brown);
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  text-decoration: none;
  color: var(--contrast-brown);
  font-size: 0.8rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: var(--space-6);
  transition: color 0.2s;
}

.back-link:hover {
  color: var(--contrast-gold);
}

.back-icon {
  width: 16px;
  height: 16px;
}

.hero-image {
  width: 100%;
  overflow: hidden;
  margin-bottom: var(--space-12);
  cursor: pointer;
  box-shadow: var(--shadow-xl);
}

.hero-image img {
  width: 100%;
  min-height: clamp(320px, 52vw, 620px);
  max-height: 640px;
  object-fit: cover;
  transition: transform 0.7s ease;
}

.hero-image:hover img {
  transform: scale(1.02);
}

.content-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 290px;
  gap: var(--space-12);
  margin-bottom: var(--space-12);
}

.content-main header {
  margin-bottom: var(--space-6);
}

.category-badge {
  display: inline-block;
  font-size: 0.65rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--contrast-gold);
  border: 1px solid var(--contrast-gold);
  padding: 0.2rem 0.6rem;
  border-radius: 3px;
  margin-bottom: 0.8rem;
}

.content-main h1 {
  margin: 0;
  font-family: var(--font-family-heading);
  font-size: clamp(2rem, 5vw, 3.4rem);
  line-height: 1.04;
}

.description {
  margin: 0;
  font-size: 1rem;
  line-height: 1.85;
  color: var(--contrast-brown);
}

.content-meta dl {
  display: grid;
  gap: 0;
  padding: var(--space-6);
  border-radius: var(--radius-lg);
  background: color-mix(in srgb, var(--surface) 93%, transparent);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-sm);
}

.content-meta dt {
  font-size: 0.7rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--contrast-brown);
  margin-top: 1rem;
}

.content-meta dd {
  margin: 0.3rem 0 0;
  font-size: 0.95rem;
  font-weight: 500;
  padding-bottom: 1.2rem;
  border-bottom: 1px solid color-mix(in srgb, var(--contrast-brown) 15%, transparent);
}

/* Gallery */
.gallery {
  margin-top: var(--space-6);
}

.gallery h2 {
  margin: 0 0 var(--space-6);
  font-family: var(--font-family-heading);
  font-size: clamp(1.6rem, 3.4vw, 2.2rem);
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: var(--space-3);
}

.gallery-item {
  border: none;
  padding: 0;
  background: none;
  cursor: pointer;
  overflow: hidden;
  border-radius: var(--radius-md);
}

.gallery-item img {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.gallery-item:hover img {
  transform: scale(1.05);
}

.lightbox {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.89);
  backdrop-filter: blur(6px);
}

.lb-close {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  padding: 0.5rem;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.lb-close:hover {
  opacity: 1;
}

.lb-close svg {
  width: 28px;
  height: 28px;
}

.lb-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  padding: 1rem;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.lb-nav:hover {
  opacity: 1;
}

.lb-nav svg {
  width: 32px;
  height: 32px;
}

.lb-prev {
  left: 1rem;
}

.lb-next {
  right: 1rem;
}

.lb-image {
  max-width: 85vw;
  max-height: 85vh;
  object-fit: contain;
  border-radius: var(--radius-sm);
}

.lb-caption {
  position: absolute;
  bottom: 3.5rem;
  left: 50%;
  transform: translateX(-50%);
  color: #fff;
  font-size: 0.85rem;
  text-align: center;
  max-width: 600px;
}

.lb-counter {
  position: absolute;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.75rem;
  letter-spacing: 0.1em;
}

.lightbox-fade-enter-active,
.lightbox-fade-leave-active {
  transition: opacity 0.28s ease;
}

.lightbox-fade-enter-from,
.lightbox-fade-leave-to {
  opacity: 0;
}

@media (max-width: 1024px) {
  .content-grid {
    grid-template-columns: 1fr;
    gap: var(--space-8);
  }
}

@media (max-width: 640px) {
  .project-detail {
    padding: var(--space-6) 0 var(--space-10);
  }

  .gallery-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  }

  .lb-nav {
    padding: 0.5rem;
  }

  .lb-nav svg {
    width: 24px;
    height: 24px;
  }

  .lb-image {
    max-width: 95vw;
  }
}
</style>
