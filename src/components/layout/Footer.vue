<template>
  <footer class="footer">
    <div class="footer-wrapper">
      <div class="footer-content">
        <div class="footer-section brand">
          <h3>Iara Tedesco</h3>
          <p>Arquitetura e Urbanismo</p>
        </div>

        <div class="footer-section contact">
          <h4>Contato</h4>
          <ul>
            <li>contato@exemplo.com</li>
            <li>+55 (51) 9999-9999</li>
            <li>Passo Fundo, RS</li>
          </ul>
        </div>

        <div class="footer-section social">
          <h4>Redes</h4>
          <ul>
            <li><a href="#" target="_blank">Instagram</a></li>
            <li><a href="#" target="_blank">LinkedIn</a></li>
          </ul>
        </div>

        <div class="footer-section services">
          <h4>Serviços</h4>
          <ul>
            <li>Projetos Arquitetônicos</li>
            <li>Interiores</li>
            <li>Consultoria</li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <p>© 2026 Todos os direitos reservados</p>
        <p>CAU/BR A304967-1</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background-color: var(--background);
  color: var(--primary-text);
  border-top: 1px solid color-mix(
    in srgb,
    var(--contrast-brown) 20%,
    transparent
  );
}

.footer-wrapper {
  padding: 6rem 3rem 3rem;
}

.footer-content {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 1fr;
  gap: 3rem;
  margin-bottom: 4rem;
}

.footer-section.brand h3 {
  font-size: 1.1rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
}

.footer-section.brand p {
  font-size: 0.85rem;
  color: var(--contrast-brown);
  letter-spacing: 0.1em;
}

.footer-section h4 {
  font-size: 0.8rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  margin-bottom: 1.5rem;
  color: var(--contrast-gold);
}

.footer-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-section li {
  font-size: 0.85rem;
  line-height: 2;
  color: var(--primary-text);
}

.footer-section a {
  color: var(--primary-text);
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-section a:hover {
  color: var(--contrast-gold);
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 2rem;
  border-top: 1px solid color-mix(
    in srgb,
    var(--contrast-brown) 15%,
    transparent
  );
}

.footer-bottom p {
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  color: var(--contrast-brown);
}

@media (max-width: 1024px) {
  .footer-content {
    grid-template-columns: repeat(2, 1fr);
  }

  .footer-section.brand {
    grid-column: 1 / -1;
  }
}

@media (max-width: 768px) {
  .footer-wrapper {
    padding: 4rem 3rem 2rem;
  }

  .footer-content {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }

  .footer-section.brand {
    grid-column: auto;
  }

  .footer-bottom {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }
}
</style>