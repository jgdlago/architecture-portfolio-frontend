<script setup lang="ts">
import ToastContainer from '@/components/ui/ToastContainer.vue';
import { usePageTracking } from '@/composables/usePageTracking';

usePageTracking()
</script>

<template>
  <RouterView v-slot="{ Component, route }">
    <Transition name="page-fade" mode="out-in">
      <component :is="Component" :key="route.path" />
    </Transition>
  </RouterView>
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

.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.24s ease, transform 0.24s ease;
}

.page-fade-enter-from,
.page-fade-leave-to {
  opacity: 0;
  transform: translateY(6px);
}

::view-transition-old(root),
::view-transition-new(root) {
  animation-duration: 260ms;
  animation-timing-function: ease;
}
</style>
