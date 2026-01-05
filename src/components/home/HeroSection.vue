<template>
  <section class="hero">
    <div class="overlay">
      <div class="content">
        <h1>
          Arquitetura como<br />
          narrativa espacial
        </h1>

        <p>
          Projetos residenciais e comerciais guiados
          por luz, contexto e identidade.
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  height: 100vh;
  background-image: url('@/assets/images/hero.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  display: flex;
  align-items: flex-end;
}

/* Camada para leitura do texto */
.overlay {
  width: 100%;
  padding: 4rem 3rem;
  background: linear-gradient(
    to top,
    var(--hero-overlay),
    transparent
  );
}

/* Conteúdo textual */
.content {
  max-width: 600px;
}

h1 {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 500;
  letter-spacing: 0.02em;
  color: var(--hero-text);
  margin-bottom: 1rem;
}

p {
  font-size: 1rem;
  line-height: 1.6;
  color: color-mix(
    in srgb,
    var(--hero-text) 85%,
    transparent
  );
  max-width: 480px;
}
</style>
