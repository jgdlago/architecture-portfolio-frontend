<script setup lang="ts">
import InstagramIcon from '@/assets/icons/instagram.svg?component';
import LinkedInIcon from '@/assets/icons/linkedin.svg?component';
import WhatsAppIcon from '@/assets/icons/whatsapp.svg?component';
import { EnvelopeIcon } from '@heroicons/vue/24/outline';
import { ref } from 'vue';

interface Form {
  name: string
  email: string
  message: string
}

const form = ref<Form>({
  name: '',
  email: '',
  message: '',
})

const sendEmail = () => {
  console.log('Enviando formulário:', form.value)
  alert('Mensagem enviada! ✅')
  form.value = { name: '', email: '', message: '' }
}
</script>

<template>
  <section class="contact">
    <header>
      <h2>Contato</h2>
      <p>Vamos conversar sobre o seu projeto ou tirar dúvidas.</p>
    </header>

    <div class="contact-content">

      <!-- Formulário -->
      <form @submit.prevent="sendEmail" class="contact-form">
        <span class="form-title">Envie uma mensagem</span>
        <input
          v-model="form.name"
          type="text"
          placeholder="Nome"
          required
        />
        <input
          v-model="form.email"
          type="email"
          placeholder="E-mail"
          required
        />
        <textarea
          v-model="form.message"
          placeholder="Mensagem"
          rows="5"
          required
        ></textarea>
        <button type="submit">Enviar</button>
      </form>

      <!-- Redes sociais -->
      <div class="socials">
        <a href="https://www.instagram.com/" target="_blank" class="social-link" aria-label="Instagram">
          <InstagramIcon class="icon" />
          <span class="social-title">Instagram</span>
        </a>
        <a href="https://www.linkedin.com/" target="_blank" class="social-link" aria-label="LinkedIn">
          <LinkedInIcon class="icon" />
          <span class="social-title">LinkedIn</span>
        </a>
        <a href="mailto:email@dominio.com" class="social-link" aria-label="E-mail">
          <EnvelopeIcon class="icon" />
          <span class="social-title">E-mail</span>
        </a>
        <a href="#" target="_blank" class="social-link" aria-label="WhatsApp">
          <WhatsAppIcon class="icon" />
          <span class="social-title">WhatsApp</span>
        </a>
      </div>

    </div>
  </section>
</template>

<style scoped>
.contact {
  padding: 6rem 3rem;
  background-color: var(--background);
  color: var(--primary-text);
}

.contact header {
  text-align: left;
  margin-bottom: 4rem;
}

.contact h2 {
  font-size: 1.8rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  margin-bottom: 1rem;
}

.contact p {
  font-size: 1rem;
  color: var(--contrast-brown);
}

/* Conteúdo */
.contact-content {
  display: flex;
  justify-content: space-between;
  gap: 4rem;
}

/* Redes sociais */
.socials {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  justify-content: flex-start;
}

.social-link {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  text-decoration: none;
  color: var(--primary-text);
  transition: transform 0.2s ease;
}

.social-link .icon {
  width: 28px;
  height: 28px;
  color: var(--primary-text);
  transition: color 0.3s ease, transform 0.2s ease;
}

.social-link:hover .icon,
.social-link:hover .social-title {
  color: var(--contrast-gold);
  transform: scale(1.1);
}

.social-title {
  font-size: 0.95rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--contrast-brown);
  transition: color 0.3s ease, transform 0.2s ease;
}

.icons {
  display: flex;
  gap: 1.5rem;
}

.icon {
  width: 36px;
  height: 36px;
  stroke: var(--primary-text);
  transition: stroke 0.3s ease, transform 0.3s ease;
}

.icon:hover {
  stroke: var(--contrast-gold);
  transform: scale(1.1);
}

/* Formulário */
.contact-form {
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background-color: color-mix(in srgb, var(--background) 90%, var(--contrast-brown) 10%);
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.05);
  max-width: 50%;
}

.form-title {
  font-size: 0.95rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--contrast-brown);
  margin-bottom: 1rem;
}

.contact-form input,
.contact-form textarea {
  padding: 0.9rem 1rem;
  border: 1px solid var(--contrast-brown);
  border-radius: 6px;
  background-color: var(--background);
  color: var(--primary-text);
  font-size: 0.95rem;
}

.contact-form input::placeholder,
.contact-form textarea::placeholder {
  color: var(--contrast-brown);
}

.contact-form button {
  align-self: flex-start;
  padding: 0.8rem 2rem;
  background-color: var(--contrast-gold);
  border: none;
  border-radius: 6px;
  color: var(--primary-text);
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.contact-form button:hover {
  background-color: var(--contrast-brown);
  transform: translateY(-2px);
}

/* Responsivo */
@media (max-width: 1024px) {
  .contact-content {
    flex-direction: column;
    gap: 3rem;
  }

  .socials {
    flex-direction: row;
    justify-content: center;
  }
}
</style>
