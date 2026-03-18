<template>
  <footer class="footer">
    <div class="footer-wrapper container">
      <div class="footer-content">
        <div class="footer-section brand">
          <h3>{{ brandName }}</h3>
          <p>{{ brandSubtitle }}</p>
        </div>

        <div class="footer-section contact">
          <h4>Contato</h4>
          <ul>
            <li v-if="email">{{ email }}</li>
            <li v-if="phone">{{ phone }}</li>
            <li v-if="city">{{ city }}</li>
          </ul>
        </div>

        <div v-if="showSocial" class="footer-section social">
          <h4>Redes</h4>
          <ul>
            <li v-if="showInstagram"><a :href="instagramUrl" target="_blank" rel="noopener noreferrer">Instagram</a></li>
            <li v-if="showLinkedIn"><a :href="linkedinUrl" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
          </ul>
        </div>

        <div v-if="servicesItems.length" class="footer-section services">
          <h4>{{ servicesTitle }}</h4>
          <ul>
            <li v-for="service in servicesItems" :key="service">{{ service }}</li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <p v-if="copyrightText">{{ copyrightText }}</p>
        <p v-if="cau">{{ cau }}</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props =
withDefaults(
  defineProps<{
    brandName?: string
    brandSubtitle?: string
    email?: string
    phone?: string
    city?: string
    instagramUrl?: string
    linkedinUrl?: string
    copyrightText?: string
    cau?: string
    servicesTitle?: string
    servicesItems?: string[]
  }>(),
  {
    brandName: 'Iara Tedesco',
    brandSubtitle: 'Arquitetura e Urbanismo',
    email: 'contato@exemplo.com',
    phone: '+55 (51) 9999-9999',
    city: 'Passo Fundo, RS',
    instagramUrl: '#',
    linkedinUrl: '#',
    copyrightText: '© 2026 Todos os direitos reservados',
    cau: 'CAU/BR A304967-1',
    servicesTitle: 'Serviços',
    servicesItems: () => ['Projetos Arquitetônicos', 'Interiores', 'Consultoria'],
  },
)

const showInstagram = computed(() => Boolean(props.instagramUrl && props.instagramUrl !== '#'))
const showLinkedIn = computed(() => Boolean(props.linkedinUrl && props.linkedinUrl !== '#'))
const showSocial = computed(() => showInstagram.value || showLinkedIn.value)
</script>

<style scoped>
.footer {
  background-color: var(--background);
  color: var(--primary-text);
  border-top: 1px solid var(--border);
}

.footer-wrapper {
  padding: var(--space-20) 0 var(--space-10);
}

.footer-content {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) repeat(3, minmax(0, 1fr));
  gap: var(--space-8);
  margin-bottom: var(--space-12);
}

.footer-section.brand h3 {
  margin: 0 0 var(--space-3);
  font-family: var(--font-family-heading);
  font-size: clamp(1.7rem, 3vw, 2.2rem);
  line-height: 1;
}

.footer-section.brand p {
  margin: 0;
  font-size: 0.88rem;
  color: var(--contrast-brown);
  letter-spacing: 0.08em;
}

.footer-section h4 {
  margin: 0 0 var(--space-4);
  font-size: 0.72rem;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--contrast-gold);
}

.footer-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-section li {
  font-size: 0.86rem;
  line-height: 1.65;
  color: var(--primary-text);
}

.footer-section a {
  color: var(--primary-text);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.footer-section a:hover {
  color: var(--contrast-gold);
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-4);
  padding-top: var(--space-6);
  border-top: 1px solid color-mix(in srgb, var(--contrast-brown) 22%, transparent);
}

.footer-bottom p {
  margin: 0;
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  color: var(--contrast-brown);
}

@media (max-width: 1024px) {
  .footer-content {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-6);
  }

  .footer-section.brand {
    grid-column: 1 / -1;
  }
}

@media (max-width: 640px) {
  .footer-wrapper {
    padding: var(--space-10) 0 var(--space-6);
  }

  .footer-content {
    grid-template-columns: 1fr;
    gap: var(--space-4);
    margin-bottom: var(--space-7);
  }

  .footer-section.brand {
    grid-column: auto;
  }

  .footer-section.brand h3 {
    font-size: clamp(2rem, 9vw, 2.4rem);
  }

  .footer-section.brand p {
    margin-top: 0.35rem;
    letter-spacing: 0.14em;
    font-size: 0.73rem;
  }

  .footer-section h4 {
    margin-bottom: var(--space-2);
    letter-spacing: 0.18em;
  }

  .footer-section li {
    font-size: 0.82rem;
    line-height: 1.58;
  }

  .footer-bottom {
    flex-direction: column;
    gap: 0.4rem;
    padding-top: var(--space-4);
    text-align: center;
  }

  .footer-bottom p {
    letter-spacing: 0.08em;
  }
}
</style>