<template>
  <v-app-bar color="green-lighten-2" density="prominent">
    <v-container class="d-flex justify-center">
      <MenuItem text="Experiências" to="experience" />
      <MenuItem text="Projetos" to="project" />
      <MenuItem text="Imagens" to="image" />
      <MenuItem text="Contato" to="contact" />
    </v-container>

    <v-icon @click="toggleTheme">
      mdi-lightbulb
    </v-icon>

  </v-app-bar>
</template>

<script setup lang="ts">
  import MenuItem from './MenuItem.vue';

  import { useTheme } from 'vuetify'

  const theme = useTheme()

  function toggleTheme () {
    theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
  }
</script>
