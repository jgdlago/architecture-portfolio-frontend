<script setup lang="ts">
import { fetchHomeContent } from '@/api/home'
import { http } from '@/api/http'
import Footer from '@/components/layout/Footer.vue'
import Navbar from '@/components/layout/Navbar.vue'
import { useScrollReveal } from '@/composables/useScrollReveal'
import { computed, nextTick, onMounted, ref } from 'vue'
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
const settings = ref<Record<string, any>>({})
let latestLoadRequest = 0

const filteredProjects = computed(() => projects.value)
const footer = computed(() => settings.value.footer ?? {})
const footerServices = computed(() => settings.value.footer_services ?? {})
const navbar = computed(() => settings.value.navbar ?? {})
const seo = computed(() => settings.value.seo ?? {})
const { observe } = useScrollReveal()

const loadProjects = async (category?: string) => {
  const requestId = ++latestLoadRequest
  isLoading.value = true

  try {
    const loadedProjects = await fetchProjects(category)
    if (requestId !== latestLoadRequest) {
      return
    }

    projects.value = loadedProjects
  } finally {
    if (requestId === latestLoadRequest) {
      isLoading.value = false
      await nextTick()
      observe()
    }
  }
}

const setCategory = (slug?: string) => {
  activeCategory.value = slug
  loadProjects(slug)
}

onMounted(async () => {
  try {
    const [categoriesResponse, homeContent] = await Promise.all([
      http.get<Category[]>('/project-categories'),
      fetchHomeContent(),
    ])

    categories.value = categoriesResponse.data
    settings.value = homeContent.settings ?? {}

    if (seo.value.title) {
      document.title = `${seo.value.title} | Projetos`
    }

    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription && seo.value.description) {
      metaDescription.setAttribute('content', seo.value.description)
    }
  } catch { /* ignore */ }
  await loadProjects()
})
</script>

<template>
  <div>
  <Navbar
    :brand-name="navbar.brand_name"
    :brand-role="navbar.brand_role"
    :home-label="navbar.home_label"
    :projects-label="navbar.projects_label"
    :about-label="navbar.about_label"
    :contact-label="navbar.contact_label"
  />

  <main class="projects-page container">
    <header class="page-header reveal-slide-up">
      <h1>Projetos</h1>
      <p>Conheça nossos projetos de arquitetura e design.</p>
    </header>

    <nav v-if="categories.length" class="filters reveal-fade">
      <button :class="{ active: !activeCategory }" @click="setCategory(undefined)">Todos</button>
      <button v-for="cat in categories" :key="cat.id" :class="{ active: activeCategory === cat.slug }"
        @click="setCategory(cat.slug)">
        {{ cat.name }}
      </button>
    </nav>

    <section v-if="isLoading" class="loading-grid">
      <article v-for="index in 6" :key="index" class="skeleton-card">
        <div class="skeleton skeleton-image" />
        <div class="skeleton skeleton-text" style="width: 74%; margin-top: 1rem;" />
        <div class="skeleton skeleton-text" style="width: 50%; margin-top: 0.55rem;" />
      </article>
    </section>

    <div v-else-if="!projects.length" class="empty">
      <h2>Nenhum projeto publicado</h2>
      <p>Estamos preparando novos estudos e obras. Volte em breve para conferir as atualizações.</p>
      <RouterLink to="/" class="empty-cta">Voltar para a Home</RouterLink>
    </div>

    <section v-else class="grid">
      <RouterLink v-for="(project, index) in filteredProjects" :key="project.id" :to="`/projects/${project.slug}`"
        class="card reveal-slide-up" :style="{ transitionDelay: `${Math.min(index * 65, 320)}ms` }">
        <div class="card-image">
          <img v-if="project.cover_image_path" :src="resolveMediaUrl(project.cover_image_path)"
            :alt="project.title" />
          <div v-else class="no-image">Sem imagem</div>
          <span v-if="project.category" class="card-category">{{ project.category }}</span>

          <div class="card-overlay">
            <h3>{{ project.title }}</h3>
            <span>{{ project.category || 'Projeto' }}</span>
          </div>
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

  <Footer
    :brand-name="footer.brand_name"
    :brand-subtitle="footer.brand_subtitle"
    :email="footer.email"
    :phone="footer.phone"
    :city="footer.city"
    :instagram-url="footer.instagram_url"
    :linkedin-url="footer.linkedin_url"
    :copyright-text="footer.copyright"
    :cau="footer.cau"
    :services-title="footerServices.title"
    :services-items="footerServices.items"
  />
  </div>
</template>

<style scoped>
.projects-page {
  padding: var(--space-16) 0 var(--space-12);
  min-height: 60vh;
}

.page-header {
  max-width: 680px;
  margin-bottom: var(--space-10);
}

