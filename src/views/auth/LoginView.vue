<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';

const auth = useAuthStore()
</script>

<template>
  <div>
    <h1>Login</h1>
    <button @click="auth.login({ email: 'test@test.com', password: 'password' })">
      Login
    </button>
  </div>
</template>
