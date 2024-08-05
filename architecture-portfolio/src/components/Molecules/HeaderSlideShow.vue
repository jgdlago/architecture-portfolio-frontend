<script setup lang="ts">
import { onMounted } from 'vue';
import Swiper from 'swiper';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/swiper-bundle.css';

onMounted(() => {
  new Swiper('.swiper', {
    modules: [Navigation, Autoplay],
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
  });
});
</script>

<template>
  <div class="swiper">

    <div class="swiper-wrapper">

      <div class="swiper-slide">
        <img src="https://images.pexels.com/photos/245240/pexels-photo-245240.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Slide 1" />
      </div>
      <div class="swiper-slide">
        <img src="https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Slide 2" />
      </div>
      <div class="swiper-slide">
        <img src="https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Slide 3" />
      </div>
    </div>

    <div class="swiper-button-prev"></div>
    <div class="swiper-button-next"></div>
  </div>
</template>

<style scoped>
.swiper-slide {
  height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.swiper-slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.swiper-button-prev, .swiper-button-next {
  color: var(--primary-text);
}

</style>
