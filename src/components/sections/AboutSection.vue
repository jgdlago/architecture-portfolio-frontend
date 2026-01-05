<template>
  <section class="about">
    <div class="image">
      <img src="@/assets/images/tmp/profile.png" alt="Arquiteta" />
    </div>

    <div class="content">
      <h2>Sobre</h2>
      <p>
        Arquitetura como experiência. Cada projeto nasce do diálogo entre espaço, contexto e quem o habita. Mais do que formas e materiais, a arquitetura é entendida como um processo sensível, capaz de traduzir necessidades, identidades e modos de viver em soluções espaciais coerentes e significativas.

        O desenvolvimento de cada projeto parte de uma escuta atenta — do lugar, do programa e das pessoas. A análise do entorno, da luz natural, da escala e das relações urbanas orienta decisões que buscam equilíbrio entre estética, funcionalidade e técnica. O resultado são espaços que se integram ao contexto e promovem conforto, fluidez e permanência.

        A prática arquitetônica aqui apresentada valoriza a clareza construtiva, o uso consciente dos materiais e a busca por soluções atemporais. Cada projeto é único, pensado para responder de forma precisa aos desafios propostos, sem perder de vista a sustentabilidade, a racionalidade dos processos e a qualidade da experiência espacial.

        Arquitetura como ferramenta de transformação — do espaço e da forma de habitar.
      </p>
    </div>
  </section>
</template>

<style scoped>
.about {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  padding: 6rem 3rem;
  background-color: var(--background);
}

.image img {
  width: 100%;
  object-fit: cover;
  filter: grayscale(100%);
}

.content h2 {
  font-size: 1.5rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  margin-bottom: 2rem;
}

.content p {
  font-size: 1rem;
  line-height: 1.8;
  color: var(--contrast-brown);
}
</style>
