<template>
  <section class="featured">
    <header class="header">
      <h2>Projetos Selecionados</h2>
      <p>Uma curadoria dos trabalhos mais representativos.</p>
    </header>

    <div class="grid">
      <article
        v-for="project in projects"
        :key="project.id"
        class="project"
      >
        <div class="image-wrapper">
          <img :src="project.image" :alt="project.title" />
        </div>

        <div class="info">
          <h3>{{ project.title }}</h3>
          <span>{{ project.type }}</span>
        </div>
      </article>
    </div>
  </section>
</template>

<!-- Mock para testes -->
<script setup lang="ts">
import image1 from '@/assets/images/tmp/image-1.jpg'
import image2 from '@/assets/images/tmp/image-2.jpg'
import image3 from '@/assets/images/tmp/image-3.jpg'
import image4 from '@/assets/images/tmp/image-4.jpg'

interface Project {
  id: number
  title: string
  type: string
  image: string
}

const projects: Project[] = [
  {
    id: 1,
    title: 'Residência Dal Lago',
    type: 'Residencial',
    image: image1,
  },
  {
    id: 2,
    title: 'Mansão Fazendas Tedesco',
    type: 'Residencial / Comercial',
    image: image2,
  },
  {
    id: 3,
    title: 'Casa De Campo',
    type: 'Residencial',
    image: image3,
  },
  {
    id: 4,
    title: 'Estúdios Netflix',
    type: 'Comercial',
    image: image4,
  },
]
</script>


<style scoped>
.featured {
  padding: 6rem 3rem;
  background-color: var(--background);
  color: var(--primary-text);
}

.header {
  max-width: 600px;
  margin-bottom: 4rem;
}

.header h2 {
  font-size: 1.8rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 1rem;
}

.header p {
  font-size: 0.95rem;
  color: var(--contrast-brown);
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 3rem;
}

.project {
  cursor: pointer;
}

.image-wrapper {
  overflow: hidden;
}

.image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.project:hover img {
  transform: scale(1.05);
}

.info {
  margin-top: 1rem;
}

.info h3 {
  font-size: 1rem;
  font-weight: 500;
}

.info span {
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--contrast-gold);
}

@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
  }

  .featured {
    padding: 4rem 1.5rem;
  }
}

</style>

