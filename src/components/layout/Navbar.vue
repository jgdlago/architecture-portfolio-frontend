<script setup lang="ts">
import { useTheme } from '@/composables/useTheme';
import { Bars3Icon, MoonIcon, SunIcon, XMarkIcon } from '@heroicons/vue/24/outline';
import { ref, watch } from 'vue';
import { RouterLink, useRoute } from 'vue-router';

const { isDark, toggle } = useTheme()
const route = useRoute()
const mobileOpen = ref(false)

withDefaults(
  defineProps<{
    brandName?: string
    brandRole?: string
    homeLabel?: string
    projectsLabel?: string
    aboutLabel?: string
    contactLabel?: string
  }>(),
  {
    brandName: 'Iara Tedesco',
    brandRole: 'Arquitetura & Urbanismo',
    homeLabel: 'Home',
    projectsLabel: 'Projetos',
    aboutLabel: 'Sobre',
    contactLabel: 'Contato',
  },
)

const isSectionActive = (hash: string): boolean => {
  if (route.path !== '/') {
    return false
  }

  const currentHash = route.hash || '#home'

  return currentHash === hash
}

// Close mobile menu on route change
watch(() => route.fullPath, () => {
  mobileOpen.value = false
})
</script>

<template>
  <header class="navbar">
    <!-- Marca -->
    <div class="brand">
      <RouterLink to="/" class="brand-link">
        <span class="name">{{ brandName }}</span>
        <span class="role">{{ brandRole }}</span>
      </RouterLink>
    </div>

    <!-- Lado direito -->
    <div class="right" :class="{ open: mobileOpen }">
      <nav class="menu">
        <RouterLink :to="{ path: '/', hash: '#home' }" :class="{ active: isSectionActive('#home') }">{{ homeLabel }}</RouterLink>
        <RouterLink to="/projects" :class="{ active: route.path.startsWith('/projects') }">{{ projectsLabel }}</RouterLink>
        <RouterLink :to="{ path: '/', hash: '#about' }" :class="{ active: isSectionActive('#about') }">{{ aboutLabel }}</RouterLink>
        <RouterLink :to="{ path: '/', hash: '#contact' }" :class="{ active: isSectionActive('#contact') }">{{ contactLabel }}</RouterLink>
      </nav>

      <button
        class="theme-toggle"
        @click="toggle"
        aria-label="Alternar tema"
      >
        <SunIcon v-if="isDark" />
        <MoonIcon v-else />
      </button>
    </div>

    <!-- Mobile hamburger -->
    <button class="hamburger" @click="mobileOpen = !mobileOpen" aria-label="Menu">
      <XMarkIcon v-if="mobileOpen" />
      <Bars3Icon v-else />
    </button>
  </header>
</template>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 3rem;
  background-color: color-mix(
    in srgb,
    var(--background) 85%,
    transparent
  );
}

/* Marca */
.brand-link {
  text-decoration: none;
  display: flex;
  flex-direction: column;
  line-height: 1;
}

.name {
  font-size: 1.1rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--primary-text);
}

.role {
  font-size: 0.7rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--contrast-brown);
  margin-top: 0.3rem;
}

/* Menu */
.menu {
  display: flex;
  gap: 2.5rem;
}

.menu a {
  position: relative;
  text-decoration: none;
  color: var(--primary-text);
  font-size: 0.85rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  padding-bottom: 0.3rem;
}

.menu a::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 0;
  height: 1px;
  background-color: var(--contrast-gold);
  transition: width 0.3s ease;
}

.menu a:hover::after,
.menu a.active::after {
  width: 100%;
}

/* Theme toggle */
.theme-toggle {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.4rem;
  color: var(--primary-text);
  opacity: 0.7;
  transition: opacity 0.3s ease, transform 0.2s ease;
}

.theme-toggle svg {
  width: 20px;
  height: 20px;
}

.theme-toggle:hover {
  opacity: 1;
  transform: rotate(12deg);
}

.right {
  display: flex;
  align-items: center;
  gap: 2rem;
}

/* Hamburger - hidden on desktop */
.hamburger {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.4rem;
  color: var(--primary-text);
}

.hamburger svg {
  width: 24px;
  height: 24px;
}

@media (max-width: 768px) {
  .navbar {
    padding: 1.2rem 1.5rem;
    flex-wrap: wrap;
  }

  .hamburger {
    display: block;
  }

  .right {
    display: none;
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
    gap: 0;
    padding-top: 1.5rem;
  }

  .right.open {
    display: flex;
  }

  .menu {
    flex-direction: column;
    gap: 1rem;
    width: 100%;
  }

  .menu a {
    padding: 0.5rem 0;
    font-size: 0.9rem;
  }

  .theme-toggle {
    margin-top: 1rem;
  }
}
</style>
