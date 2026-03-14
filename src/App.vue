<script setup lang="ts">
import ToastContainer from '@/components/ui/ToastContainer.vue';
import { usePageTracking } from '@/composables/usePageTracking';

usePageTracking()
</script>

<template>
  <RouterView />
  <ToastContainer />
</template>

<style>
body {
  background-color: var(--background);
  color: var(--primary-text);
  font-family: var(--font-family-base);
  font-size: var(--font-size-body);
  line-height: var(--line-height-body);
}
</style>
