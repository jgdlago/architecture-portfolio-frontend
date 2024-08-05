<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import NavBar from "@/components/Organisms/NavBar.vue";
import HeaderSlideShow from "@/components/Molecules/HeaderSlideShow.vue";

</script>

<template>
  <NavBar />
  <HeaderSlideShow />

  <RouterView />
</template>

<style scoped>

</style>
