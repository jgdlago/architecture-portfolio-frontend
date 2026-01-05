<template>
  <section class="experience">
    <header>
      <h2>Atuação</h2>
      <p>
        Arquitetura aplicada a diferentes escalas e contextos,
        sempre com atenção ao lugar e às pessoas.
      </p>
    </header>

    <div class="blocks">
      <div class="block">
        <h3>Tipologias</h3>
        <ul>
          <li>Residencial</li>
          <li>Comercial</li>
          <li>Institucional</li>
          <li>Interiores</li>
        </ul>
      </div>

      <div class="block">
        <h3>Experiência</h3>
        <ul>
          <li>+6 anos de prática profissional</li>
          <li>Projetos executivos e acompanhamento de obra</li>
          <li>Atuação do conceito à execução</li>
        </ul>
      </div>

      <div class="block">
        <h3>Atuação</h3>
        <ul>
          <li>Brasil</li>
          <li>Projetos remotos</li>
          <li>Contextos urbanos e naturais</li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
.experience {
  padding: 6rem 3rem;
  background-color: color-mix(
    in srgb,
    var(--background) 90%,
    transparent
  );
  color: var(--primary-text);
}

.experience header {
  max-width: 600px;
  margin-bottom: 4rem;
}

.experience h2 {
  font-size: 1.5rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  margin-bottom: 1.5rem;
}

.experience header p {
  font-size: 0.95rem;
  line-height: 1.8;
  color: var(--contrast-brown);
}

.blocks {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 3rem;
}

.block h3 {
  font-size: 0.9rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  margin-bottom: 1.5rem;
}

.block ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.block li {
  font-size: 0.85rem;
  line-height: 2;
  color: var(--primary-text);
}

@media (max-width: 768px) {
  .blocks {
    grid-template-columns: 1fr;
  }
}
</style>