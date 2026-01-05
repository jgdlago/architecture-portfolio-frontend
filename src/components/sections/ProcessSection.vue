<template>
  <section class="process">
    <header>
      <h2>Processo</h2>
    </header>

    <div class="steps">
      <div class="step">
        <span class="index">01</span>
        <h3>Contexto</h3>
        <p>
          Leitura do lugar, da cidade e das relações que o espaço propõe.
        </p>
      </div>

      <div class="step">
        <span class="index">02</span>
        <h3>Conceito</h3>
        <p>
          Tradução das necessidades em uma ideia clara e estruturadora.
        </p>
      </div>

      <div class="step">
        <span class="index">03</span>
        <h3>Forma</h3>
        <p>
          Materialização do conceito em arquitetura precisa e atemporal.
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.process {
  padding: 6rem 3rem;
  background-color: var(--background);
  color: var(--primary-text);
}

.process header {
  margin-bottom: 4rem;
}

.process h2 {
  font-size: 1.5rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
}

.steps {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 3rem;
}

.step {
  max-width: 320px;
}

.index {
  font-size: 0.8rem;
  letter-spacing: 0.3em;
  color: var(--contrast-gold);
}

.step h3 {
  font-size: 1rem;
  margin: 1rem 0;
}

.step p {
  font-size: 0.9rem;
  line-height: 1.8;
  color: var(--contrast-brown);
}

@media (max-width: 768px) {
  .steps {
    grid-template-columns: 1fr;
  }
}
</style>
