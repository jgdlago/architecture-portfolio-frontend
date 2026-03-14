<script setup lang="ts">
import Navbar from '@/components/layout/Navbar.vue';
import { useAuthStore } from '@/stores/auth';
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const isSubmitting = ref(false)

const redirectTo = computed(() => String(route.query.redirect || '/admin'))

const submit = async () => {
  if (isSubmitting.value) {
    return
  }

  errorMessage.value = ''
  isSubmitting.value = true

  try {
    await auth.login({ email: email.value, password: password.value })
    await router.push(redirectTo.value)
  } catch {
    errorMessage.value = 'Nao foi possivel autenticar. Verifique email e senha.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <Navbar />
  <main class="login-view">
    <form class="login-card" @submit.prevent="submit">
      <h1>Painel Administrativo</h1>
      <p>Entre para gerenciar portfolio, projetos e mensagens.</p>

      <label>
        <span>Email</span>
        <input v-model="email" type="email" required placeholder="admin@exemplo.com" />
      </label>

      <label>
        <span>Senha</span>
        <input v-model="password" type="password" required placeholder="********" />
      </label>

      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

      <button type="submit" :disabled="isSubmitting">
        {{ isSubmitting ? 'Entrando...' : 'Entrar' }}
      </button>
    </form>
  </main>
</template>

<style scoped>
.login-view {
  min-height: calc(100vh - 96px);
  display: grid;
  place-items: center;
  padding: 2rem;
}

.login-card {
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: color-mix(in srgb, var(--background) 92%, black 8%);
  border: 1px solid color-mix(in srgb, var(--contrast-brown) 35%, transparent);
  border-radius: 14px;
  padding: 2rem;
}

.login-card h1 {
  margin: 0;
  font-size: 1.4rem;
}

.login-card p {
  margin: 0;
  color: var(--contrast-brown);
}

label {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

input {
  border: 1px solid color-mix(in srgb, var(--contrast-brown) 50%, transparent);
  border-radius: 8px;
  background: var(--background);
  color: var(--primary-text);
  padding: 0.8rem 0.9rem;
}

button {
  border: none;
  border-radius: 8px;
  padding: 0.8rem 1rem;
  font-weight: 600;
  background: var(--contrast-gold);
  color: var(--primary-text);
  cursor: pointer;
}

.error {
  color: #b83333;
  font-size: 0.9rem;
}
</style>
