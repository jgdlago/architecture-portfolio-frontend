<script setup lang="ts">
import MenuItem from "@/components/Atoms/MenuItem.vue";
import { useDark } from "@vueuse/core";

const isDark = useDark();
</script>

<template>
  <div class="w-11/12 mx-auto bg-background py-4 rounded-md relative mt-1">

    <div class="flex justify-center items-center space-x-4">
      <MenuItem text="Experiências" url="#" />
      <MenuItem text="Projetos" url="#" />
      <MenuItem text="Galeria" url="#" />
      <MenuItem text="Contato" url="#" />
    </div>

    <div class="absolute top-4 right-4">
      <span class="material-symbols-outlined cursor-pointer select-none text-primaryText hover:text-contrastGold"
          @click="isDark = !isDark">
        lightbulb
      </span>
    </div>
  </div>
</template>

<style scoped>

</style>
