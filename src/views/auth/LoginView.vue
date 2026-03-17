<script setup lang="ts">
import Navbar from '@/components/layout/Navbar.vue';
import { useAuthStore } from '@/stores/auth';
import { getApiErrorMessage, getFieldErrors, type FieldErrors } from '@/utils/apiErrors';
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const fieldErrors = ref<FieldErrors>({})
const isSubmitting = ref(false)

const redirectTo = computed(() => String(route.query.redirect || '/admin'))

const submit = async () => {
  if (isSubmitting.value) {
    return
  }

  errorMessage.value = ''
  fieldErrors.value = {}
  isSubmitting.value = true

  try {
    await auth.login({ email: email.value, password: password.value })
    await router.push(redirectTo.value)
  } catch (error) {
    fieldErrors.value = getFieldErrors(error)
    errorMessage.value = getApiErrorMessage(error, 'Nao foi possivel autenticar. Verifique email e senha.')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div>
  <Navbar />
  <main class="login-view">
    <form class="login-card" @submit.prevent="submit">
      <h1>Painel Administrativo</h1>
      <p>Entre para gerenciar portfolio, projetos e mensagens.</p>

      <label>
        <span>Email</span>
        <input v-model="email" type="email" required placeholder="admin@exemplo.com" />
        <small v-if="fieldErrors.email" class="field-error">{{ fieldErrors.email }}</small>
      </label>

      <label>
        <span>Senha</span>
        <input v-model="password" type="password" required placeholder="********" />
        <small v-if="fieldErrors.password" class="field-error">{{ fieldErrors.password }}</small>
      </label>

      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

      <button type="submit" :disabled="isSubmitting">
        {{ isSubmitting ? 'Entrando...' : 'Entrar' }}
      </button>
    </form>
  </main>
  </div>
</template>

<style scoped>
.login-view {
  min-height: calc(100vh - 96px);
  display: grid;
  place-items: center;
  padding: var(--space-8) var(--space-4);
}

.login-card {
  width: 100%;
  max-width: 450px;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  background: color-mix(in srgb, var(--surface-elevated) 92%, black 8%);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  padding: var(--space-8);
}

.login-card h1 {
  margin: 0;
  font-family: var(--font-family-heading);
  font-size: clamp(1.9rem, 5vw, 2.4rem);
  line-height: 1.08;
}

.login-card p {
  margin: 0;
  color: var(--contrast-brown);
  line-height: 1.7;
}

label {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

input {
  border: 1px solid color-mix(in srgb, var(--contrast-brown) 40%, transparent);
  border-radius: var(--radius-md);
  background: color-mix(in srgb, var(--background) 96%, transparent);
  color: var(--primary-text);
  padding: 0.84rem 0.9rem;
}

input:focus {
  border-color: color-mix(in srgb, var(--contrast-gold) 72%, transparent);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--contrast-gold) 16%, transparent);
  outline: none;
}

button {
  border: none;
  border-radius: var(--radius-md);
  padding: 0.82rem 1rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-size: 0.76rem;
  background: linear-gradient(
    120deg,
    color-mix(in srgb, var(--contrast-gold) 84%, white 16%),
    color-mix(in srgb, var(--contrast-gold) 68%, var(--contrast-brown) 32%)
  );
  color: var(--primary-text);
  cursor: pointer;
  transition: transform var(--transition-fast), filter var(--transition-fast);
}

button:hover {
  transform: translateY(-2px);
  filter: brightness(1.04);
}

.error {
  color: #b83333;
  font-size: 0.9rem;
}

.field-error {
  color: #b83333;
  font-size: 0.75rem;
}

@media (max-width: 640px) {
  .login-card {
    padding: var(--space-6);
  }
}
</style>
