<script setup lang="ts">
  import { defineProps } from 'vue';

  interface Props {
    text: string;
    url: string;
  }
  const props = defineProps<Props>();
</script>

<template>
  <button href="{{ url }}" class="bg-contrastGold text-primaryText rounded-md p-2">
    {{ props.text }}
  </button>
</template>

<style scoped>

</style>