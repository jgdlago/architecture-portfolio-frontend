<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import NavBar from "@/components/NavBar.vue";
import { useDark } from '@vueuse/core'

const isDark = useDark()
</script>

<template>
  <div class="grid place-content-center">
    <input type="checkbox" v-model="isDark">
  </div>

  <NavBar />
  <RouterView />
</template>

<style scoped>

</style>