.page-header h1 {
  margin: 0 0 var(--space-4);
  font-family: var(--font-family-heading);
  font-size: clamp(2.2rem, 5vw, 3.4rem);
  line-height: 1.07;
}

.page-header p {
  margin: 0;
  color: var(--contrast-brown);
  font-size: 1rem;
  line-height: 1.74;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-bottom: var(--space-10);
}

.filters button {
  border: 1px solid var(--border);
  border-radius: 999px;
  padding: 0.45rem 1.1rem;
  font-size: 0.72rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  background: color-mix(in srgb, var(--surface) 94%, transparent);
  color: var(--primary-text);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.filters button.active,
.filters button:hover {
  background: color-mix(in srgb, var(--contrast-gold) 78%, white 22%);
  border-color: color-mix(in srgb, var(--contrast-gold) 70%, transparent);
}

.loading-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-6);
}

.skeleton-card {
  padding: var(--space-2);
}

.empty {
  border: 1px dashed var(--border);
  border-radius: var(--radius-lg);
  padding: var(--space-8);
  max-width: 640px;
  color: var(--contrast-brown);
}

.empty h2 {
  margin: 0;
  font-size: 1.1rem;
  color: var(--primary-text);
}

.empty p {
  margin: 0.7rem 0 1rem;
  line-height: 1.6;
}

.empty-cta {
  display: inline-block;
  text-decoration: none;
  padding: 0.62rem 1rem;
  border-radius: var(--radius-md);
  background: var(--contrast-gold);
  color: var(--primary-text);
  font-weight: 600;
}

.grid {
  display: grid;
  gap: var(--space-8) var(--space-6);
  grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
}

.card {
  text-decoration: none;
  color: inherit;
  cursor: pointer;
}

.card-image {
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}

.card-image img {
  width: 100%;
  aspect-ratio: 3 / 2;
  object-fit: cover;
  transition: transform 0.7s ease, filter var(--transition-base);
}

.card:hover .card-image img {
  transform: scale(1.08);
  filter: brightness(0.72);
}

.no-image {
  width: 100%;
  aspect-ratio: 3 / 2;
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
  border-radius: var(--radius-sm);
}

.card-overlay {
  position: absolute;
  inset: 0;
  padding: var(--space-6);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: var(--space-2);
  opacity: 0;
  background: linear-gradient(0deg, rgba(14, 11, 8, 0.78) 0%, rgba(14, 11, 8, 0.1) 55%, transparent 100%);
  transition: opacity var(--transition-base);
}

.card-overlay h3 {
  margin: 0;
  font-family: var(--font-family-heading);
  font-size: 1.45rem;
  line-height: 1.08;
  color: #f5f1e9;
}

.card-overlay span {
  font-size: 0.72rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: color-mix(in srgb, var(--contrast-gold) 82%, white 18%);
}

.card:hover .card-overlay {
  opacity: 1;
}

.card-body {
  margin-top: 1rem;
}

.card-body h3 {
  font-size: 1.05rem;
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
  font-size: 0.72rem;
  color: var(--contrast-gold);
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

@media (max-width: 1024px) {
  .loading-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .projects-page {
    padding: var(--space-10) 0 var(--space-8);
  }

  .page-header {
    margin-bottom: var(--space-6);
  }

  .page-header h1 {
    font-size: clamp(1.95rem, 8vw, 2.5rem);
  }

  .filters {
    margin-bottom: var(--space-6);
    flex-wrap: nowrap;
    overflow-x: auto;
    padding-bottom: 0.25rem;
    scrollbar-width: thin;
  }

  .filters button {
    flex: 0 0 auto;
    padding: 0.55rem 1rem;
    letter-spacing: 0.12em;
    font-size: 0.7rem;
  }

  .loading-grid,
  .grid {
    grid-template-columns: 1fr;
  }

  .grid {
    gap: var(--space-6);
  }

  .card {
    border-bottom: 1px solid color-mix(in srgb, var(--contrast-brown) 20%, transparent);
    padding-bottom: var(--space-6);
  }

  .card-overlay {
    display: none;
  }

  .card-category {
    font-size: 0.62rem;
    letter-spacing: 0.16em;
    padding: 0.22rem 0.54rem;
  }

  .card-body {
    margin-top: 0.8rem;
  }

  .card-body h3 {
    font-size: 1.12rem;
    line-height: 1.15;
    margin-bottom: 0.45rem;
  }

  .card-body p {
    margin-bottom: 0.7rem;
  }

  .card-meta {
    flex-wrap: wrap;
    gap: 0.5rem 1rem;
    letter-spacing: 0.14em;
  }

  .empty {
    padding: var(--space-6);
  }
}
</style>
