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
    <div class="brand">
      <RouterLink to="/" class="brand-link">
        <span class="name">{{ brandName }}</span>
        <span class="role">{{ brandRole }}</span>
      </RouterLink>
    </div>

    <div class="right" :class="{ open: mobileOpen }">
      <nav class="menu">
        <RouterLink :to="{ path: '/', hash: '#home' }" :class="{ active: isSectionActive('#home') }">{{ homeLabel }}</RouterLink>
        <RouterLink to="/projects" :class="{ active: route.path.startsWith('/projects') }">{{ projectsLabel }}</RouterLink>
        <RouterLink :to="{ path: '/', hash: '#about' }" :class="{ active: isSectionActive('#about') }">{{ aboutLabel }}</RouterLink>
        <RouterLink :to="{ path: '/', hash: '#contact' }" :class="{ active: isSectionActive('#contact') }">{{ contactLabel }}</RouterLink>
      </nav>

      <button class="theme-toggle" @click="toggle($event)" aria-label="Alternar tema">
        <SunIcon v-if="isDark" />
        <MoonIcon v-else />
      </button>
    </div>

    <button class="hamburger" @click="mobileOpen = !mobileOpen" aria-label="Menu">
      <XMarkIcon v-if="mobileOpen" />
      <Bars3Icon v-else />
    </button>

    <div v-if="mobileOpen" class="menu-overlay" @click="mobileOpen = false" />
  </header>
</template>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 120;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.2rem 1.6rem;
  border-bottom: 1px solid var(--border);
}

.navbar::before {
  content: '';
  position: absolute;
  inset: 0;
  background: color-mix(in srgb, var(--surface) 82%, transparent);
  backdrop-filter: blur(12px);
  z-index: -1;
}

.brand-link {
  text-decoration: none;
  display: flex;
  flex-direction: column;
  line-height: 1;
}

.name {
  font-family: var(--font-family-heading);
  font-size: clamp(1.25rem, 2.4vw, 1.7rem);
  font-weight: 600;
  letter-spacing: 0.06em;
  color: var(--primary-text);
}

.role {
  font-size: 0.64rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--contrast-brown);
  margin-top: 0.45rem;
}

.menu {
  display: flex;
  gap: 1.9rem;
}

.menu a {
  position: relative;
  text-decoration: none;
  color: var(--primary-text);
  font-size: 0.78rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  padding-bottom: 0.35rem;
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

.theme-toggle {
  width: 2.2rem;
  height: 2.2rem;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: color-mix(in srgb, var(--surface-elevated) 76%, transparent);
  display: grid;
  place-items: center;
  cursor: pointer;
  color: var(--primary-text);
  opacity: 0.88;
  transition: transform var(--transition-fast), opacity var(--transition-fast), background var(--transition-fast);
}

.theme-toggle svg {
  width: 17px;
  height: 17px;
}

.theme-toggle:hover {
  opacity: 1;
  transform: rotate(10deg) translateY(-1px);
  background: color-mix(in srgb, var(--contrast-gold) 24%, var(--surface-elevated));
}

.right {
  display: flex;
  align-items: center;
  gap: 1.2rem;
}

.hamburger {
  display: none;
  border: 1px solid var(--border);
  border-radius: 999px;
  width: 2.2rem;
  height: 2.2rem;
  background: color-mix(in srgb, var(--surface-elevated) 76%, transparent);
  cursor: pointer;
  place-items: center;
  color: var(--primary-text);
}

.hamburger svg {
  width: 18px;
  height: 18px;
}

.menu-overlay {
  display: none;
}

@media (min-width: 768px) {
  .navbar {
    padding: 1.3rem 2.4rem;
  }
}

@media (max-width: 768px) {
  .hamburger {
    display: grid;
    z-index: 123;
  }

  .right {
    position: fixed;
    inset: 0;
    z-index: 122;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    background: color-mix(in srgb, var(--surface-elevated) 93%, black 7%);
    transform: translateY(-104%);
    transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
  }

  .right.open {
    transform: translateY(0);
  }

  .menu {
    flex-direction: column;
    align-items: center;
    gap: 1.4rem;
  }

  .menu a {
    font-size: 1rem;
    letter-spacing: 0.22em;
    padding: 0;
  }

  .theme-toggle {
    width: 2.7rem;
    height: 2.7rem;
  }

  .menu-overlay {
    display: block;
    position: fixed;
    inset: 0;
    z-index: 121;
    background: rgba(0, 0, 0, 0.34);
    backdrop-filter: blur(2px);
  }
}
</style>
