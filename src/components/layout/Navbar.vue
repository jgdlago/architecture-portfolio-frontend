<template>
  <header class="navbar">
    <div class="brand">
      <span class="name">Iara Tedesco</span>
      <span class="role">Arquitetura & Urbanismo</span>
    </div>

    <nav class="menu">
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/projects">Projetos</RouterLink>
      <RouterLink to="/about">Sobre</RouterLink>
      <RouterLink to="/contact">Contato</RouterLink>
    </nav>
  </header>
</template>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 2rem 3rem;
}

/* Marca */
.brand {
  display: flex;
  flex-direction: column;
  line-height: 1;
}

.name {
  font-size: 1.1rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--primary-text);
}

.role {
  font-size: 0.7rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--contrast-brown);
  margin-top: 0.3rem;
}

/* Menu */
.menu {
  display: flex;
  gap: 2.5rem;
}

.menu a {
  position: relative;
  text-decoration: none;
  color: var(--primary-text);
  font-size: 0.85rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  padding-bottom: 0.3rem;
}

/* Interação sutil */
.menu a::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;

  width: 0;
  height: 1px;
  background-color: var(--contrast-gold);

  transition: width 0.3s ease;
}

.menu a:hover::after,
.menu a.router-link-active::after {
  width: 100%;
}
</style>
