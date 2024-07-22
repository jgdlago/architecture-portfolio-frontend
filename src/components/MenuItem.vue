<template>
  <v-btn 
    :to="to"
    variant="plain"
    color="brown-lighten-2"
    class="cursor-pointer"
    >
    {{ text }}
  </v-btn>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps<{
  to: string;
  text: string;
}>();
</script>
