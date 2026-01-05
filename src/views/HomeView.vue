<script setup lang="ts">
  import FeaturedProjects from '@/components/home/FeaturedProjects.vue';
import HeroSection from '@/components/home/HeroSection.vue';
import Navbar from '@/components/layout/Navbar.vue';
import AboutSection from '@/components/sections/AboutSection.vue';
import ContactSection from '../components/sections/ContactSection.vue';
import ExperienceSection from '../components/sections/ExperienceSection.vue';
import ProcessSection from '../components/sections/ProcessSection.vue';
</script>

<template>
  <Navbar />
  <HeroSection />
  <FeaturedProjects />
  <AboutSection />
  <ProcessSection />
  <ExperienceSection />
  <ContactSection />
</template>

