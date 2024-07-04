<template>
    <v-btn :to="to" text>
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
  