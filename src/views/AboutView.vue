<script setup lang="ts">
import { fetchAboutContent, type AboutPayload } from '@/api/about'
import { resolveMediaUrl } from '@/api/http'
import Footer from '@/components/layout/Footer.vue'
import Navbar from '@/components/layout/Navbar.vue'
import { computed, onMounted, ref } from 'vue'

const about = ref<AboutPayload | null>(null)
const isLoading = ref(true)

onMounted(async () => {
  try {
    about.value = await fetchAboutContent()
  } finally {
    isLoading.value = false
  }
})

const avatarUrl = computed(() => resolveMediaUrl(about.value?.profile?.avatar_path) || resolveMediaUrl(about.value?.settings?.image_path))
const displayName = computed(() => about.value?.user?.name ?? '')
const headline = computed(() => about.value?.profile?.headline?.value ?? '')
const bio = computed(() => about.value?.profile?.bio ?? about.value?.settings?.text ?? '')
const city = computed(() => about.value?.profile?.city ? `${about.value.profile.city.name}, ${about.value.profile.city.state_abbreviation}` : '')
const yearsExperience = computed(() => about.value?.profile?.years_experience)
const cau = computed(() => about.value?.user?.cau)
const experiences = computed(() => about.value?.experiences ?? [])

function formatDate(date: string): string {
  const [year, month] = date.split('-')
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
  return `${months[Number(month) - 1]} ${year}`
}
</script>

<template>
  <Navbar />

  <main class="about-page">
    <div v-if="isLoading" class="loading">Carregando...</div>

    <template v-else-if="about">
      <!-- Hero area -->
      <section class="about-hero">
        <div v-if="avatarUrl" class="avatar">
          <img :src="avatarUrl" :alt="displayName" />
        </div>

        <div class="hero-text">
          <h1>{{ displayName }}</h1>
          <p v-if="headline" class="headline">{{ headline }}</p>
          <div class="info-tags">
            <span v-if="city">{{ city }}</span>
            <span v-if="yearsExperience">{{ yearsExperience }} anos de experiência</span>
            <span v-if="cau">CAU {{ cau }}</span>
          </div>
        </div>
      </section>

      <!-- Bio -->
      <section v-if="bio" class="bio">
        <p>{{ bio }}</p>
      </section>

      <!-- Experiences -->
      <section v-if="experiences.length" class="experiences">
        <h2>Experiência Profissional</h2>
        <div class="timeline">
          <div v-for="exp in experiences" :key="exp.id" class="timeline-item">
            <div class="timeline-dot" />
            <div class="timeline-content">
              <h3>{{ exp.title }}</h3>
              <p v-if="exp.company" class="company">{{ exp.company }}</p>
              <span class="period">
                {{ formatDate(exp.start_date) }} —
                {{ exp.is_current ? 'Atual' : (exp.end_date ? formatDate(exp.end_date) : '') }}
              </span>
            </div>
          </div>
        </div>
      </section>
    </template>
  </main>

  <Footer />
</template>

<style scoped>
.about-page {
  padding: 4rem 3rem;
  max-width: 900px;
  margin: 0 auto;
}

.loading {
  padding: 4rem 0;
  text-align: center;
  color: var(--contrast-brown);
}

/* Hero */
.about-hero {
  display: flex;
  gap: 3rem;
  align-items: center;
  margin-bottom: 4rem;
}

.avatar {
  flex-shrink: 0;
}

.avatar img {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  object-fit: cover;
  filter: grayscale(60%);
}

.hero-text h1 {
  font-size: 2rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  margin: 0 0 0.4rem;
}

.headline {
  font-size: 1rem;
  color: var(--contrast-gold);
  margin: 0 0 1rem;
}

.info-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.info-tags span {
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--contrast-brown);
  padding: 0.3rem 0.8rem;
  border: 1px solid color-mix(in srgb, var(--contrast-brown) 25%, transparent);
  border-radius: 999px;
}

/* Bio */
.bio {
  margin-bottom: 4rem;
}

.bio p {
  font-size: 1.05rem;
  line-height: 1.9;
  color: var(--contrast-brown);
}

/* Experiences timeline */
.experiences h2 {
  font-size: 1rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  margin-bottom: 2rem;
}

.timeline {
  position: relative;
  padding-left: 2rem;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 6px;
  top: 0;
  bottom: 0;
  width: 1px;
  background: color-mix(in srgb, var(--contrast-brown) 20%, transparent);
}

.timeline-item {
  position: relative;
  padding-bottom: 2rem;
}

.timeline-item:last-child {
  padding-bottom: 0;
}

.timeline-dot {
  position: absolute;
  left: -2rem;
  top: 0.3rem;
  width: 13px;
  height: 13px;
  border-radius: 50%;
  border: 2px solid var(--contrast-gold);
  background: var(--background);
  transform: translateX(-0.5px);
}

.timeline-content h3 {
  font-size: 1rem;
  font-weight: 500;
  margin: 0 0 0.2rem;
}

.company {
  font-size: 0.9rem;
  color: var(--contrast-brown);
  margin: 0 0 0.3rem;
}

.period {
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--contrast-gold);
}

@media (max-width: 768px) {
  .about-page {
    padding: 3rem 1.5rem;
  }

  .about-hero {
    flex-direction: column;
    text-align: center;
    gap: 1.5rem;
  }

  .info-tags {
    justify-content: center;
  }
}
</style>
