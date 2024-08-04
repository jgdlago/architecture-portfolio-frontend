<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import NavBar from "@/components/Organisms/NavBar.vue";
import MainBanner from "@/components/Organisms/MainBanner.vue";
</script>

<template>
  <NavBar />
  <MainBanner />
  <RouterView />
</template>

<style scoped>

</style>
