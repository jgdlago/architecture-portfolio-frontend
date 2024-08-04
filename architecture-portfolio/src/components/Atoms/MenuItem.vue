<script setup lang="ts">
import { defineProps } from 'vue';
interface Props {
  text: string;
  url: string;
}
const props = defineProps<Props>();
</script>

<template>

  <span class="px-12">
    <a href="{{ url }}" class="text-xl text-primaryText hover:text-accent">
      {{ props.text }}
    </a>
  </span>

</template>

<style scoped>

</style>
