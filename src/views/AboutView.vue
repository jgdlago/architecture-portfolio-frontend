<script setup lang="ts">
import { fetchAboutContent, type AboutPayload } from '@/api/about'
import { resolveMediaUrl } from '@/api/http'
import Footer from '@/components/layout/Footer.vue'
import Navbar from '@/components/layout/Navbar.vue'
import { useScrollReveal } from '@/composables/useScrollReveal'
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
useScrollReveal()

function formatDate(date: string): string {
  const [year, month] = date.split('-')
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
  return `${months[Number(month) - 1]} ${year}`
}
</script>

<template>
  <div>
  <Navbar />

  <main class="about-page container">
    <div v-if="isLoading" class="loading">Carregando...</div>

    <template v-else-if="about">
      <section class="about-hero reveal-slide-up">
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

      <section v-if="bio" class="bio reveal-slide-up">
        <p>{{ bio }}</p>
      </section>

      <section v-if="experiences.length" class="experiences reveal-slide-up">
        <h2>Experiência Profissional</h2>
        <div class="timeline">
          <div v-for="(exp, index) in experiences" :key="exp.id" class="timeline-item reveal-slide-left" :style="{ transitionDelay: `${Math.min(index * 70, 280)}ms` }">
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
  </div>
</template>

<style scoped>
.about-page {
  padding: var(--space-16) 0 var(--space-12);
  max-width: var(--container-md);
}

.loading {
  padding: 4rem 0;
  text-align: center;
  color: var(--contrast-brown);
}

.about-hero {
  display: flex;
  gap: var(--space-10);
  align-items: center;
  margin-bottom: var(--space-12);
}

.avatar {
  flex-shrink: 0;
}

.avatar img {
  width: 210px;
  height: 210px;
  border-radius: 50%;
  object-fit: cover;
  filter: grayscale(20%);
  border: 2px solid color-mix(in srgb, var(--contrast-gold) 62%, transparent);
  box-shadow: 0 0 0 8px color-mix(in srgb, var(--contrast-gold) 12%, transparent);
}

.hero-text h1 {
  font-family: var(--font-family-heading);
  font-size: clamp(2rem, 5vw, 3.2rem);
  line-height: 1.05;
  margin: 0 0 0.4rem;
}

.headline {
  font-size: 1.06rem;
  color: var(--contrast-gold);
  margin: 0 0 var(--space-4);
}

.info-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.info-tags span {
  font-size: 0.7rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--contrast-brown);
  padding: 0.4rem 0.82rem;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: color-mix(in srgb, var(--surface) 92%, transparent);
}

.bio {
  margin-bottom: var(--space-12);
}

.bio p {
  margin: 0;
  font-size: 1.05rem;
  line-height: 1.95;
  color: var(--contrast-brown);
}

.experiences h2 {
  margin: 0 0 var(--space-8);
  font-family: var(--font-family-heading);
  font-size: clamp(1.7rem, 3.8vw, 2.3rem);
}

.timeline {
  position: relative;
  padding-left: 2.4rem;
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
  padding: 0.2rem 0 2rem;
}

.timeline-item:last-child {
  padding-bottom: 0;
}

.timeline-dot {
  position: absolute;
  left: -2.4rem;
  top: 0.3rem;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  border: 2px solid var(--contrast-gold);
  background: var(--background);
  transform: translateX(-0.5px);
}

.timeline-content h3 {
  margin: 0;
  font-size: 1.08rem;
  font-weight: 500;
}

.company {
  font-size: 0.9rem;
  color: var(--contrast-brown);
  margin: 0.15rem 0 0.35rem;
}

.period {
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--contrast-gold);
}

@media (max-width: 640px) {
  .about-page {
    padding: var(--space-12) 0 var(--space-10);
  }

  .about-hero {
    flex-direction: column;
    text-align: center;
    gap: var(--space-6);
    margin-bottom: var(--space-10);
  }

  .avatar img {
    width: 170px;
    height: 170px;
  }

  .info-tags {
    justify-content: center;
  }

  .timeline {
    padding-left: 1.7rem;
  }

  .timeline-dot {
    left: -1.7rem;
  }
}
</style>
