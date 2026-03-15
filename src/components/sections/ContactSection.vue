<script setup lang="ts">
import InstagramIcon from '@/assets/icons/instagram.svg?component';
import LinkedInIcon from '@/assets/icons/linkedin.svg?component';
import WhatsAppIcon from '@/assets/icons/whatsapp.svg?component';
import { useToast } from '@/composables/useToast';
import { getApiErrorMessage } from '@/utils/apiErrors';
import { EnvelopeIcon } from '@heroicons/vue/24/outline';
import { ref } from 'vue';
import { http } from '../../api/http';

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

const isSubmitting = ref(false)
const toast = useToast()
const formError = ref('')

withDefaults(
  defineProps<{
    title?: string
    description?: string
    instagramUrl?: string
    linkedinUrl?: string
    email?: string
    whatsappUrl?: string
  }>(),
  {
    title: 'Contato',
    description: 'Vamos conversar sobre o seu projeto ou tirar duvidas.',
    instagramUrl: 'https://www.instagram.com/',
    linkedinUrl: 'https://www.linkedin.com/',
    email: 'email@dominio.com',
    whatsappUrl: '#',
  },
)

const sendEmail = async () => {
  if (isSubmitting.value) {
    return
  }

  if (form.value.name.trim().length < 2) {
    formError.value = 'Informe um nome com pelo menos 2 caracteres.'
    return
  }

  if (!/.+@.+\..+/.test(form.value.email)) {
    formError.value = 'Informe um e-mail válido.'
    return
  }

  if (form.value.message.trim().length < 10) {
    formError.value = 'A mensagem deve ter pelo menos 10 caracteres.'
    return
  }

  formError.value = ''

  isSubmitting.value = true

  try {
    await http.post('/contact-messages', form.value)
    toast.success('Mensagem enviada com sucesso!')
    form.value = { name: '', email: '', message: '' }
  } catch (error) {
    toast.error(getApiErrorMessage(error, 'Não foi possível enviar a mensagem. Tente novamente.'))
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <section class="contact">
    <header>
      <h2>{{ title }}</h2>
      <p>{{ description }}</p>
    </header>

    <div class="blocks">

      <!-- Formulário -->
      <div class="block form-block">
        <span class="form-title">Envie uma mensagem</span>
        <form @submit.prevent="sendEmail" class="contact-form">
          <input v-model="form.name" type="text" placeholder="Nome" required />
          <input v-model="form.email" type="email" placeholder="E-mail" required />
          <textarea v-model="form.message" placeholder="Mensagem" rows="5" required></textarea>
          <p v-if="formError" class="form-error">{{ formError }}</p>
          <button type="submit" :disabled="isSubmitting">
            {{ isSubmitting ? 'Enviando...' : 'Enviar' }}
          </button>
        </form>
      </div>

      <!-- Redes sociais -->
      <div class="block socials-block">
        <h3>Redes sociais</h3>
        <ul>
          <li>
            <a :href="instagramUrl" target="_blank" class="social-link" aria-label="Instagram">
              <InstagramIcon class="icon" />
              <span>Instagram</span>
            </a>
          </li>
          <li>
            <a :href="linkedinUrl" target="_blank" class="social-link" aria-label="LinkedIn">
              <LinkedInIcon class="icon" />
              <span>LinkedIn</span>
            </a>
          </li>
          <li>
            <a :href="`mailto:${email}`" class="social-link" aria-label="E-mail">
              <EnvelopeIcon class="icon" />
              <span>E-mail</span>
            </a>
          </li>
          <li>
            <a :href="whatsappUrl" target="_blank" class="social-link" aria-label="WhatsApp">
              <WhatsAppIcon class="icon" />
              <span>WhatsApp</span>
            </a>
          </li>
        </ul>
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
  max-width: 600px;
  margin-bottom: 4rem;
}

.contact h2 {
  font-size: 1.5rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  margin-bottom: 1rem;
}

.contact p {
  font-size: 0.95rem;
  color: var(--contrast-brown);
  line-height: 1.8;
}

/* Grid de blocos */
.blocks {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 4rem;
}

/* Formulário */
.form-block .form-title {
  font-size: 0.95rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--contrast-brown);
  margin-bottom: 1rem;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background-color: color-mix(in srgb, var(--background) 90%, var(--contrast-brown) 10%);
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.05);
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

.form-error {
  margin: 0;
  color: #c0392b;
  font-size: 0.82rem;
}

/* Redes sociais */
.socials-block h3 {
  font-size: 0.9rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  margin-bottom: 1.5rem;
}

.socials-block ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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
.social-link:hover span {
  color: var(--contrast-gold);
  transform: scale(1.1);
}

.socials-block span {
  font-size: 0.95rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--contrast-brown);
}

/* Responsivo */
@media (max-width: 1024px) {
  .blocks {
    grid-template-columns: 1fr;
  }
}
</style>
