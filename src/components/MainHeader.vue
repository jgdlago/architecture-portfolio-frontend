<template>
  <v-app-bar density="prominent" color="">
    <v-container class="d-flex justify-center align-center">
      <div class="text-center flex-grow-1">
        <MenuItem text="Experiências" to="experience" />
        <MenuItem text="Projetos" to="project" />
        <MenuItem text="Imagens" to="image" />
        <MenuItem text="Contato" to="contact" />
      </div>

      <v-icon @click="toggleTheme" class="theme-icon ml-auto">
        mdi-lightbulb
      </v-icon>
    </v-container>
  </v-app-bar>
</template>

<script setup lang="ts">
import MenuItem from './MenuItem.vue';
import { useTheme } from 'vuetify';

const theme = useTheme();

function toggleTheme() {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark';
}
</script>

<style scoped>
  .container {
    background: linear-gradient(135deg, #AED581, #DCEDC8);
  }

  .theme-icon {
    opacity: 0.6;
    transition: opacity 0.3s ease;
    color: whitesmoke;
    font-size: 32px;
  }

  .theme-icon:hover {
    opacity: 1;
    text-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  }
</style>
