<script setup lang="ts">
withDefaults(
  defineProps<{
    open: boolean
    title?: string
    message?: string
    confirmText?: string
    cancelText?: string
    danger?: boolean
  }>(),
  {
    title: 'Confirmar ação',
    message: 'Tem certeza que deseja continuar?',
    confirmText: 'Confirmar',
    cancelText: 'Cancelar',
    danger: false,
  },
)

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()
</script>

<template>
  <div v-if="open" class="overlay" role="dialog" aria-modal="true" :aria-label="title">
    <div class="dialog">
      <h3>{{ title }}</h3>
      <p>{{ message }}</p>
      <div class="actions">
        <button type="button" class="btn-secondary" @click="emit('cancel')">{{ cancelText }}</button>
        <button type="button" :class="['btn-primary', { danger } ]" @click="emit('confirm')">{{ confirmText }}</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  z-index: 1200;
  display: grid;
  place-items: center;
  background: rgba(0, 0, 0, 0.45);
  padding: 1rem;
}

.dialog {
  width: min(420px, 100%);
  background: var(--background);
  color: var(--primary-text);
  border-radius: 12px;
  border: 1px solid color-mix(in srgb, var(--contrast-brown) 24%, transparent);
  box-shadow: var(--shadow-md);
  padding: 1rem;
}

.dialog h3 {
  margin: 0 0 0.4rem;
  font-size: 1rem;
}

.dialog p {
  margin: 0;
  color: var(--contrast-brown);
  line-height: 1.5;
  font-size: 0.9rem;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1rem;
}

.actions button {
  border: none;
  border-radius: 8px;
  padding: 0.5rem 0.9rem;
  cursor: pointer;
  font-weight: 600;
}

.btn-secondary {
  background: color-mix(in srgb, var(--contrast-brown) 18%, transparent);
  color: var(--primary-text);
}

.btn-primary {
  background: var(--contrast-gold);
  color: var(--primary-text);
}

.btn-primary.danger {
  background: color-mix(in srgb, #b83333 28%, transparent);
  color: #b83333;
}
</style>
