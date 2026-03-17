<script setup lang="ts">
import InstagramIcon from '@/assets/icons/instagram.svg?component';
import LinkedInIcon from '@/assets/icons/linkedin.svg?component';
import WhatsAppIcon from '@/assets/icons/whatsapp.svg?component';
import { useScrollReveal } from '@/composables/useScrollReveal';
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

useScrollReveal()
</script>

<template>
  <section class="contact container">
    <header class="reveal-slide-up">
      <h2>{{ title }}</h2>
      <p>{{ description }}</p>
    </header>

    <div class="blocks">

      <div class="block form-block reveal-slide-up">
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

      <div class="block socials-block reveal-slide-up" style="transition-delay: 90ms;">
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
  padding: var(--space-20) 0;
  background-color: var(--background);
  color: var(--primary-text);
}

.contact header {
  max-width: 600px;
  margin-bottom: var(--space-10);
}

.contact h2 {
  margin: 0 0 var(--space-4);
  font-family: var(--font-family-heading);
  font-size: clamp(2rem, 4.3vw, 3rem);
  line-height: 1.1;
}

.contact p {
  margin: 0;
  font-size: 1rem;
  color: var(--contrast-brown);
  line-height: 1.8;
}

.blocks {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-10);
}

.form-block .form-title {
  display: inline-block;
  margin-bottom: var(--space-4);
  font-size: 0.82rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--contrast-brown);
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  background-color: color-mix(in srgb, var(--surface-elevated) 92%, transparent);
  padding: var(--space-8);
  border-radius: var(--radius-xl);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-lg);
}

.contact-form input,
.contact-form textarea {
  padding: 0.88rem 0.95rem;
  border: 1px solid color-mix(in srgb, var(--contrast-brown) 36%, transparent);
  border-radius: var(--radius-md);
  background-color: color-mix(in srgb, var(--background) 95%, transparent);
  color: var(--primary-text);
  font-size: 0.92rem;
}

.contact-form input::placeholder,
.contact-form textarea::placeholder {
  color: color-mix(in srgb, var(--contrast-brown) 86%, transparent);
}

.contact-form input:focus,
.contact-form textarea:focus {
  border-color: color-mix(in srgb, var(--contrast-gold) 70%, var(--border));
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--contrast-gold) 18%, transparent);
  outline: none;
}

.contact-form button {
  align-self: flex-start;
  padding: 0.78rem 1.8rem;
  background: linear-gradient(
    120deg,
    color-mix(in srgb, var(--contrast-gold) 84%, white 16%),
    color-mix(in srgb, var(--contrast-gold) 66%, var(--contrast-brown) 34%)
  );
  border: none;
  border-radius: var(--radius-md);
  color: var(--primary-text);
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  font-size: 0.74rem;
  cursor: pointer;
  transition: transform var(--transition-fast), filter var(--transition-fast);
}

.contact-form button:hover {
  transform: translateY(-2px);
  filter: brightness(1.05);
}

.form-error {
  margin: 0;
  color: #b83333;
  font-size: 0.82rem;
}

.socials-block h3 {
  margin: 0 0 var(--space-6);
  font-size: 0.86rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--contrast-gold);
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
  gap: 1rem;
  text-decoration: none;
  color: var(--primary-text);
  transition: transform var(--transition-fast);
}

.social-link .icon {
  width: 30px;
  height: 30px;
  color: var(--primary-text);
  transition: color var(--transition-fast), transform var(--transition-fast);
}

.social-link:hover .icon,
.social-link:hover span {
  color: var(--contrast-gold);
  transform: scale(1.08);
}

.socials-block span {
  font-size: 0.88rem;
  letter-spacing: 0.13em;
  text-transform: uppercase;
  color: var(--contrast-brown);
}

@media (max-width: 1024px) {
  .blocks {
    grid-template-columns: 1fr;
    gap: var(--space-8);
  }
}

@media (max-width: 640px) {
  .contact {
    padding: var(--space-16) 0;
  }

  .contact-form {
    padding: var(--space-6);
  }
}
</style>
