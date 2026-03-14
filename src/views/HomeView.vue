<script setup lang="ts">
import { fetchHomeContent, type HomeProjectItem } from '@/api/home';
import { resolveMediaUrl } from '@/api/http';
import FeaturedProjects from '@/components/home/FeaturedProjects.vue';
import HeroSection from '@/components/home/HeroSection.vue';
import Navbar from '@/components/layout/Navbar.vue';
import AboutSection from '@/components/sections/AboutSection.vue';
import { computed, onMounted, ref } from 'vue';
import Footer from '../components/layout/Footer.vue';
import ContactSection from '../components/sections/ContactSection.vue';
import ExperienceSection from '../components/sections/ExperienceSection.vue';
import ProcessSection from '../components/sections/ProcessSection.vue';

const settings = ref<Record<string, any>>({})
const featuredProjects = ref<HomeProjectItem[]>([])

const heroTitle = computed(() => settings.value.hero?.title ?? 'Arquitetura como narrativa espacial')
const heroSubtitle = computed(() => settings.value.hero?.subtitle ?? 'Projetos residenciais e comerciais guiados por luz, contexto e identidade.')
const aboutText = computed(() => settings.value.about?.text ?? undefined)
const aboutImage = computed(() => resolveMediaUrl(settings.value.about?.image_path) || undefined)

const footer = computed(() => settings.value.footer ?? {})
const process = computed(() => settings.value.process ?? {})
const experience = computed(() => settings.value.experience ?? {})
const contact = computed(() => settings.value.contact ?? {})

onMounted(async () => {
  try {
    const data = await fetchHomeContent()
    settings.value = data.settings ?? {}
    const featured = data.featured_projects
    featuredProjects.value = Array.isArray(featured)
      ? featured
      : featured?.data ?? []
  } catch {
    settings.value = {}
    featuredProjects.value = []
  }
})
</script>

<template>
  <div id="home">
    <Navbar />
    <HeroSection :title="heroTitle" :subtitle="heroSubtitle" />
  </div>

  <div id="projects">
    <FeaturedProjects :projects="featuredProjects" />
  </div>

  <div id="about">
    <AboutSection :text="aboutText" :image="aboutImage" />
  </div>

  <ProcessSection :title="process.title" :steps="process.steps" />
  <ExperienceSection :title="experience.title" :subtitle="experience.subtitle" :blocks="experience.blocks" />

  <div id="contact">
    <ContactSection
      :title="contact.title"
      :description="contact.description"
      :instagram-url="contact.instagram_url"
      :linkedin-url="contact.linkedin_url"
      :email="contact.email"
      :whatsapp-url="contact.whatsapp_url"
    />
  </div>

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
  />
</template>

