<template>
  <main>
    <Navbar />
    <ContactSection />
    <Footer />
  </main>
</template>

<script setup lang="ts">
import Footer from '@/components/layout/Footer.vue';
import Navbar from '@/components/layout/Navbar.vue';
import ContactSection from '@/components/sections/ContactSection.vue';
import { applySeo } from '@/composables/useSeo';
import { onMounted } from 'vue';

onMounted(() => {
  applySeo({
    title: 'Contato | Portfólio de Arquitetura',
    description: 'Fale com a arquiteta para iniciar seu projeto residencial ou comercial.',
    path: '/contact',
  })
})
</script>
