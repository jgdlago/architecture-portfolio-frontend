<script setup lang="ts">
import { useTheme } from '@/composables/useTheme';
import { MoonIcon, SunIcon } from '@heroicons/vue/24/outline';
import { RouterLink, useRoute } from 'vue-router';

const { isDark, toggle } = useTheme()
const route = useRoute()

const isSectionActive = (hash: string): boolean => {
  if (route.path !== '/') {
    return false
  }

  const currentHash = route.hash || '#home'

  return currentHash === hash
}
</script>

<template>
  <header class="navbar">
    <!-- Marca -->
    <div class="brand">
      <span class="name">Iara Tedesco</span>
      <span class="role">Arquitetura & Urbanismo</span>
    </div>

    <!-- Lado direito -->
    <div class="right">
      <nav class="menu">
        <RouterLink :to="{ path: '/', hash: '#home' }" :class="{ active: isSectionActive('#home') }">Home</RouterLink>
        <RouterLink :to="{ path: '/', hash: '#projects' }" :class="{ active: isSectionActive('#projects') }">Projetos</RouterLink>
        <RouterLink :to="{ path: '/', hash: '#about' }" :class="{ active: isSectionActive('#about') }">Sobre</RouterLink>
        <RouterLink :to="{ path: '/', hash: '#contact' }" :class="{ active: isSectionActive('#contact') }">Contato</RouterLink>
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
.brand {
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

/* Ações */
.actions {
  display: flex;
  align-items: center;
}

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

@media (max-width: 960px) {
  .navbar {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    padding: 1.5rem;
  }

  .right {
    width: 100%;
    justify-content: space-between;
  }

  .menu {
    gap: 1.25rem;
    flex-wrap: wrap;
  }
}
</style>
